namespace CrudDotNet.Services;

public interface IImageStorage
{
    string? SaveBase64(string dataUrl, int itemId);
    void DeleteIfExists(string? imagePath);
}
