using CutZenApi.Models;

namespace CutZenApi.Services.Auth.Intefaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
