namespace FoodWise.Server.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Theme { get; set; } = "light";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
