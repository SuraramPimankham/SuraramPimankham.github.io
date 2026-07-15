using DotnetMVC.Data;
using DotnetMVC.Models;
using Microsoft.EntityFrameworkCore;

namespace DotnetMVC.Services;

public class MemberService : IMemberService
{
    private readonly AppDbContext _db;
    private readonly IFileStorage _files;
    private readonly ISchemaService _schema;

    public MemberService(AppDbContext db, IFileStorage files, ISchemaService schema)
    {
        _db = db;
        _files = files;
        _schema = schema;
    }

    public async Task<IReadOnlyList<Dictionary<string, object?>>> GetAllAsync(IReadOnlyDictionary<string, string>? filter = null)
    {
        filter ??= new Dictionary<string, string>();
        var schema = _schema.GetSchema();
        var query = FieldFilterHelper.ApplyColumnFilters(_db.Members.AsQueryable(), schema, filter);

        var members = await query.OrderByDescending(x => x.UpdatedAt).ToListAsync();
        var results = members.Select(m => MemberMapper.ToApiObject(m, schema)).ToList();
        return FieldFilterHelper.ApplyExtraFilters(results, schema, filter);
    }

    public async Task<Dictionary<string, object?>?> GetByIdAsync(int id)
    {
        var member = await _db.Members.FindAsync(id);
        return member is null ? null : MemberMapper.ToApiObject(member, _schema.GetSchema());
    }

    public async Task<Dictionary<string, object?>> CreateAsync(Dictionary<string, string> fields, IFormFileCollection files)
    {
        var schema = _schema.GetSchema();
        var member = new Member
        {
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        MemberMapper.ApplyFields(member, fields, schema);

        _db.Members.Add(member);
        await _db.SaveChangesAsync();

        await ApplyUploadedFilesAsync(member, schema, files);
        member.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MemberMapper.ToApiObject(member, schema);
    }

    public async Task<Dictionary<string, object?>?> UpdateAsync(
        int id, Dictionary<string, string> fields, IFormCollection form, IFormFileCollection files)
    {
        var member = await _db.Members.FindAsync(id);
        if (member is null) return null;

        var schema = _schema.GetSchema();
        MemberMapper.ApplyFields(member, fields, schema);

        foreach (var field in FieldFileHelper.GetFileFields(schema))
        {
            if (FieldFileHelper.IsClearRequested(form, field))
                FieldFileHelper.ClearStoredFile(member, field, _files);
            else
            {
                var upload = FieldFileHelper.GetUploadedFile(files, field.Name);
                if (upload is not null && upload.Length > 0)
                {
                    _files.DeleteIfExists(FieldFileHelper.GetStoredPath(member, field));
                    var saved = await _files.SaveFieldFileAsync(upload, field, member.Id);
                    if (saved is not null)
                        FieldFileHelper.SetStoredFile(member, field, saved.Path, saved.OriginalName);
                }
            }
        }

        member.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MemberMapper.ToApiObject(member, schema);
    }

    public async Task<Dictionary<string, object?>?> DeleteAsync(int id)
    {
        var member = await _db.Members.FindAsync(id);
        if (member is null) return null;

        var schema = _schema.GetSchema();
        var snapshot = MemberMapper.ToApiObject(member, schema);

        FieldFileHelper.DeleteAllStoredFiles(member, schema, _files);
        _db.Members.Remove(member);
        await _db.SaveChangesAsync();
        return snapshot;
    }

    private async Task ApplyUploadedFilesAsync(Member member, FieldSchema schema, IFormFileCollection files)
    {
        foreach (var field in FieldFileHelper.GetFileFields(schema))
        {
            var upload = FieldFileHelper.GetUploadedFile(files, field.Name);
            if (upload is null || upload.Length == 0) continue;

            var saved = await _files.SaveFieldFileAsync(upload, field, member.Id);
            if (saved is not null)
                FieldFileHelper.SetStoredFile(member, field, saved.Path, saved.OriginalName);
        }
    }
}
