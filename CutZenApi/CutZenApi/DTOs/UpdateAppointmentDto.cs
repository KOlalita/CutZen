using CutZenApi.Enums;

namespace CutZenApi.DTOs
{
    public class UpdateAppointmentDto
    {
        public int ServiceId { get; set; }
        public Status Status { get; set; }
        public Payment Payment { get; set; }
    }
}