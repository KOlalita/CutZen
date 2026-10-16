using CutZenApi.DTOs;
using CutZenApi.Services.Client;
using CutZenApi.Services.Client.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CutZenApi.Controllers
{
    [Route("api/client")]
    [ApiController]
    [Authorize]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _client;

        public ClientController(IClientService client)
        {
            _client = client;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(claim, out var userId))
                throw new UnauthorizedAccessException("Invalid token");
            return userId;
        }

        [HttpGet("barbers")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBarbers()
        {
            var barbers = await _client.GetBarbersAsync();
            return Ok(barbers);
        }

        [HttpGet("services")]
        [AllowAnonymous]
        public async Task<IActionResult> GetServices()
        {
            var services = await _client.GetServicesAsync();
            return Ok(services);
        }

        [HttpGet("available-slots")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvailableSlots(
            [FromQuery] int barberId,
            [FromQuery] DateTime date,
            [FromQuery] string? timeZone = null) // 🔴 Nuevo parámetro opcional
        {
            var slots = await _client.GetAvailableSlotsAsync(barberId, date, timeZone);
            return Ok(slots);
        }

        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointments()
        {
            try
            {
                var clientId = GetUserId();
                var history = await _client.GetAppointmentHistoryAsync(clientId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("appointments")]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDto dto)
        {
            try
            {
                var clientId = GetUserId();
                await _client.CreateAppointmentAsync(clientId, dto);
                return Ok(new { message = "Appointment created successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var clientId = GetUserId();
                var profile = await _client.GetProfileAsync(clientId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("info")]
        [AllowAnonymous]
        public IActionResult GetStudioInfo()
        {
            return Ok(new[]
            {
                new { title = "Opening hours", detail = "Mon–Sat · 09:00–20:00 · Sun · 10:00–16:00", icon = "Clock3" },
                new { title = "Address", detail = "214 Mercer Lane, Brooklyn, NY", icon = "MapPin" },
                new { title = "Phone", detail = "+1 (718) 555-0147", icon = "Phone" }
            });
        }
    }
}   