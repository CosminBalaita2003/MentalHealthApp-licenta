using MentalHealthApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TimeZoneConverter; // ✅ Asigură-te că ai acest using

[ApiController]
[Route("api/detected-emotion")]
public class DetectedEmotionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DetectedEmotionController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/detected-emotion/save
    [HttpPost("save")]
    public async Task<IActionResult> SaveEmotion([FromBody] DetectedEmotion emotion)
    {
        if (string.IsNullOrWhiteSpace(emotion.EmotionName) ||
            string.IsNullOrWhiteSpace(emotion.UserId))
        {
            return BadRequest("EmotionName and UserId are required.");
        }

        // ✅ Convertim ora din UTC în Europe/Bucharest dacă este trimisă
        if (emotion.Timestamp != default)
        {
            var timeZone = TZConvert.GetTimeZoneInfo("Europe/Bucharest");
            emotion.Timestamp = TimeZoneInfo.ConvertTimeFromUtc(emotion.Timestamp, timeZone);
        }
        else
        {
            emotion.Timestamp = TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.UtcNow,
                TZConvert.GetTimeZoneInfo("Europe/Bucharest")
            );
        }

        _context.DetectedEmotions.Add(emotion);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Emotion saved." });
    }

    // GET: api/detected-emotion/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetEmotionsByUser(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return BadRequest("UserId is required.");
        }

        var emotions = await _context.DetectedEmotions
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.Timestamp)
            .ToListAsync();

        return Ok(emotions);
    }
}
