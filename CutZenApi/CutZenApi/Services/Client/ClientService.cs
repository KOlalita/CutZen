using CutZenApi.Data;
using CutZenApi.DTOs;
using CutZenApi.Enums;
using CutZenApi.Models;
using CutZenApi.Services.Client.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CutZenApi.Services.Client
{
    public class ClientService : IClientService
    {
        private readonly AppDbContext _context;

        public ClientService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetBarbersAsync()
        {
            return await _context.Users
                .Where(u => u.Role == Roles.Barber && u.IsActive)
                .ToListAsync();
        }

        public async Task<List<Service>> GetServicesAsync()
        {
            return await _context.Services
                .Where(s => s.IsActive)
                .ToListAsync();
        }

        public class TimeSlotDto
        {
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
            public string Label { get; set; } = string.Empty;
            public bool IsAvailable { get; set; }
            public bool IsPast { get; set; }
        }

        /// <summary>
        /// Obtiene la zona horaria local del servidor de forma dinámica.
        /// En Windows usa DisplayName, en Linux/Mac usa StandardName.
        /// </summary>
        private static TimeZoneInfo GetLocalTimeZone()
        {
            try
            {
                // Intentar obtener la zona horaria del sistema
                return TimeZoneInfo.Local;
            }
            catch
            {
                // Fallback: usar UTC si no se puede detectar
                return TimeZoneInfo.Utc;
            }
        }

        public async Task<List<TimeSlotDto>> GetAvailableSlotsAsync(int barberId, DateTime date, string? clientTimeZoneId = null)
        {
            // La fecha viene como DateTime con Kind=Unspecified (desde "YYYY-MM-DD")
            var targetDate = DateTime.SpecifyKind(date.Date, DateTimeKind.Unspecified);
            var dayOfWeek = targetDate.DayOfWeek;

            // 🔴 DETECCIÓN DINÁMICA DE TIMEZONE
            // Prioridad: 1) Timezone enviado por el cliente, 2) Timezone del servidor
            TimeZoneInfo tz;
            try
            {
                if (!string.IsNullOrEmpty(clientTimeZoneId))
                {
                    tz = TimeZoneInfo.FindSystemTimeZoneById(clientTimeZoneId);
                }
                else
                {
                    tz = GetLocalTimeZone();
                }
            }
            catch
            {
                tz = TimeZoneInfo.Utc; // Fallback seguro
            }

            // Obtener hora actual en la zona horaria correcta
            var nowUtc = DateTime.UtcNow;
            var nowLocal = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, tz);

            Console.WriteLine($"🌍 TimeZone: {tz.DisplayName} ({tz.StandardName})");
            Console.WriteLine($"🕐 UTC Now: {nowUtc:yyyy-MM-dd HH:mm}");
            Console.WriteLine($"🕐 Local Now: {nowLocal:yyyy-MM-dd HH:mm}");
            Console.WriteLine($"🕐 Target Date: {targetDate:yyyy-MM-dd}");

            // 1. Buscar disponibilidad del barbero para ese día
            var availability = await _context.Availabilities
                .FirstOrDefaultAsync(a => a.BarberId == barberId
                                       && a.DayOfWeek == dayOfWeek
                                       && a.IsActive);

            if (availability == null)
            {
                Console.WriteLine($"❌ No availability found for barber {barberId} on {dayOfWeek}");
                return new List<TimeSlotDto>();
            }

            Console.WriteLine($"✅ Barber {barberId} works {availability.StartTime} to {availability.EndTime}");

            // 2. Obtener citas existentes para ese barbero y fecha
            var existingAppointments = await _context.Appointments
                .Where(a => a.BarberId == barberId
                         && a.StartTime.Date == targetDate.Date
                         && a.Status != Status.Canceled)
                .Select(a => a.StartTime)
                .ToListAsync();

            // 3. Generar slots de 1 hora en HORA LOCAL
            var slots = new List<TimeSlotDto>();

            var workStartLocal = targetDate.Add(availability.StartTime);
            var workEndLocal = targetDate.Add(availability.EndTime);
            var breakStartLocal = availability.BreakStart.HasValue
                ? targetDate.Add(availability.BreakStart.Value)
                : (DateTime?)null;
            var breakEndLocal = availability.BreakEnd.HasValue
                ? targetDate.Add(availability.BreakEnd.Value)
                : (DateTime?)null;

            Console.WriteLine($"🕐 Work hours: {workStartLocal:HH:mm} to {workEndLocal:HH:mm}");

            for (var time = workStartLocal; time < workEndLocal; time = time.AddHours(1))
            {
                var slotEnd = time.AddHours(1);

                // Saltar el break
                if (breakStartLocal.HasValue && breakEndLocal.HasValue)
                {
                    if (time >= breakStartLocal.Value && time < breakEndLocal.Value)
                        continue;
                    if (time < breakStartLocal.Value && slotEnd > breakStartLocal.Value)
                        continue;
                }

                // Verificar si está ocupado
                var isTaken = existingAppointments.Any(a =>
                    a.Hour == time.Hour && a.Minute == time.Minute);

                // 🔴 COMPARAR EN HORA LOCAL: solo marcar pasado si es HOY y ya pasó la hora
                var isToday = targetDate.Date == nowLocal.Date;
                var isPast = isToday && time <= nowLocal;

                slots.Add(new TimeSlotDto
                {
                    StartTime = time,
                    EndTime = slotEnd,
                    Label = $"{time:h tt}-{slotEnd:h tt}".ToLower(),
                    IsAvailable = !isTaken && !isPast,
                    IsPast = isPast
                });
            }

            return slots;
        }

        public async Task<List<Appointment>> GetAppointmentHistoryAsync(int clientId)
        {
            return await _context.Appointments
                .Where(a => a.ClientId == clientId)
                .Include(a => a.Barber)
                .Include(a => a.Service)
                .OrderByDescending(a => a.StartTime)
                .ToListAsync();
        }

        public async Task CreateAppointmentAsync(int clientId, CreateAppointmentDto dto)
        {
            var barber = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == dto.BarberId && u.Role == Roles.Barber);
            if (barber == null)
                throw new Exception("Barber not found.");

            // Validación dinámica con timezone local
            var tz = GetLocalTimeZone();
            var nowUtc = DateTime.UtcNow;
            var nowLocal = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, tz);

            if (dto.StartTime <= nowLocal)
                throw new Exception("Cannot book appointments in the past.");

            var slotTaken = await _context.Appointments
                .AnyAsync(a => a.BarberId == dto.BarberId
                    && a.StartTime == dto.StartTime
                    && a.Status != Status.Canceled);

            if (slotTaken)
                throw new Exception("This time slot is already booked.");

            var service = await _context.Services.FindAsync(dto.ServiceId);
            var appointment = new Appointment
            {
                ClientId = clientId,
                BarberId = dto.BarberId,
                ServiceId = dto.ServiceId,
                StartTime = dto.StartTime,
                EndTime = dto.StartTime.AddMinutes(service.DurationMinutes),
                Status = Status.Pending,
                Payment = dto.Payment
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task<ClientProfileDto> GetProfileAsync(int clientId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == clientId);

            if (user == null)
                throw new Exception("User not found.");

            return new ClientProfileDto
            {
                Id = user.Id,
                Name = user.Names,
                LastName = user.LastNames,
                Age = user.Age,
                Phone = user.PhoneNumber,
                Username = user.UserName,
                Role = user.Role.ToString()
            };
        }
    }
}