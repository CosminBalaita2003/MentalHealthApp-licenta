using MentalHealthApp.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class JournalEntry
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        public string Content { get; set; }

        [Required]
        public int EmotionId { get; set; }

        [ForeignKey("EmotionId")]
        public Emotion Emotion { get; set; }

        [Required]
        public string UserId { get; set; } // Legătură cu utilizatorul

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; } // Relația cu User
    }
}

