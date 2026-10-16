using CutZenApi.Data;
using CutZenApi.DTOs;
using CutZenApi.Models;
using CutZenApi.Services.Barber.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CutZenApi.Services.Barber
{
    public class BarberService : IBarberService
    {
        private readonly AppDbContext _context;

        public BarberService(AppDbContext context)
        {
            _context = context;
        }

        //<summary>
        //Get all appointments for a specific barber.
        //</summary>
        public async Task<List<Appointment>> GetMyAppointmentsAsync(int barberId)
        {
            return await _context.Appointments
                .Where(a => a.BarberId == barberId)
                .Include(a => a.Client)
                .Include(a => a.Service)
                .OrderBy(a => a.StartTime)
                .ToListAsync();
        }

        public async Task<BarberStatsDto> GetMyStatsAsync(int barberId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.BarberId == barberId)
                .Include(a => a.Service)
                .ToListAsync();

            var completed = appointments.Where(a => a.Status == Enums.Status.Completed).ToList();
            var pending = appointments.Where(a => a.Status == Enums.Status.Pending).ToList();
            var cancelled = appointments.Where(a => a.Status == Enums.Status.Canceled).ToList();

            // Calculo de Horas totales, cada servicio  de una hora fijo 
            var totalMinutes = completed.Count * 60; // 


            return new BarberStatsDto
            {
                TotalAppointments = appointments.Count,
                TotalRevenue = completed.Sum(a => a.Service?.Price ?? 0),
                UniqueClients = appointments.Select(a => a.ClientId).Distinct().Count(),
                TotalHours = Math.Round(totalMinutes / 60.0, 1),
                CompletedAppointments = completed.Count,
                PendingAppointments = pending.Count,
                CancelledAppointments = cancelled.Count
            };
        }
        
        


    }
}
