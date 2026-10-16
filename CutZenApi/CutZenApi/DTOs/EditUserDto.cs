public class EditUserDto
{
    public string UserName { get; set; }
    public string? Password { get; set; }
    public bool IsActive { get; set; } = true;
    public string Names { get; set; }
    public string LastNames { get; set; }
    public int? Age { get; set; }
    public string PhoneNumber { get; set; }
    public string Desciption { get; set; }
    public string Role { get; set; } 
} 