using CutZenApi.Configuration;
using CutZenApi.Models;
using CutZenApi.Services.Auth.Intefaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CutZenApi.Services.Auth
{
    public class JwtService : IJwtService
    {
        private readonly JwtSettings _settings;

        public JwtService(IOptions<JwtSettings> settings)
        {
            _settings = settings.Value;
        }

        //<summary>
        //Method to generate a JWT token for a given username
        //</summary>
        public string GenerateToken(User user)
        {
            // 🔴 FIX: Rechazar token para usuarios inactivos
            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Cannot generate token for inactive user.");
            }

            var claims = new List<Claim>
    {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    }
            ;

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_settings.Key)
            );

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(_settings.ExpirationDays),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
