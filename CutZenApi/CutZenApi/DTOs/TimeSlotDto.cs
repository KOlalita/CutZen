namespace CutZenApi.DTOs
{
    public class TimeSlotDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Label { get; set; } = string.Empty; // "9am-10am"
        public bool IsAvailable { get; set; }
    }
}