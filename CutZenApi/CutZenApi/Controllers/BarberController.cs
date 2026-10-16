using CutZenApi.Data;
using CutZenApi.DTOs;
using CutZenApi.Services.Barber;
using CutZenApi.Services.Barber.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CutZenApi.Controllers
{
    [Route("api/barber")]
    [ApiController]
    [Authorize(Roles = "Barber")]
    public class BarberController : ControllerBase
    {
        private readonly IBarberService _service;
        private readonly AppDbContext _context;

        public BarberController(IBarberService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }


        // Helper method to get the authenticated user's ID from the JWT token
        // UserID need to be get from the token, not from the query string or route parameters, to ensure security and proper authentication.
        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
                throw new UnauthorizedAccessException("Invalid token");

            return int.Parse(claim.Value);
        }


        // api/barber/my-appointments
        [HttpGet("appointments")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var barberId = GetUserId();

            var appointments = await _service.GetMyAppointmentsAsync(barberId);

            return Ok(appointments);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetMyStats()
        {
            var barberId = GetUserId();
            var stats = await _service.GetMyStatsAsync(barberId);
            return Ok(stats);
        }


        [HttpPut("appointments/{appointmentId}")]
        public async Task<IActionResult> UpdateAppointmentStatus(int appointmentId, [FromBody] UpdateBarberAppointmentDto dto)
        {
            try
            {
                var barberId = GetUserId();

                // Verificar que la cita pertenezca a este barbero
                var appointment = await _context.Appointments
                    .FirstOrDefaultAsync(a => a.Id == appointmentId && a.BarberId == barberId);

                if (appointment == null)
                    return NotFound(new { message = "Appointment not found" });

                // Actualizar solo status y payment
                if (dto.Status.HasValue)
                    appointment.Status = dto.Status.Value;
                if (dto.Payment.HasValue)
                    appointment.Payment = dto.Payment.Value;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Appointment updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



    }
}
