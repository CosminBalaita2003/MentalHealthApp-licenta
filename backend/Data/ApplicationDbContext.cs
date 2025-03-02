using MentalHealthApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

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
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<City> Cities { get; set; }

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
            builder.Entity<UserProfile>()
               .HasOne(up => up.User)
               .WithOne()
               .HasForeignKey<UserProfile>(up => up.UserId);
        }
            
                                                                        
        }   
}
                                                                            