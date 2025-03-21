using MentalHealthApp.Data;
using MentalHealthApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmotionController : Controller
    {
        private readonly ApplicationDbContext _context;
        public EmotionController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public IActionResult GetAllEmotions()
        {
            var emotions = _context.Emotions.ToList();

            foreach (var emotion in emotions)
            {
                emotion.ImagePath = $"{Request.Scheme}://{Request.Host}/images/{emotion.Name}.png";
            }

            return Ok(emotions);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Emotion>> GetEmotion(int id)
        {
            var emotion = await _context.Emotions.FindAsync(id);
            if (emotion == null)
            {
                return NotFound();
            }
            return emotion;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Emotion>> PostEmotion(Emotion emotion)
        {
            _context.Emotions.Add(emotion);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetEmotion", new { id = emotion.Id }, emotion);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutEmotion(int id, Emotion emotion)
        {
            if (id != emotion.Id)
            {
                return BadRequest();
            }
            _context.Entry(emotion).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmotion(int id)
        {
            var emotion = await _context.Emotions.FindAsync(id);
            if (emotion == null)
            {
                return NotFound();
            }
            _context.Emotions.Remove(emotion);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        
    }
}
