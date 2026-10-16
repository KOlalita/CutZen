using CutZenApi.DTOs;
using CutZenApi.Models;

namespace CutZenApi.Services.Barber.Interfaces
{
    public interface IBarberService
    {
        Task<List<Appointment>> GetMyAppointmentsAsync(int barberId);
        Task<BarberStatsDto> GetMyStatsAsync(int barberId); // ← NUEVO
    }
}
