using System.Text.Json;
using CrudDotNet.Models;

namespace CrudDotNet.Services;

public class JsonItemRepository : IItemRepository
{
    private readonly string _dataFile;
    private readonly IImageStorage _images;
    private readonly JsonSerializerOptions _jsonOptions;

    public JsonItemRepository(IWebHostEnvironment env, IImageStorage images)
    {
        _dataFile = Path.Combine(env.ContentRootPath, "data", "items.json");
        _images = images;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

    public IReadOnlyList<Item> GetAll() => ReadItems();

    public Item? GetById(int id) => ReadItems().FirstOrDefault(i => i.Id == id);

    public Item Create(ItemInput input)
    {
        var items = ReadItems();
        var item = new Item
        {
            Id = items.Count == 0 ? 1 : items.Max(i => i.Id) + 1,
            Name = input.Name!.Trim(),
            Description = input.Description?.Trim() ?? ""
        };

        if (!string.IsNullOrWhiteSpace(input.ImageBase64))
            item.Image = _images.SaveBase64(input.ImageBase64, item.Id) ?? "";

        items.Add(item);
        WriteItems(items);
        return item;
    }

    public Item? Update(int id, ItemInput input)
    {
        var items = ReadItems();
        var index = items.FindIndex(i => i.Id == id);
        if (index < 0) return null;

        if (input.Name is not null)
            items[index].Name = input.Name.Trim();

        if (input.Description is not null)
            items[index].Description = input.Description.Trim();

        if (input.ClearImage)
        {
            _images.DeleteIfExists(items[index].Image);
            items[index].Image = "";
        }
        else if (!string.IsNullOrWhiteSpace(input.ImageBase64))
        {
            _images.DeleteIfExists(items[index].Image);
            items[index].Image = _images.SaveBase64(input.ImageBase64, id) ?? items[index].Image;
        }

        WriteItems(items);
        return items[index];
    }

    public Item? Delete(int id)
    {
        var items = ReadItems();
        var index = items.FindIndex(i => i.Id == id);
        if (index < 0) return null;

        var removed = items[index];
        _images.DeleteIfExists(removed.Image);
        items.RemoveAt(index);
        WriteItems(items);
        return removed;
    }

    private List<Item> ReadItems()
    {
        var json = File.ReadAllText(_dataFile);
        return JsonSerializer.Deserialize<List<Item>>(json, _jsonOptions) ?? new List<Item>();
    }

    private void WriteItems(List<Item> items)
    {
        var json = JsonSerializer.Serialize(items, _jsonOptions);
        File.WriteAllText(_dataFile, json);
    }
}
