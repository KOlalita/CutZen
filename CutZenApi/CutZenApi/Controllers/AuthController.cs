using CutZenApi.DTOs.Auth;
using CutZenApi.Services.Auth.Intefaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Eventing.Reader;

namespace CutZenApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }

        //<summary>
        //Endpoint for user registration.
        //</summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            dto.Role = "Client"; 

            var result = await _auth.RegisterUserAsync(dto);
            return Ok(result);
        }



        //<summary> 
        //Endpoint for user login.
        //</summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _auth.LoginAsync(dto);
            return Ok(result);
        }



    }
}
