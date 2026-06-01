using CrudDotNet.Models;
using CrudDotNet.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrudDotNet.Controllers;

[Route("items")]
public class ItemsController : ControllerBase
{
    private readonly IItemRepository _items;

    public ItemsController(IItemRepository items)
    {
        _items = items;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_items.GetAll());

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var item = _items.GetById(id);
        return item is null ? NotFound(new { error = "Item not found" }) : Ok(item);
    }

    [HttpPost]
    public IActionResult Create([FromBody] ItemInput? input)
    {
        if (input is null || string.IsNullOrWhiteSpace(input.Name))
            return BadRequest(new { error = "Field 'name' is required (string)" });

        var created = _items.Create(input);
        return StatusCode(StatusCodes.Status201Created, created);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] ItemInput? input)
    {
        if (input?.Name is not null && string.IsNullOrWhiteSpace(input.Name))
            return BadRequest(new { error = "Field 'name' must be a non-empty string" });

        var updated = _items.Update(id, input ?? new ItemInput());
        return updated is null ? NotFound(new { error = "Item not found" }) : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var removed = _items.Delete(id);
        return removed is null ? NotFound(new { error = "Item not found" }) : Ok(removed);
    }
}
