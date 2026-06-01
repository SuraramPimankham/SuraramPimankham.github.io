using System.Text.RegularExpressions;

namespace CrudDotNet.Services;

public class ImageStorage : IImageStorage
{
    private static readonly Regex DataUrlPattern = new(
        @"^data:(image/(?<type>\w+));base64,(?<data>.+)$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    private readonly string _uploadDir;

    public ImageStorage(IWebHostEnvironment env)
    {
        _uploadDir = Path.GetFullPath(Path.Combine(env.ContentRootPath, "..", "..", "uploads"));
        Directory.CreateDirectory(_uploadDir);
    }

    public string? SaveBase64(string dataUrl, int itemId)
    {
        var match = DataUrlPattern.Match(dataUrl.Trim());
        if (!match.Success) return null;

        var ext = match.Groups["type"].Value.ToLowerInvariant() switch
        {
            "jpeg" => "jpg",
            "jpg" => "jpg",
            "png" => "png",
            "gif" => "gif",
            "webp" => "webp",
            _ => null
        };
        if (ext is null) return null;

        var bytes = Convert.FromBase64String(match.Groups["data"].Value);
        if (bytes.Length > 2 * 1024 * 1024) return null;

        var fileName = $"item-{itemId}-{Guid.NewGuid():N[..8]}.{ext}";
        var fullPath = Path.Combine(_uploadDir, fileName);
        File.WriteAllBytes(fullPath, bytes);
        return $"/uploads/{fileName}";
    }

    public void DeleteIfExists(string? imagePath)
    {
        if (string.IsNullOrWhiteSpace(imagePath) || !imagePath.StartsWith("/uploads/"))
            return;

        var fileName = Path.GetFileName(imagePath);
        var fullPath = Path.Combine(_uploadDir, fileName);
        if (File.Exists(fullPath))
            File.Delete(fullPath);
    }
}
