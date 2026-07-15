using System.Reflection;
using System.Text.Json;
using DotnetMVC.Models;

namespace DotnetMVC.Services;

public static class MemberMapper
{
    public static HashSet<string> GetReservedFormKeys(FieldSchema schema) =>
        FieldFileHelper.GetClearFormKeys(schema).ToHashSet(StringComparer.OrdinalIgnoreCase);

    public static Dictionary<string, string> ReadFormFields(IFormCollection form, FieldSchema schema)
    {
        var reserved = GetReservedFormKeys(schema);
        var allowed = schema.Fields
            .Where(f => f.Storage is "column" or "extra")
            .Select(f => f.Name)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var key in form.Keys)
        {
            if (reserved.Contains(key)) continue;
            if (!allowed.Contains(key)) continue;
            result[key] = form[key].ToString();
        }
        return result;
    }

    public static void ApplyFields(Member member, Dictionary<string, string> values, FieldSchema schema)
    {
        var extra = ReadExtra(member);

        foreach (var field in schema.Fields.Where(f => f.Storage is "column" or "extra"))
        {
            values.TryGetValue(field.Name, out var raw);
            raw ??= field.Default ?? "";

            if (field.Storage == "column")
                SetColumn(member, field.Name, raw);
            else
                extra[field.Name] = raw;
        }

        member.ExtraJson = extra.Count == 0 ? null : JsonSerializer.Serialize(extra);
    }

    public static string? ValidateRequired(Dictionary<string, string> values, FieldSchema schema)
    {
        foreach (var field in schema.Fields.Where(f => f.Required))
        {
            if (!values.TryGetValue(field.Name, out var v) || string.IsNullOrWhiteSpace(v))
                return $"{field.Label} ({field.Name}) is required";
        }
        return null;
    }

    public static Dictionary<string, object?> ToApiObject(Member member, FieldSchema schema)
    {
        var obj = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = member.Id,
            ["imagePath"] = member.ImagePath,
            ["filePath"] = member.FilePath,
            ["fileName"] = member.FileName,
            ["createdAt"] = member.CreatedAt,
            ["updatedAt"] = member.UpdatedAt
        };

        foreach (var field in schema.Fields.Where(f => f.Storage == "column"))
        {
            var prop = typeof(Member).GetProperty(field.Name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (prop is not null) obj[field.Name] = prop.GetValue(member);
        }

        var fileMetaKeys = FieldFileHelper.GetFileFields(schema)
            .Where(f => !FieldFileHelper.UsesMemberColumn(f))
            .SelectMany(f => new[] { $"{f.Name}Path", $"{f.Name}Name" })
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var (k, v) in ReadExtra(member))
        {
            if (!fileMetaKeys.Contains(k)) obj[k] = v;
        }

        foreach (var field in schema.Fields.Where(f => f.Storage == "extra"))
            obj.TryAdd(field.Name, field.Default);

        foreach (var field in schema.Fields.Where(f => f.Storage == "file"))
            obj[field.Name] = FieldFileHelper.GetStoredPath(member, field);

        return obj;
    }

    private static Dictionary<string, string> ReadExtra(Member member)
    {
        if (string.IsNullOrWhiteSpace(member.ExtraJson)) return new(StringComparer.OrdinalIgnoreCase);
        return JsonSerializer.Deserialize<Dictionary<string, string>>(member.ExtraJson)
               ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    }

    private static void SetColumn(Member member, string name, string value)
    {
        var prop = typeof(Member).GetProperty(name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
        if (prop is null || !prop.CanWrite) return;
        prop.SetValue(member, value);
    }
}
