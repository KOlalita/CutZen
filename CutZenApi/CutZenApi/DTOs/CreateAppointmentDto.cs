using CutZenApi.Enums;

namespace CutZenApi.DTOs
{
    public class CreateAppointmentDto
    {
        public int BarberId { get; set; }
        public int ServiceId { get; set; }
        public DateTime StartTime { get; set; }
        public Payment Payment { get; set; }  
    }
}