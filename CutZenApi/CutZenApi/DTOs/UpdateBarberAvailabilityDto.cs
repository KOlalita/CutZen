using System.ComponentModel.DataAnnotations;

namespace CutZenApi.DTOs
{
    public class UpdateBarberAvailabilityDto
    {
        public string StartTime { get; set; } 
        public string EndTime { get; set; }
        public string? BreakStart { get; set; }
        public string? BreakEnd { get; set; }
        public bool IsActive { get; set; }
    }
}
