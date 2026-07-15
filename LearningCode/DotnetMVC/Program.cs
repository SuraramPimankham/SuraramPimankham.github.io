using DotnetMVC.Data;
using DotnetMVC.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddSingleton<ISchemaService, SchemaService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddSingleton<IFileStorage, LocalFileStorage>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors();

var uploadsRoot = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "uploads"));
Directory.CreateDirectory(uploadsRoot);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsRoot),
    RequestPath = "/uploads"
});

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.MapControllers();

Console.WriteLine("DotnetMVC — SQLite + REST API");
Console.WriteLine("Hub:      http://localhost:5100/");
Console.WriteLine("Tester:   http://localhost:5100/test.html");
Console.WriteLine("Manifest: http://localhost:5100/manifest");
Console.WriteLine("API: http://localhost:5100/api/members");

app.Run();
