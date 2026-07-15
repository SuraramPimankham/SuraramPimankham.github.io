using DotnetMVC.Models;

namespace DotnetMVC.Services;

public record SavedFieldFile(string Path, string? OriginalName);

public interface IFileStorage
{
    Task<SavedFieldFile?> SaveFieldFileAsync(IFormFile file, FieldDefinition field, int memberId);
    void DeleteIfExists(string? relativePath);
}
