using CutZenApi.Data;
using CutZenApi.DTOs;
using CutZenApi.Enums;
using CutZenApi.Models;
using CutZenApi.Services.Admin.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace CutZenApi.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        // ========== USERS ==========
        public async Task<List<User>> GetUsersAsync(Roles? role, string? search, int page = 1, int pageSize = 10)
        {
            var query = _context.Users
                .Where(u => u.IsActive)
                .AsQueryable();

            if (role.HasValue)
                query = query.Where(u => u.Role == role.Value);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u =>
                    u.UserName.Contains(search) ||
                    u.Names.Contains(search) ||
                    u.LastNames.Contains(search));
            }

            return await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<User> UpdateUserAsync(int userId, EditUserDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new KeyNotFoundException("User not found");

            if (!string.IsNullOrEmpty(dto.Password))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            user.UserName = dto.UserName;
            user.IsActive = dto.IsActive;
            user.Names = dto.Names;
            user.LastNames = dto.LastNames;
            user.Age = dto.Age;
            user.PhoneNumber = dto.PhoneNumber;
            user.Desciption = dto.Desciption;

            // 🔴 FIX: Parsear string a enum
            user.Role = Enum.Parse<Roles>(dto.Role, true);

            await _context.SaveChangesAsync();
            return user;
        }

        // ========== BARBERS ==========
        public async Task<UserDto> CreateBarberAsync(UserDto dto)
        {
            var user = new User
            {
                UserName = dto.UserName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                IsActive = true,
                Names = dto.Names,
                LastNames = dto.LastNames,
                Age = dto.Age,
                PhoneNumber = dto.PhoneNumber,
                Desciption = dto.Desciption,
                Role = Roles.Barber
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 🔴 CREAR HORARIO POR DEFECTO: Lun-Sáb, 9am-5pm, break 1-2pm
            await CreateDefaultScheduleAsync(user.Id);

            return new UserDto
            {
                UserName = user.UserName,
                Names = user.Names,
                LastNames = user.LastNames,
                Age = user.Age,
                PhoneNumber = user.PhoneNumber,
                Desciption = user.Desciption
            };
        }

        public async Task DeleteBarberAsync(int barberId)
        {
            var barber = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == barberId
                    && u.Role == Roles.Barber
                    && u.IsActive);

            if (barber == null)
                throw new KeyNotFoundException("Barber not found");

            barber.IsActive = false;
            await _context.SaveChangesAsync();
        }

        // ========== AVAILABILITIES / SCHEDULES ==========
        public async Task<List<AvailabilityDto>> GetBarberScheduleAsync(int barberId)
        {
            var schedule = await _context.Availabilities
                .Where(a => a.BarberId == barberId)
                .OrderBy(a => a.DayOfWeek)
                .ToListAsync();

            return schedule.Select(a => new AvailabilityDto
            {
                Id = a.Id,
                BarberId = a.BarberId,
                DayOfWeek = a.DayOfWeek,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                BreakStart = a.BreakStart,
                BreakEnd = a.BreakEnd,
                IsActive = a.IsActive
            }).ToList();
        }

        public async Task UpdateBarberScheduleAsync(int barberId, List<UpdateBarberAvailabilityDto> schedule)
        {
            // Validar que el barbero existe
            var barber = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == barberId && u.Role == Roles.Barber && u.IsActive);

            if (barber == null)
                throw new KeyNotFoundException("Barber not found");

            // Eliminar horarios existentes
            var existing = await _context.Availabilities
                .Where(a => a.BarberId == barberId)
                .ToListAsync();

            _context.Availabilities.RemoveRange(existing);

            // Crear nuevos horarios
            for (int i = 0; i < schedule.Count; i++)
            {
                var day = (DayOfWeek)i; // 0=Sunday, 1=Monday...
                var daySchedule = schedule[i];

                if (daySchedule.IsActive)
                {
                    _context.Availabilities.Add(new Availability
                    {
                        BarberId = barberId,
                        DayOfWeek = day,
                        StartTime = TimeSpan.Parse(daySchedule.StartTime),  // 🔴 Parsear aquí
                        EndTime = TimeSpan.Parse(daySchedule.EndTime),
                        BreakStart = string.IsNullOrEmpty(daySchedule.BreakStart) ? null : TimeSpan.Parse(daySchedule.BreakStart),
                        BreakEnd = string.IsNullOrEmpty(daySchedule.BreakEnd) ? null : TimeSpan.Parse(daySchedule.BreakEnd),
                        IsActive = true
                    });
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task CreateDefaultScheduleAsync(int barberId)
        {
            // Lun-Sáb (1-6): 9am-5pm, break 1pm-2pm
            // Domingo (0): OFF
            var defaultSchedule = new List<Availability>
            {
                new() { BarberId = barberId, DayOfWeek = DayOfWeek.Monday, StartTime = TimeSpan.Parse("09:00"), EndTime = TimeSpan.Parse("17:00"), BreakStart = TimeSpan.Parse("13:00"), BreakEnd = TimeSpan.Parse("14:00"), IsActive = true },
                new() { BarberId = barberId, DayOfWeek = DayOfWeek.Tuesday, StartTime = TimeSpan.Parse("09:00"), EndTime = TimeSpan.Parse("17:00"), BreakStart = TimeSpan.Parse("13:00"), BreakEnd = TimeSpan.Parse("14:00"), IsActive = true },
                new() { BarberId = barberId, DayOfWeek = DayOfWeek.Wednesday, StartTime = TimeSpan.Parse("09:00"), EndTime = TimeSpan.Parse("17:00"), BreakStart = TimeSpan.Parse("13:00"), BreakEnd = TimeSpan.Parse("14:00"), IsActive = true },
                new() { BarberId = barberId, DayOfWeek = DayOfWeek.Thursday, StartTime = TimeSpan.Parse("09:00"), EndTime = TimeSpan.Parse("17:00"), BreakStart = TimeSpan.Parse("13:00"), BreakEnd = TimeSpan.Parse("14:00"), IsActive = true },
                new() { BarberId = barberId, DayOfWeek = DayOfWeek.Friday, StartTime = TimeSpan.Parse("09:00"), EndTime = TimeSpan.Parse("17:00"), BreakStart = TimeSpan.Parse("13:00"), BreakEnd = TimeSpan.Parse("14:00"), IsActive = true },
                new() { BarberId = barberId, DayOfWeek = DayOfWeek.Saturday, StartTime = TimeSpan.Parse("09:00"), EndTime = TimeSpan.Parse("17:00"), BreakStart = TimeSpan.Parse("13:00"), BreakEnd = TimeSpan.Parse("14:00"), IsActive = true },
            }
            ;

            await _context.Availabilities.AddRangeAsync(defaultSchedule);
            await _context.SaveChangesAsync();
        }

        // ========== APPOINTMENTS ==========
        public async Task<List<Appointment>> GetAppointmentsAsync(string? search, int page = 1, int pageSize = 10)
        {
            var query = _context.Appointments
                .AsNoTracking()
                .Include(a => a.Client)
                .Include(a => a.Barber)
                .Include(a => a.Service)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(a =>
                    a.Client.Names.Contains(search) ||
                    a.Barber.Names.Contains(search));
            }

            return await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // ========== SERVICES ==========
        public async Task<List<Service>> GetServicesAsync(int page = 1, int pageSize = 10)
        {
            return await _context.Services
                .Where(s => s.IsActive)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Service> UpdateServiceAsync(int serviceId, UpdateServiceDto dto)
        {
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == serviceId && s.IsActive);

            if (service == null)
                throw new KeyNotFoundException("Service not found");

            service.Name = dto.Name;
            service.Price = dto.Price;
            service.Description = dto.Description;
            service.DurationMinutes = dto.DurationMinutes;

            await _context.SaveChangesAsync();
            return service;
        }

        public async Task DeleteServiceAsync(int serviceId)
        {
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == serviceId && s.IsActive);

            if (service == null)
                throw new KeyNotFoundException("Service not found");

            service.IsActive = false;
            await _context.SaveChangesAsync();
        }

      
    }
}
