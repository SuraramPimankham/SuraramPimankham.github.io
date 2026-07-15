namespace DotnetMVC.Models;

public class FieldSchema
{
    public string Entity { get; set; } = "Member";
    public List<FieldDefinition> Fields { get; set; } = [];
    public List<string> SystemFields { get; set; } = [];
}

public class FieldDefinition
{
    public string Name { get; set; } = "";
    public string Label { get; set; } = "";
    public string Type { get; set; } = "text";
    public string Storage { get; set; } = "column";
    public bool Required { get; set; }
    public string? Default { get; set; }
    public string? Placeholder { get; set; }
    public int? MaxLength { get; set; }
    public int? MaxSizeMb { get; set; }
    public string? Accept { get; set; }
    public List<string>? Options { get; set; }
    /// <summary>null = auto (column/extra ที่ไม่ใช่ file) · true/false บังคับเอง</summary>
    public bool? Filterable { get; set; }
}
