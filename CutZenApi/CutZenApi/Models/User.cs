using CutZenApi.Enums;
namespace CutZenApi.Models
{
    public class User   //Represents Clients, Barbers and Admins
    {
        
        public int Id { get; set; }     
        public string UserName { get; set; }    
        public string PasswordHash { get; set; }    
        public bool IsActive { get; set; } = true; // Soft delete flag


        public string Names { get; set; }
        public string LastNames { get; set; }
        public int? Age { get; set; }
        public string PhoneNumber { get; set; }
        public string Desciption { get; set; }


        public Roles Role { get; set; } 
    }
}
