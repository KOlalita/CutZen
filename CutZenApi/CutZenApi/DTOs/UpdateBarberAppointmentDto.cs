using CutZenApi.Enums;

namespace CutZenApi.DTOs
{
    public class UpdateBarberAppointmentDto
    {
        public Status? Status { get; set; }
        public Payment? Payment { get; set; }
    }
}