using CutZenApi.DTOs;
using CutZenApi.Enums;
using CutZenApi.Models;
using System.Collections.Generic;

namespace CutZenApi.Services.Admin.Interfaces
{
    public interface IAdminService
    {
        // USERS
        Task<List<User>> GetUsersAsync(Roles? role, string? search, int page = 1, int pageSize = 10);
        Task<User> UpdateUserAsync(int userId, EditUserDto dto);

        // BARBERS
        Task<UserDto> CreateBarberAsync(UserDto dto);
        Task DeleteBarberAsync(int barberId);

        // AVAILABILITIES / SCHEDULES
        Task<List<AvailabilityDto>> GetBarberScheduleAsync(int barberId);
        Task UpdateBarberScheduleAsync(int barberId, List<UpdateBarberAvailabilityDto> schedule);
        Task CreateDefaultScheduleAsync(int barberId); // Crea Lun-Sáb 9am-5pm

        // APPOINTMENTS
        Task<List<Appointment>> GetAppointmentsAsync(string? search, int page = 1, int pageSize = 10);

        // SERVICES
        Task<List<Service>> GetServicesAsync(int page = 1, int pageSize = 10);
        Task<Service> UpdateServiceAsync(int serviceId, UpdateServiceDto dto);
        Task DeleteServiceAsync(int serviceId);
        
    }
}
