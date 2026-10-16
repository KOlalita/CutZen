using CutZenApi.DTOs;
using CutZenApi.Models;

namespace CutZenApi.Services.Client.Interfaces
{
    public interface IClientService
    {
        Task<List<User>> GetBarbersAsync();
        Task<List<Service>> GetServicesAsync();
        Task<List<ClientService.TimeSlotDto>> GetAvailableSlotsAsync(int barberId, DateTime date, string? clientTimeZoneId = null);
        Task<List<Appointment>> GetAppointmentHistoryAsync(int clientId);
        Task CreateAppointmentAsync(int clientId, CreateAppointmentDto dto);
        Task<ClientProfileDto> GetProfileAsync(int clientId);
    }
}