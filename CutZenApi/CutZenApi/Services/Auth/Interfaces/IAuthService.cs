using CutZenApi.DTOs.Auth;

namespace CutZenApi.Services.Auth.Intefaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterUserAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }
}
