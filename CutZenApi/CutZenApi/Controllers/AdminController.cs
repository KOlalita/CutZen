using CutZenApi.Data;
using CutZenApi.DTOs;
using CutZenApi.Enums;
using CutZenApi.Models;
using CutZenApi.Services.Admin.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;


namespace CutZenApi.Controllers
{

    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _service;
        private readonly AppDbContext _context;

        public AdminController(IAdminService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        // GET api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(
            [FromQuery] Roles? role,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var users = await _service.GetUsersAsync(role, search, page, pageSize);
            return Ok(users);
        }

        // PUT api/admin/users/1
        [HttpPut("users/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] EditUserDto dto)
        {
            var user = await _service.UpdateUserAsync(userId, dto);
            return Ok(user);
        }

        // POST api/admin/barbers
        [HttpPost("barbers")]
        public async Task<IActionResult> CreateBarber([FromBody] UserDto dto)
        {
            var barber = await _service.CreateBarberAsync(dto);
            return Ok(barber);
        }

        // DELETE api/admin/barbers/1
        [HttpDelete("barbers/{barberId}")]
        public async Task<IActionResult> DeleteBarber(int barberId)
        {
            try
            {
                await _service.DeleteBarberAsync(barberId);
                return Ok(new { message = "Barber deleted successfully." }); 
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET api/admin/appointments
        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointments(
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var appointments = await _service.GetAppointmentsAsync(search, page, pageSize);
            return Ok(appointments);
        }

        // GET api/admin/services
        [HttpGet("services")]
        public async Task<IActionResult> GetServices(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var services = await _service.GetServicesAsync(page, pageSize);
            return Ok(services);
        }

        // PUT api/admin/services/1
        [HttpPut("services/{serviceId}")]
        public async Task<IActionResult> UpdateService(
            int serviceId,
            [FromBody] UpdateServiceDto dto)
        {
            var service = await _service.UpdateServiceAsync(serviceId, dto);
            return Ok(service);
        }

        // DELETE api/admin/services/1
        [HttpDelete("services/{serviceId}")]
        public async Task<IActionResult> DeleteService(int serviceId)
        {
            await _service.DeleteServiceAsync(serviceId);
            return NoContent();
        }

        // AdminController.cs
        [HttpPost("services/json")]
        public async Task<IActionResult> CreateServiceJson([FromBody] CreateServiceJsonDto dto)
        {
            var service = new Service
            {
                Name = dto.Name,
                Price = dto.Price,
                Description = dto.Description,
                DurationMinutes = dto.DurationMinutes,
                IsActive = true
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return Ok(service);
        }

            [HttpGet("barbers/{barberId}/schedule")]
            public async Task<IActionResult> GetBarberSchedule(int barberId)
            {
                try
                {
                    var schedule = await _service.GetBarberScheduleAsync(barberId);
                    return Ok(schedule);
                }
                catch (Exception ex)
                {
                    return NotFound(new { message = ex.Message });
                }
            }

            [HttpPut("barbers/{barberId}/schedule")]
            public async Task<IActionResult> UpdateBarberSchedule(int barberId, [FromBody] List<UpdateBarberAvailabilityDto> schedule)
{
                try
                {
                    await _service.UpdateBarberScheduleAsync(barberId, schedule);
                    return Ok(new { message = "Schedule updated successfully." });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }

        
    }
}
