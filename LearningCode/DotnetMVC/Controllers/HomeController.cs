using DotnetMVC.Services;
using Microsoft.AspNetCore.Mvc;

namespace DotnetMVC.Controllers;

[ApiController]
public class HomeController : ControllerBase
{
    private readonly ISchemaService _schema;

    public HomeController(ISchemaService schema)
    {
        _schema = schema;
    }

    /// <summary>GET /manifest — JSON manifest (API info + schema)</summary>
    [HttpGet("/manifest")]
    public IActionResult Manifest() => Ok(_schema.GetManifest());

    /// <summary>GET /schema — โครงสร้างฟิลด์จาก fields.json</summary>
    [HttpGet("/schema")]
    public IActionResult Schema() => Ok(_schema.GetSchema());
}
