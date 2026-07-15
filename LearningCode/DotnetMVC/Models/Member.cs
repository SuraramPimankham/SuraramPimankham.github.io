namespace DotnetMVC.Models;

/// <summary>โมเดล Member สำหรับฝึก CRUD — สมาชิก/ผู้ใช้ พร้อมรูปและไฟล์แนบ</summary>
public class Member
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Role { get; set; } = "user";
    public string? Bio { get; set; }
    public string? ImagePath { get; set; }
    public string? FilePath { get; set; }
    public string? FileName { get; set; }
    public string? ExtraJson { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
