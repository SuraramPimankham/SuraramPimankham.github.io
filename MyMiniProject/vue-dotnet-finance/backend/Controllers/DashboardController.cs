using System.Security.Claims;
using FinanceApi.Data;
using FinanceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(AppDbContext db) : ControllerBase
{
    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("admin");

    [HttpGet]
    public async Task<ActionResult<DashboardSummary>> Get([FromQuery] int? userId)
    {
        var q = db.Transactions.Include(t => t.User).AsQueryable();

        if (!IsAdmin)
            q = q.Where(t => t.UserId == CurrentUserId);
        else if (userId is not null)
            q = q.Where(t => t.UserId == userId);

        var all = await q.ToListAsync();

        var income = all.Where(t => t.Type == "income").ToList();
        var expense = all.Where(t => t.Type == "expense").ToList();

        var totalIncome = income.Sum(t => t.Amount);
        var totalExpense = expense.Sum(t => t.Amount);

        var byCategory = all
            .GroupBy(t => new { t.Category, t.Type })
            .Select(g => new CategorySum(g.Key.Category, g.Key.Type, g.Sum(x => x.Amount)))
            .OrderByDescending(x => x.Total)
            .ToList();

        var byMonth = all
            .GroupBy(t => t.OccurredAt.ToString("yyyy-MM"))
            .OrderBy(g => g.Key)
            .Select(g => new MonthlySum(
                g.Key,
                g.Where(x => x.Type == "income").Sum(x => x.Amount),
                g.Where(x => x.Type == "expense").Sum(x => x.Amount)))
            .ToList();

        var recent = all
            .OrderByDescending(t => t.OccurredAt)
            .ThenByDescending(t => t.Id)
            .Take(8)
            .Select(t => new TransactionDto(
                t.Id, t.UserId, t.User?.FullName, t.Type, t.Category, t.Title,
                t.Note, t.Amount, t.OccurredAt, t.SlipPath, t.CreatedAt))
            .ToList();

        return Ok(new DashboardSummary(
            totalIncome,
            totalExpense,
            totalIncome - totalExpense,
            income.Count,
            expense.Count,
            byCategory,
            byMonth,
            recent));
    }
}
