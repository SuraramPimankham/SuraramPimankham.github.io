using DotnetMVC.Models;

namespace DotnetMVC.Services;

public class LocalFileStorage : IFileStorage
{
    private static readonly HashSet<string> ImageExtensions = new(StringComparer.OrdinalIgnoreCase)
        { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

    private static readonly HashSet<string> FileExtensions = new(StringComparer.OrdinalIgnoreCase)
        { ".pdf", ".txt", ".md", ".zip", ".json", ".cs", ".js", ".html", ".css", ".jpg", ".jpeg", ".png", ".gif", ".webp" };

    private const long DefaultImageBytes = 2 * 1024 * 1024;
    private const long DefaultFileBytes = 10 * 1024 * 1024;

    private readonly string _imageDir;
    private readonly string _fileDir;

    public LocalFileStorage(IWebHostEnvironment env)
    {
        var root = Path.GetFullPath(Path.Combine(env.ContentRootPath, "..", "uploads"));
        _imageDir = Path.Combine(root, "images");
        _fileDir = Path.Combine(root, "files");
        Directory.CreateDirectory(_imageDir);
        Directory.CreateDirectory(_fileDir);
    }

    private static string RandomSuffix() => Guid.NewGuid().ToString("N")[..8];

    public async Task<SavedFieldFile?> SaveFieldFileAsync(IFormFile file, FieldDefinition field, int memberId)
    {
        if (file.Length == 0) return null;

        var isImage = field.Type == "image";
        var maxBytes = (field.MaxSizeMb ?? (isImage ? 2 : 10)) * 1024L * 1024L;
        if (file.Length > maxBytes)
            throw new InvalidOperationException($"{field.Label} ({field.Name}) must be <= {field.MaxSizeMb ?? (isImage ? 2 : 10)} MB");

        var ext = Path.GetExtension(file.FileName);
        var allowed = isImage ? ImageExtensions : FileExtensions;
        if (!allowed.Contains(ext))
            throw new InvalidOperationException($"{field.Label} ({field.Name}) type not allowed");

        var stored = $"member-{memberId}-{field.Name}-{RandomSuffix()}{ext}";
        var dir = isImage ? _imageDir : _fileDir;
        var urlPrefix = isImage ? "/uploads/images/" : "/uploads/files/";
        var full = Path.Combine(dir, stored);

        await using var stream = File.Create(full);
        await file.CopyToAsync(stream);

        var originalName = isImage ? null : Path.GetFileName(file.FileName);
        return new SavedFieldFile($"{urlPrefix}{stored}", originalName);
    }

    public void DeleteIfExists(string? relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath)) return;

        var root = Path.GetFullPath(Path.Combine(_imageDir, ".."));
        var full = Path.GetFullPath(Path.Combine(root, relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar)));
        if (!full.StartsWith(root, StringComparison.OrdinalIgnoreCase)) return;
        if (File.Exists(full)) File.Delete(full);
    }
}
