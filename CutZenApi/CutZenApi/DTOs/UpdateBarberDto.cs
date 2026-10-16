namespace CutZenApi.DTOs
{
    public class UpdateBarberDto
    {
        //Barber: Names, LastNames, Age, PhoneNumber and Description
        public string Names { get; set; }

        public string LastNames { get; set; }

        public int? Age { get; set; }

        public string PhoneNumber { get; set; }

        public string Description { get; set; }
    }
}