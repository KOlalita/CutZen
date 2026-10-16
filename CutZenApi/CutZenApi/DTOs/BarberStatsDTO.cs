namespace CutZenApi.DTOs
{
    public class BarberStatsDto
    {
        public int TotalAppointments { get; set; }
        public decimal TotalRevenue { get; set; }
        public int UniqueClients { get; set; }
        public double TotalHours { get; set; }
        public int CompletedAppointments { get; set; }
        public int PendingAppointments { get; set; }
        public int CancelledAppointments { get; set; }
    }
}
