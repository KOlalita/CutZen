namespace CutZenApi.DTOs
{
    public class AvailabilityDto
    {
        public int Id { get; set; }
        public int BarberId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public TimeSpan? BreakStart { get; set; }
        public TimeSpan? BreakEnd { get; set; }
        public bool IsActive { get; set; }
    }
}
