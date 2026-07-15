using FinanceApi.Models;

namespace FinanceApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Users.Any()) return;

        var admin = new User
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            FullName = "ผู้ดูแลระบบ",
            Email = "admin@finance.local",
            Role = "admin",
            IsActive = true
        };

        var user = new User
        {
            Username = "user",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
            FullName = "สมชาย ใจดี",
            Email = "user@finance.local",
            Role = "user",
            IsActive = true
        };

        db.Users.AddRange(admin, user);
        db.SaveChanges();

        var now = DateTime.UtcNow;
        db.Transactions.AddRange(
            new Transaction
            {
                UserId = user.Id,
                Type = "income",
                Category = "เงินเดือน",
                Title = "เงินเดือนประจำเดือน",
                Amount = 35000,
                OccurredAt = now.AddDays(-20),
                Note = "โอนเข้าบัญชี"
            },
            new Transaction
            {
                UserId = user.Id,
                Type = "income",
                Category = "ฟรีแลนซ์",
                Title = "งานออกแบบเว็บ",
                Amount = 8000,
                OccurredAt = now.AddDays(-10)
            },
            new Transaction
            {
                UserId = user.Id,
                Type = "expense",
                Category = "อาหาร",
                Title = "ค่าอาหารกลางวัน",
                Amount = 250,
                OccurredAt = now.AddDays(-3),
                Note = "ร้านใกล้ที่ทำงาน"
            },
            new Transaction
            {
                UserId = user.Id,
                Type = "expense",
                Category = "เดินทาง",
                Title = "เติมน้ำมัน",
                Amount = 1200,
                OccurredAt = now.AddDays(-5)
            },
            new Transaction
            {
                UserId = user.Id,
                Type = "expense",
                Category = "ช้อปปิ้ง",
                Title = "ซื้อของใช้ในบ้าน",
                Amount = 890,
                OccurredAt = now.AddDays(-1)
            },
            new Transaction
            {
                UserId = admin.Id,
                Type = "expense",
                Category = "สำนักงาน",
                Title = "ค่าโดเมน",
                Amount = 450,
                OccurredAt = now.AddDays(-7)
            }
        );
        db.SaveChanges();
    }
}
