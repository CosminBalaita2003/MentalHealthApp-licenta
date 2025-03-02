namespace MentalHealthApp.Models
{
    public class Progress
    {
        public int Id { get; set; }
        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime Date { get; set; }
    }
}
