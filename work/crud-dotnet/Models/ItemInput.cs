namespace CrudDotNet.Models;

public class ItemInput
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? ImageBase64 { get; set; }
    public bool ClearImage { get; set; }
}
