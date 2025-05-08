using MentalHealthApp.Models;

namespace backend.Models
{
    public class NatalChart
    {
        public int Id { get; set; }

        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public string ChartSvg { get; set; }

        public string PlanetsJson { get; set; }

        public string HousesJson { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
