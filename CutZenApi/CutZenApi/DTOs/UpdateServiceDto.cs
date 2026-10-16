namespace CutZenApi.DTOs
{
    public class UpdateServiceDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public int DurationMinutes { get; set; }
    }
}
