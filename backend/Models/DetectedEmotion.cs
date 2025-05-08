using backend.Models;
using MentalHealthApp.Models;
using System.ComponentModel.DataAnnotations;

public class DetectedEmotion
{
    public int Id { get; set; }

    [Required]
    public string EmotionName { get; set; } = string.Empty;

    public string? Sentence { get; set; }

    public string? Source { get; set; } // doar informativ

    [Required]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [Required]
    public string UserId { get; set; }

    public ApplicationUser? User { get; set; }

    public int? JournalEntryId { get; set; }
    public JournalEntry? JournalEntry { get; set; }
}
