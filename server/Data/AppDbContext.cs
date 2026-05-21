using FoodWise.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodWise.Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Id).HasColumnName("id");
            entity.Property(u => u.Email).HasColumnName("email").HasMaxLength(254).IsRequired();
            entity.Property(u => u.PasswordHash).HasColumnName("password_hash").IsRequired();
            entity.Property(u => u.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
            entity.Property(u => u.Theme).HasColumnName("theme").HasMaxLength(20).HasDefaultValue("light");
            entity.Property(u => u.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");

            entity.HasIndex(u => u.Email).IsUnique();
        });
    }
}
