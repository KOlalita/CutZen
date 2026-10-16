using CutZenApi.Enums;

namespace CutZenApi.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }    
        public bool IsActive { get; set; } = true; // Soft delete flag


        public string Names { get; set; }
        public string LastNames { get; set; }
        public int? Age { get; set; }
        public string PhoneNumber { get; set; }
        public string Desciption { get; set; }


        public Roles Role { get; set; }
    }
}

