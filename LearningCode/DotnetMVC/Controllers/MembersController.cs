using DotnetMVC.Models;
using DotnetMVC.Services;
using Microsoft.AspNetCore.Mvc;

namespace DotnetMVC.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController : ControllerBase
{
    private readonly IMemberService _members;
    private readonly ISchemaService _schema;

    public MembersController(IMemberService members, ISchemaService schema)
    {
        _members = members;
        _schema = schema;
    }

    /// <summary>GET /api/members?role=admin — filter จาก fields.json (filterable)</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var schema = _schema.GetSchema();
        var filter = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        foreach (var field in schema.Fields.Where(FieldFilterHelper.IsFilterable))
        {
            if (Request.Query.TryGetValue(field.Name, out var values))
            {
                var v = values.ToString();
                if (!string.IsNullOrWhiteSpace(v)) filter[field.Name] = v;
            }
        }

        return Ok(await _members.GetAllAsync(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var member = await _members.GetByIdAsync(id);
        return member is null ? NotFound(new { error = "Member not found" }) : Ok(member);
    }

    [HttpPost]
    [RequestSizeLimit(12 * 1024 * 1024)]
    public async Task<IActionResult> Create()
    {
        var schema = _schema.GetSchema();
        var fields = MemberMapper.ReadFormFields(Request.Form, schema);
        var error = MemberMapper.ValidateRequired(fields, schema);
        if (error is not null) return BadRequest(new { error });

        try
        {
            var created = await _members.CreateAsync(fields, Request.Form.Files);
            return CreatedAtAction(nameof(GetById), new { id = created["id"] }, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [RequestSizeLimit(12 * 1024 * 1024)]
    public async Task<IActionResult> Update(int id)
    {
        var schema = _schema.GetSchema();
        var fields = MemberMapper.ReadFormFields(Request.Form, schema);
        var error = MemberMapper.ValidateRequired(fields, schema);
        if (error is not null) return BadRequest(new { error });

        try
        {
            var updated = await _members.UpdateAsync(id, fields, Request.Form, Request.Form.Files);
            return updated is null ? NotFound(new { error = "Member not found" }) : Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var removed = await _members.DeleteAsync(id);
        return removed is null ? NotFound(new { error = "Member not found" }) : Ok(removed);
    }
}
