using FoodWise.Server.Data;
using FoodWise.Server.Dtos;
using FoodWise.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodWise.Server.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth").WithTags("Auth");

        group.MapPost("/register", async (RegisterRequest req, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(req.Email) ||
                string.IsNullOrWhiteSpace(req.Password) ||
                string.IsNullOrWhiteSpace(req.Name))
            {
                return Results.BadRequest(new { error = "Wszystkie pola sa wymagane." });
            }

            var normalizedEmail = req.Email.Trim().ToLowerInvariant();

            var exists = await db.Users.AnyAsync(u => u.Email == normalizedEmail);
            if (exists)
            {
                return Results.Conflict(new { error = "Konto z tym adresem e-mail juz istnieje." });
            }

            var user = new User
            {
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                Name = req.Name.Trim(),
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return Results.Ok(new AuthResponse(user.Id, user.Email, user.Name, user.Theme));
        });

        group.MapPost("/login", async (LoginRequest req, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            {
                return Results.BadRequest(new { error = "Podaj e-mail i haslo." });
            }

            var normalizedEmail = req.Email.Trim().ToLowerInvariant();
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
            if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            {
                return Results.Json(
                    new { error = "Nieprawidlowy e-mail lub haslo." },
                    statusCode: StatusCodes.Status401Unauthorized);
            }

            return Results.Ok(new AuthResponse(user.Id, user.Email, user.Name, user.Theme));
        });
    }
}
