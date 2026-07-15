using System.Security.Claims;
using FinanceApi.Data;
using FinanceApi.Models;
using FinanceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController(AppDbContext db, SlipStorage slips) : ControllerBase
{
    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("admin");

    [HttpGet]
    public async Task<ActionResult<List<TransactionDto>>> GetAll(
        [FromQuery] string? type,
        [FromQuery] string? category,
        [FromQuery] int? userId)
    {
        var q = db.Transactions.Include(t => t.User).AsQueryable();

        if (!IsAdmin)
            q = q.Where(t => t.UserId == CurrentUserId);
        else if (userId is not null)
            q = q.Where(t => t.UserId == userId);

        if (!string.IsNullOrWhiteSpace(type))
            q = q.Where(t => t.Type == type);

        if (!string.IsNullOrWhiteSpace(category))
            q = q.Where(t => t.Category.Contains(category));

        var list = await q.OrderByDescending(t => t.OccurredAt).ThenByDescending(t => t.Id).ToListAsync();
        return Ok(list.Select(ToDto).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TransactionDto>> Get(int id)
    {
        var t = await db.Transactions.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == id);
        if (t is null) return NotFound();
        if (!IsAdmin && t.UserId != CurrentUserId) return Forbid();
        return Ok(ToDto(t));
    }

    [HttpPost]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<ActionResult<TransactionDto>> Create([FromForm] TransactionForm form)
    {
        var validation = Validate(form);
        if (validation is not null) return validation;

        var ownerId = IsAdmin && form.UserId is > 0 ? form.UserId.Value : CurrentUserId;
        var owner = await db.Users.FindAsync(ownerId);
        if (owner is null)
            return BadRequest(new { message = "ไม่พบผู้ใช้" });

        var t = new Transaction
        {
            UserId = ownerId,
            Type = form.Type!.Trim().ToLowerInvariant(),
            Category = form.Category!.Trim(),
            Title = form.Title!.Trim(),
            Note = form.Note?.Trim(),
            Amount = form.Amount,
            OccurredAt = form.OccurredAt ?? DateTime.UtcNow
        };

        db.Transactions.Add(t);
        await db.SaveChangesAsync();

        try
        {
            if (form.Slip is not null)
            {
                t.SlipPath = await slips.SaveAsync(form.Slip, t.Id, owner.Username);
                await db.SaveChangesAsync();
            }
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }

        await db.Entry(t).Reference(x => x.User).LoadAsync();
        return CreatedAtAction(nameof(Get), new { id = t.Id }, ToDto(t));
    }

    [HttpPut("{id:int}")]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<ActionResult<TransactionDto>> Update(int id, [FromForm] TransactionForm form)
    {
        var t = await db.Transactions.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == id);
        if (t is null) return NotFound();
        if (!IsAdmin && t.UserId != CurrentUserId) return Forbid();

        var validation = Validate(form);
        if (validation is not null) return validation;

        t.Type = form.Type!.Trim().ToLowerInvariant();
        t.Category = form.Category!.Trim();
        t.Title = form.Title!.Trim();
        t.Note = form.Note?.Trim();
        t.Amount = form.Amount;
        if (form.OccurredAt.HasValue) t.OccurredAt = form.OccurredAt.Value;

        if (IsAdmin && form.UserId is > 0)
            t.UserId = form.UserId.Value;

        var owner = await db.Users.FindAsync(t.UserId);
        if (owner is null)
            return BadRequest(new { message = "ไม่พบผู้ใช้" });

        try
        {
            if (form.ClearSlip)
            {
                slips.DeleteIfExists(t.SlipPath);
                t.SlipPath = null;
            }

            if (form.Slip is not null)
            {
                slips.DeleteIfExists(t.SlipPath);
                t.SlipPath = await slips.SaveAsync(form.Slip, t.Id, owner.Username);
            }
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }

        await db.SaveChangesAsync();
        await db.Entry(t).Reference(x => x.User).LoadAsync();
        return Ok(ToDto(t));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var t = await db.Transactions.FindAsync(id);
        if (t is null) return NotFound();
        if (!IsAdmin && t.UserId != CurrentUserId) return Forbid();

        slips.DeleteIfExists(t.SlipPath);
        db.Transactions.Remove(t);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private ActionResult? Validate(TransactionForm form)
    {
        if (string.IsNullOrWhiteSpace(form.Title))
            return BadRequest(new { message = "กรุณาระบุหัวข้อ" });
        if (string.IsNullOrWhiteSpace(form.Category))
            return BadRequest(new { message = "กรุณาระบุหมวดหมู่" });
        if (form.Type is not ("income" or "expense"))
            return BadRequest(new { message = "Type ต้องเป็น income หรือ expense" });
        if (form.Amount <= 0)
            return BadRequest(new { message = "จำนวนเงินต้องมากกว่า 0" });
        return null;
    }

    private static TransactionDto ToDto(Transaction t) => new(
        t.Id,
        t.UserId,
        t.User?.FullName,
        t.Type,
        t.Category,
        t.Title,
        t.Note,
        t.Amount,
        t.OccurredAt,
        t.SlipPath,
        t.CreatedAt);
}

public class TransactionForm
{
    public int? UserId { get; set; }
    public string? Type { get; set; }
    public string? Category { get; set; }
    public string? Title { get; set; }
    public string? Note { get; set; }
    public decimal Amount { get; set; }
    public DateTime? OccurredAt { get; set; }
    public IFormFile? Slip { get; set; }
    public bool ClearSlip { get; set; }
}
