using CutZenApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CutZenApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Availability> Availabilities { get; set; }
        public DbSet<Service> Services { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // USER
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .IsUnique();


            // SERVICE
            modelBuilder.Entity<Service>()
                .HasKey(s => s.Id);





            // AVAILABILITY
            modelBuilder.Entity<Availability>()
                .HasKey(a => a.Id);

            modelBuilder.Entity<Availability>()
                .HasOne(a => a.Barber)
                .WithMany()
                .HasForeignKey(a => a.BarberId)
                .OnDelete(DeleteBehavior.Cascade);

            // Evitar duplicar día para mismo barber
            modelBuilder.Entity<Availability>()
                .HasIndex(a => new { a.BarberId, a.DayOfWeek })
                .IsUnique();
        


            // APPOINTMENT
            modelBuilder.Entity<Appointment>()
                .HasKey(a => a.Id);

            // Relación con Client
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Client)
                .WithMany()
                .HasForeignKey(a => a.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación con Barber
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Barber)
                .WithMany()
                .HasForeignKey(a => a.BarberId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación con Service
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Service)
                .WithMany()
                .HasForeignKey(a => a.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Evitar doble reserva (slot único)
            modelBuilder.Entity<Appointment>()
                .HasIndex(a => new { a.BarberId, a.StartTime })
                .IsUnique();
        }

    }
}
