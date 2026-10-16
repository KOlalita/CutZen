namespace CutZenApi.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public int DurationMinutes { get; set; } = 60;
        public bool IsActive { get; set; } = true;
        public string? ImageUrl { get; set; } = string.Empty;
    }
}
