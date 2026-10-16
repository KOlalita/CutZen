namespace CutZenApi.DTOs
{
    public class CreateServiceDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public int DurationMinutes { get; set; } = 45;
        public IFormFile? ImageFile { get; set; } // ← nullable
    }
}
