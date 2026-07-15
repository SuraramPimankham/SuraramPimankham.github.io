namespace DotnetMVC.Services;

public interface IMemberService
{
    Task<IReadOnlyList<Dictionary<string, object?>>> GetAllAsync(IReadOnlyDictionary<string, string>? filter = null);
    Task<Dictionary<string, object?>?> GetByIdAsync(int id);
    Task<Dictionary<string, object?>> CreateAsync(Dictionary<string, string> fields, IFormFileCollection files);
    Task<Dictionary<string, object?>?> UpdateAsync(int id, Dictionary<string, string> fields, IFormCollection form, IFormFileCollection files);
    Task<Dictionary<string, object?>?> DeleteAsync(int id);
}
