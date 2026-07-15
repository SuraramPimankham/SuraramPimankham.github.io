using System.Reflection;
using DotnetMVC.Models;
using Microsoft.EntityFrameworkCore;

namespace DotnetMVC.Services;

public static class FieldFilterHelper
{
    public static bool IsFilterable(FieldDefinition field)
    {
        if (field.Filterable == false) return false;
        if (field.Filterable == true) return true;
        return field.Storage is "column" or "extra";
    }

    public static IQueryable<Member> ApplyColumnFilters(
        IQueryable<Member> query, FieldSchema schema, IReadOnlyDictionary<string, string> filters)
    {
        foreach (var field in schema.Fields.Where(f => f.Storage == "column" && IsFilterable(f)))
        {
            if (!filters.TryGetValue(field.Name, out var value) || string.IsNullOrWhiteSpace(value)) continue;

            var prop = typeof(Member).GetProperty(field.Name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (prop is null) continue;

            var propName = prop.Name;
            if (field.Type == "select")
                query = query.Where(m => EF.Property<string>(m, propName) == value);
            else
                query = query.Where(m => EF.Property<string>(m, propName) != null && EF.Property<string>(m, propName).Contains(value));
        }
        return query;
    }

    public static List<Dictionary<string, object?>> ApplyExtraFilters(
        List<Dictionary<string, object?>> rows, FieldSchema schema, IReadOnlyDictionary<string, string> filters)
    {
        foreach (var field in schema.Fields.Where(f => f.Storage == "extra" && IsFilterable(f)))
        {
            if (!filters.TryGetValue(field.Name, out var value) || string.IsNullOrWhiteSpace(value)) continue;

            rows = field.Type == "select"
                ? rows.Where(d => string.Equals(d.GetValueOrDefault(field.Name)?.ToString(), value, StringComparison.OrdinalIgnoreCase)).ToList()
                : rows.Where(d => (d.GetValueOrDefault(field.Name)?.ToString() ?? "").Contains(value, StringComparison.OrdinalIgnoreCase)).ToList();
        }
        return rows;
    }
}
