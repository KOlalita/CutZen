namespace CutZenApi.DTOs
{
    public class BarberScheduleDto
    {
        public int BarberId { get; set; }
        public string BarberName { get; set; } = string.Empty;
        public List<AvailabilityDto> Schedule { get; set; } = new ();
    }
}
