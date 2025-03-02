using System.ComponentModel.DataAnnotations;

namespace MentalHealthApp.Models
{
    public class City
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        public string Name { get; set; } 

        public string NameAscii { get; set; } 

        [Required]
        public string Country { get; set; } 

        public string Iso2 { get; set; } 
        public string Iso3 { get; set; } 

        public string Admin1 { get; set; } 
        public string Capital { get; set; } 
        [Required]
        public double Lat { get; set; }
        [Required]
        public double Lon { get; set; } 

        public int Pop{ get; set; }
    }
}
