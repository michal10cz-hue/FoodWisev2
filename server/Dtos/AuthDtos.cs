namespace FoodWise.Server.Dtos;

public record RegisterRequest(string Email, string Password, string Name);

public record LoginRequest(string Email, string Password);

public record AuthResponse(int Id, string Email, string Name, string Theme);
