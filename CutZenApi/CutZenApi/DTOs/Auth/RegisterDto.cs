using System.ComponentModel.DataAnnotations;

namespace CutZenApi.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        public string Role { get; set; } // Set to "Client" by controller

        // Additional client fields
        public string Names { get; set; }
        public string LastNames { get; set; }
        public int? Age { get; set; }
        public string PhoneNumber { get; set; }
    }
}