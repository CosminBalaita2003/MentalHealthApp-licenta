using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace MentalHealthApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }

        public DateTime DateOfBirth { get; set; }
        public TimeSpan TimeOfBirth { get; set; }

        public int Age => CalculateAge();
        public int CityId { get; set; }
        public City City { get; set; }

        public string Pronouns { get; set; }
        public string Gender { get; set; }
        public string Bio { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
        public ICollection<JournalEntry> JournalEntries { get; set; }
        private int CalculateAge()
        {
            DateTime now = DateTime.Today;
            int age = now.Year - DateOfBirth.Year;
            if (DateOfBirth.Date > now.AddYears(-age)) age--;
            return age;
        }
    }
}
