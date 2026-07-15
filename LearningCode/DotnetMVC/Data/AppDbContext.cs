using DotnetMVC.Models;
using Microsoft.EntityFrameworkCore;

namespace DotnetMVC.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Member> Members => Set<Member>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Member>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Email).HasMaxLength(200);
            e.Property(x => x.Phone).HasMaxLength(20);
            e.Property(x => x.Role).HasMaxLength(50);
            e.Property(x => x.Bio).HasMaxLength(2000);
            e.Property(x => x.ImagePath).HasMaxLength(500);
            e.Property(x => x.FilePath).HasMaxLength(500);
            e.Property(x => x.FileName).HasMaxLength(255);
            e.Property(x => x.ExtraJson).HasMaxLength(4000);
        });
    }
}
