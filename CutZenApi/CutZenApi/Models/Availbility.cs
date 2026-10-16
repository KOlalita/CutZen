namespace CutZenApi.Models
{
    public class Availability
    {
        public int Id { get; set; }
        public int BarberId { get; set; }
        public DayOfWeek DayOfWeek { get; set; } // 0-6
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public TimeSpan? BreakStart { get; set; } // Nullable
        public TimeSpan? BreakEnd { get; set; }   // Nullable
        public bool IsActive { get; set; } = true;

        public User Barber { get; set; }
    }
}