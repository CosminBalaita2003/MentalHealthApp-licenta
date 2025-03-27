namespace MentalHealthApp.Models
{
    public class Exercise
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int CategoryId { get; set; }

        public Category? Category { get; set; }

        public int Duration { get; set; } 

        public string InteractionType { get; set; } = string.Empty;

        public string? MediaUrl { get; set; }

        public string? StepsJson { get; set; }
    }
}
