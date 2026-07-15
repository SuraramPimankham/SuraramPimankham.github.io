using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using System.Text.RegularExpressions;

namespace FinanceApi.Services;

public class SlipStorage(IWebHostEnvironment env)
{
    private const int MaxUploadBytes = 5 * 1024 * 1024;
    private const int MaxEdgePx = 1280;
    private const int JpegQuality = 80;

    private static readonly HashSet<string> Allowed = new(StringComparer.OrdinalIgnoreCase)
        { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

    private readonly string _slipsRoot = InitDir(env);
    private readonly string _projectRoot = Path.GetFullPath(Path.Combine(env.ContentRootPath, ".."));

    private static string InitDir(IWebHostEnvironment env)
    {
        var dir = Path.GetFullPath(Path.Combine(env.ContentRootPath, "..", "uploads", "slips"));
        Directory.CreateDirectory(dir);
        return dir;
    }

    /// <summary>Sanitize username so it is safe as a folder name.</summary>
    public static string SafeFolder(string? username)
    {
        var raw = string.IsNullOrWhiteSpace(username) ? "unknown" : username.Trim();
        var safe = Regex.Replace(raw, @"[^a-zA-Z0-9._-]", "_");
        return string.IsNullOrEmpty(safe) ? "unknown" : safe;
    }

    public async Task<string?> SaveAsync(IFormFile? file, int transactionId, string username)
    {
        if (file is null || file.Length == 0) return null;
        if (file.Length > MaxUploadBytes)
            throw new InvalidOperationException("ไฟล์สลิปต้องไม่เกิน 5 MB");

        var ext = Path.GetExtension(file.FileName);
        if (!Allowed.Contains(ext))
            throw new InvalidOperationException("รองรับเฉพาะรูป .jpg .png .gif .webp");

        var folder = SafeFolder(username);
        var userDir = Path.Combine(_slipsRoot, folder);
        Directory.CreateDirectory(userDir);

        var name = $"slip-{transactionId}-{Guid.NewGuid().ToString("N")[..8]}.jpg";
        var full = Path.Combine(userDir, name);

        try
        {
            await using var input = file.OpenReadStream();
            using var image = await Image.LoadAsync(input);

            if (image.Width > MaxEdgePx || image.Height > MaxEdgePx)
            {
                image.Mutate(ctx => ctx.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new Size(MaxEdgePx, MaxEdgePx)
                }));
            }

            await image.SaveAsJpegAsync(full, new JpegEncoder { Quality = JpegQuality });
        }
        catch (UnknownImageFormatException)
        {
            throw new InvalidOperationException("ไฟล์ไม่ใช่รูปภาพที่รองรับ");
        }
        catch (InvalidImageContentException)
        {
            throw new InvalidOperationException("ไฟล์รูปภาพเสียหรืออ่านไม่ได้");
        }

        return $"/uploads/slips/{folder}/{name}";
    }

    public void DeleteIfExists(string? relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath)) return;

        var relative = relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        var full = Path.GetFullPath(Path.Combine(_projectRoot, relative));

        if (!full.StartsWith(_projectRoot, StringComparison.OrdinalIgnoreCase)) return;
        if (File.Exists(full)) File.Delete(full);
    }
}
