using CrudDotNet.Services;
using Microsoft.Extensions.FileProviders;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllersWithViews();
builder.Services.AddSingleton<IImageStorage, ImageStorage>();

var connectionString =
    builder.Configuration.GetConnectionString("Supabase")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL");

string storageMode = "json";

if (!string.IsNullOrWhiteSpace(connectionString))
{
    try
    {
        var dataSource = NpgsqlDataSource.Create(connectionString);
        DatabaseBootstrap.EnsureSchema(dataSource);
        using (var conn = dataSource.OpenConnection())
        using (var cmd = new NpgsqlCommand("SELECT 1", conn))
            cmd.ExecuteScalar();

        builder.Services.AddSingleton(dataSource);
        builder.Services.AddSingleton<IItemRepository, ItemRepository>();
        storageMode = "supabase";
    }
    catch (Exception ex)
    {
        Console.WriteLine("Supabase unavailable — using data/items.json");
        Console.WriteLine(ex.Message);
        builder.Services.AddSingleton<IItemRepository, JsonItemRepository>();
    }
}
else
{
    builder.Services.AddSingleton<IItemRepository, JsonItemRepository>();
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

Console.WriteLine($"CRUD (.NET) — storage: {storageMode}");
Console.WriteLine("UI: /  |  API: /items  |  Images: /uploads");

app.UseCors();

var sharedPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "crud-shared"));
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(sharedPath),
    RequestPath = "/crud-shared"
});

var uploadsPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "..", "uploads"));
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseRouting();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapControllers();

app.Run();
