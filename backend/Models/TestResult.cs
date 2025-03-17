using MentalHealthApp.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TestResult
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
        [Required]
        public DateTime TestDate { get; set; } = DateTime.UtcNow;
        [Required]
        [MaxLength(50)]
        public string TestType { get; set; } // Ex: "GAD-7", "PHQ-9"

        [Required]
        public int Score { get; set; }

        [Required]
        [MaxLength(255)]
        public string Interpretation { get; set; }

        public string Recommendations { get; set; }
    }
}
