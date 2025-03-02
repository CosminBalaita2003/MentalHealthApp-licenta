namespace MentalHealthApp.Models
{
    public class UserProfile
    {
        public int Id { get; set; }
        
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime DateOfBirth { get; set; }
        public TimeSpan TimeOfBirth { get; set; }

        public int Age => CalculateAge();
        public string BirthLocation { get; set; }

        public string Pronouns { get; set; }
        public string Gender { get; set; }
        public string Bio { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        private int CalculateAge()
        {
            DateTime now = DateTime.Today;
            int age = now.Year - DateOfBirth.Year;
            if (DateOfBirth.Date > now.AddYears(-age)) age--;
            return age;
        }   



    }
}
