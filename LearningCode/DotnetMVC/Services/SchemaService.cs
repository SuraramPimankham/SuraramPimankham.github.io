using System.Text.Json;
using DotnetMVC.Models;

namespace DotnetMVC.Services;

public class SchemaService : ISchemaService
{
    private readonly string _schemaPath;
    private FieldSchema? _cached;
    private DateTime _cachedWrite = DateTime.MinValue;

    public SchemaService(IWebHostEnvironment env)
    {
        _schemaPath = Path.Combine(env.ContentRootPath, "fields.json");
    }

    public FieldSchema GetSchema()
    {
        var write = File.GetLastWriteTimeUtc(_schemaPath);
        if (_cached is null || write > _cachedWrite)
        {
            var json = File.ReadAllText(_schemaPath);
            _cached = JsonSerializer.Deserialize<FieldSchema>(json, JsonOptions()) ?? new FieldSchema();
            _cachedWrite = write;
        }
        return _cached;
    }

    public object GetManifest() => new
    {
        name = "DotnetMVC",
        description = "SQLite + REST API — แก้ fields.json เพื่อเพิ่ม/ลดคอลัมน์ทดสอบได้",
        schema = "/schema",
        manifest = "/manifest",
        hub = "/",
        tester = "/test.html",
        api = new
        {
            members = "/api/members",
            methods = new[] { "GET", "POST", "PUT", "DELETE" },
            body = "multipart/form-data",
            filters = GetSchema().Fields.Where(FieldFilterHelper.IsFilterable).Select(f => f.Name).ToArray(),
            files = GetSchema().Fields.Where(f => f.Storage == "file").Select(f => f.Name).ToArray()
        },
        models = new object[]
        {
            new
            {
                name = GetSchema().Entity,
                endpoint = "/api/members",
                schema = "/schema",
                operations = new object[]
                {
                    new { method = "GET", path = "/api/members", label = "GET — สมาชิกทั้งหมด (+ filter)", needsId = false, hasBody = false, hasFilters = true },
                    new { method = "GET", path = "/api/members/{id}", label = "GET — สมาชิกคนเดียว", needsId = true, hasBody = false },
                    new { method = "POST", path = "/api/members", label = "POST — สร้าง", needsId = false, hasBody = true },
                    new { method = "PUT", path = "/api/members/{id}", label = "PUT — แก้ไข", needsId = true, hasBody = true },
                    new { method = "DELETE", path = "/api/members/{id}", label = "DELETE — ลบ", needsId = true, hasBody = false }
                }
            },
            new
            {
                name = "System",
                endpoint = (string?)null,
                schema = (string?)null,
                operations = new object[]
                {
                    new { method = "GET", path = "/manifest", label = "GET — manifest", needsId = false, hasBody = false },
                    new { method = "GET", path = "/schema", label = "GET — schema", needsId = false, hasBody = false }
                }
            }
        },
        fields = GetSchema()
    };

    private static JsonSerializerOptions JsonOptions() => new()
    {
        PropertyNameCaseInsensitive = true,
        ReadCommentHandling = JsonCommentHandling.Skip,
        AllowTrailingCommas = true
    };
}
