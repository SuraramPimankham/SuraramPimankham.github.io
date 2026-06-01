using Microsoft.AspNetCore.Mvc;

namespace CrudDotNet.Controllers;

public class HomeController : Controller
{
    public IActionResult Index() => View();
}
