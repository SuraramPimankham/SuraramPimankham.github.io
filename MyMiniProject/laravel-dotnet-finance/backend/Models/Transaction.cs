namespace FinanceApi.Models;

public class Transaction
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public string Type { get; set; } = "expense"; // income | expense
    public string Category { get; set; } = "";
    public string Title { get; set; } = "";
    public string? Note { get; set; }
    public decimal Amount { get; set; }
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
    public string? SlipPath { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
