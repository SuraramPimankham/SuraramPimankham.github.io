using System.Reflection;
using System.Text.Json;
using DotnetMVC.Models;

namespace DotnetMVC.Services;

public static class FieldFileHelper
{
    private static readonly Dictionary<string, (string PathProp, string? NameProp)> ColumnMap =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["photo"] = ("ImagePath", null),
            ["file"] = ("FilePath", "FileName")
        };

    public static IEnumerable<FieldDefinition> GetFileFields(FieldSchema schema) =>
        schema.Fields.Where(f => f.Storage == "file");

    public static bool UsesMemberColumn(FieldDefinition field) =>
        ColumnMap.ContainsKey(field.Name);

    public static string ClearFormKey(FieldDefinition field) =>
        "clear" + char.ToUpperInvariant(field.Name[0]) + field.Name[1..];

    public static IEnumerable<string> GetClearFormKeys(FieldSchema schema) =>
        GetFileFields(schema).Select(ClearFormKey);

    public static IFormFile? GetUploadedFile(IFormFileCollection files, string fieldName) =>
        files.FirstOrDefault(f => string.Equals(f.Name, fieldName, StringComparison.OrdinalIgnoreCase));

    public static bool IsClearRequested(IFormCollection form, FieldDefinition field) =>
        string.Equals(form[ClearFormKey(field)], "true", StringComparison.OrdinalIgnoreCase);

    public static string? GetStoredPath(Member member, FieldDefinition field)
    {
        if (ColumnMap.TryGetValue(field.Name, out var col))
            return GetColumnString(member, col.PathProp);

        return ReadExtra(member).GetValueOrDefault($"{field.Name}Path");
    }

    public static string? GetStoredFileName(Member member, FieldDefinition field)
    {
        if (ColumnMap.TryGetValue(field.Name, out var col) && col.NameProp is not null)
            return GetColumnString(member, col.NameProp);

        return ReadExtra(member).GetValueOrDefault($"{field.Name}Name");
    }

    public static void SetStoredFile(Member member, FieldDefinition field, string? path, string? originalName)
    {
        if (ColumnMap.TryGetValue(field.Name, out var col))
        {
            SetColumnString(member, col.PathProp, path);
            if (col.NameProp is not null) SetColumnString(member, col.NameProp, originalName);
            return;
        }

        var extra = ReadExtra(member);
        if (path is null)
        {
            extra.Remove($"{field.Name}Path");
            extra.Remove($"{field.Name}Name");
        }
        else
        {
            extra[$"{field.Name}Path"] = path;
            if (originalName is not null) extra[$"{field.Name}Name"] = originalName;
        }

        member.ExtraJson = extra.Count == 0 ? null : JsonSerializer.Serialize(extra);
    }

    public static void ClearStoredFile(Member member, FieldDefinition field, IFileStorage storage)
    {
        var path = GetStoredPath(member, field);
        storage.DeleteIfExists(path);
        SetStoredFile(member, field, null, null);
    }

    public static void DeleteAllStoredFiles(Member member, FieldSchema schema, IFileStorage storage)
    {
        foreach (var field in GetFileFields(schema))
            ClearStoredFile(member, field, storage);
    }

    private static Dictionary<string, string> ReadExtra(Member member)
    {
        if (string.IsNullOrWhiteSpace(member.ExtraJson))
            return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        return JsonSerializer.Deserialize<Dictionary<string, string>>(member.ExtraJson)
               ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    }

    private static string? GetColumnString(Member member, string propName)
    {
        var prop = typeof(Member).GetProperty(propName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
        return prop?.GetValue(member) as string;
    }

    private static void SetColumnString(Member member, string propName, string? value)
    {
        var prop = typeof(Member).GetProperty(propName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
        if (prop is null || !prop.CanWrite) return;
        prop.SetValue(member, value);
    }
}
