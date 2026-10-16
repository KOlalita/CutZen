using CutZenApi.Data;
using CutZenApi.DTOs.Auth;
using CutZenApi.Enums;
using CutZenApi.Models;
using CutZenApi.Services.Auth.Intefaces;
using Microsoft.EntityFrameworkCore;

namespace CutZenApi.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwt;

        public AuthService(AppDbContext context, IJwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }
        //<summary>
        //Register User method
        //</summary>
        public async Task<AuthResponseDto> RegisterUserAsync(RegisterDto dto)
        {
            var exist = await _context.Users
                .AnyAsync(x => x.UserName == dto.UserName);

            if (exist)
                throw new Exception("User Already Exists");

            var user = new User
            {
                UserName = dto.UserName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = Roles.Client,
                // Save additional fields
                Names = dto.Names,
                LastNames = dto.LastNames,
                Age = dto.Age,
                PhoneNumber = dto.PhoneNumber,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Role = user.Role.ToString(),
                UserName = user.UserName
            };
        }


        //<summary>
        // Implement Login method for Clients, Barbers and Admins
        //</summary>
        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == dto.UserName);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid credentials.");
            }

            // 🔴 FIX: Verificar que el usuario esté activo
            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Account is deactivated.");
            }

            var token = _jwt.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                UserName = user.UserName,
                Role = user.Role.ToString()
            };
        }
    }



}

