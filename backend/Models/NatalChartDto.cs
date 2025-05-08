namespace MentalHealthApp.Models
{
    public class NatalChartDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string ChartSvg { get; set; }
        public string PlanetsJson { get; set; }
        public string HousesJson { get; set; }
        public DateTime CreatedAt { get; set; }
    }


    // DTO pentru o planetă simplificată
    public class SimplifiedPlanet
    {
        public string planet { get; set; }
        public string zodiac_sign { get; set; }
        public string isRetro { get; set; }
    }

    // DTO pentru o casă astrologică simplificată
    public class SimplifiedHouse
    {
        public int house { get; set; }
        public string zodiac_sign { get; set; }
    }
}
