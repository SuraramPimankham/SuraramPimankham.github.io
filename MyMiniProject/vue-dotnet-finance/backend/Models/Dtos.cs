namespace FinanceApi.Models;

public record LoginRequest(string Username, string Password);

public record LoginResponse(string Token, UserDto User);

public record UserDto(int Id, string Username, string FullName, string Email, string Role, bool IsActive, DateTime CreatedAt);

public record CreateUserRequest(string Username, string Password, string FullName, string Email, string Role);

public record UpdateUserRequest(string FullName, string Email, string Role, bool IsActive, string? Password);

public record TransactionDto(
    int Id,
    int UserId,
    string? UserName,
    string Type,
    string Category,
    string Title,
    string? Note,
    decimal Amount,
    DateTime OccurredAt,
    string? SlipPath,
    DateTime CreatedAt);

public record DashboardSummary(
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance,
    int IncomeCount,
    int ExpenseCount,
    List<CategorySum> ByCategory,
    List<MonthlySum> ByMonth,
    List<TransactionDto> Recent);

public record CategorySum(string Category, string Type, decimal Total);

public record MonthlySum(string Month, decimal Income, decimal Expense);
