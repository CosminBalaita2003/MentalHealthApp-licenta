using backend.Models;
using MentalHealthApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace MentalHealthApp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext>
        options)
        : base(options)
        {
        }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<Progress> Progresses { get; set; }
        public DbSet<Emotion> Emotions { get; set; }
        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<TestResult> TestResults { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Progress>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId);

            builder.Entity<Progress>()
                .HasOne(p => p.Exercise)
                .WithMany()
                .HasForeignKey(p => p.ExerciseId);

            builder.Entity<Exercise>()
                .HasOne(e => e.Category)
                .WithMany()
                .HasForeignKey(e => e.CategoryId);

            builder.Entity<ApplicationUser>()
                .HasOne(u => u.City)
                .WithMany()
                .HasForeignKey(u => u.CityId);

            builder.Entity<TestResult>()
               .HasOne(t => t.User)
               .WithMany(u => u.TestResults)
               .HasForeignKey(t => t.UserId)
               .OnDelete(DeleteBehavior.Cascade); // Șterge testele dacă userul e șters

            builder.Entity<JournalEntry>()
            .HasOne(j => j.Emotion)
            .WithMany()
            .HasForeignKey(j => j.EmotionId)
            .OnDelete(DeleteBehavior.Restrict); // Nu permite ștergerea emoțiilor asociate


            builder.Entity<JournalEntry>()
                .HasOne(j => j.User)
                .WithMany(u => u.JournalEntries)
                .HasForeignKey(j => j.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Șterge jurnalele dacă userul e șters
        }
    }
    }

