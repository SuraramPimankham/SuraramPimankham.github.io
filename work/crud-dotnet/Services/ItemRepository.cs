using CrudDotNet.Models;
using Npgsql;

namespace CrudDotNet.Services;

public class ItemRepository : IItemRepository
{
    private readonly NpgsqlDataSource _db;
    private readonly IImageStorage _images;

    public ItemRepository(NpgsqlDataSource db, IImageStorage images)
    {
        _db = db;
        _images = images;
    }

    public IReadOnlyList<Item> GetAll()
    {
        using var conn = _db.OpenConnection();
        using var cmd = new NpgsqlCommand(
            "SELECT id, name, description, image FROM items ORDER BY id",
            conn);
        using var reader = cmd.ExecuteReader();
        var list = new List<Item>();
        while (reader.Read())
            list.Add(ReadItem(reader));
        return list;
    }

    public Item? GetById(int id)
    {
        using var conn = _db.OpenConnection();
        using var cmd = new NpgsqlCommand(
            "SELECT id, name, description, image FROM items WHERE id = @id",
            conn);
        cmd.Parameters.AddWithValue("id", id);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? ReadItem(reader) : null;
    }

    public Item Create(ItemInput input)
    {
        using var conn = _db.OpenConnection();
        using var cmd = new NpgsqlCommand(
            """
            INSERT INTO items (name, description, image)
            VALUES (@name, @description, '')
            RETURNING id, name, description, image
            """,
            conn);
        cmd.Parameters.AddWithValue("name", input.Name!.Trim());
        cmd.Parameters.AddWithValue("description", input.Description?.Trim() ?? "");
        using var reader = cmd.ExecuteReader();
        reader.Read();
        var item = ReadItem(reader);

        if (!string.IsNullOrWhiteSpace(input.ImageBase64))
        {
            var imagePath = _images.SaveBase64(input.ImageBase64, item.Id);
            if (imagePath is not null)
                item = UpdateImage(conn, item.Id, imagePath) ?? item;
        }

        return item;
    }

    public Item? Update(int id, ItemInput input)
    {
        var existing = GetById(id);
        if (existing is null) return null;

        using var conn = _db.OpenConnection();

        var name = input.Name is not null ? input.Name.Trim() : existing.Name;
        var description = input.Description is not null ? input.Description.Trim() : existing.Description;
        var image = existing.Image;

        if (input.ClearImage)
        {
            _images.DeleteIfExists(image);
            image = "";
        }
        else if (!string.IsNullOrWhiteSpace(input.ImageBase64))
        {
            _images.DeleteIfExists(image);
            image = _images.SaveBase64(input.ImageBase64, id) ?? image;
        }

        using var cmd = new NpgsqlCommand(
            """
            UPDATE items
            SET name = @name, description = @description, image = @image
            WHERE id = @id
            RETURNING id, name, description, image
            """,
            conn);
        cmd.Parameters.AddWithValue("id", id);
        cmd.Parameters.AddWithValue("name", name);
        cmd.Parameters.AddWithValue("description", description);
        cmd.Parameters.AddWithValue("image", image);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? ReadItem(reader) : null;
    }

    public Item? Delete(int id)
    {
        var existing = GetById(id);
        if (existing is null) return null;

        _images.DeleteIfExists(existing.Image);

        using var conn = _db.OpenConnection();
        using var cmd = new NpgsqlCommand(
            "DELETE FROM items WHERE id = @id RETURNING id, name, description, image",
            conn);
        cmd.Parameters.AddWithValue("id", id);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? ReadItem(reader) : null;
    }

    private static Item ReadItem(NpgsqlDataReader reader) => new()
    {
        Id = reader.GetInt32(0),
        Name = reader.GetString(1),
        Description = reader.GetString(2),
        Image = reader.GetString(3)
    };

    private static Item? UpdateImage(NpgsqlConnection conn, int id, string imagePath)
    {
        using var cmd = new NpgsqlCommand(
            "UPDATE items SET image = @image WHERE id = @id RETURNING id, name, description, image",
            conn);
        cmd.Parameters.AddWithValue("id", id);
        cmd.Parameters.AddWithValue("image", imagePath);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? ReadItem(reader) : null;
    }
}
