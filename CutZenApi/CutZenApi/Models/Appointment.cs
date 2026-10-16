using CutZenApi.Enums;

namespace CutZenApi.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        // Foreign keys to link the appointment to the client, barber, and service
        public int ClientId { get; set; }
        public int BarberId { get; set; }
        public int ServiceId { get; set; }


        // Date and time of the appointment
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        //Status and Payment 
        public Status Status { get; set; }



        public Payment Payment { get; set; }


        // Navigation properties to access related data
        public User Client { get; set; }
        public User Barber { get; set; }
        public Service Service { get; set; }

    }
}
