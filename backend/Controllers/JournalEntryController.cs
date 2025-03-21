using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Models;
using MentalHealthApp.Data;
using MentalHealthApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Necesită autentificare
    public class JournalEntryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JournalEntryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/JournalEntry
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JournalEntry>>> GetAllEntries()
        {
            return await _context.JournalEntries
                .Include(e => e.Emotion)
                .Include(e => e.User)
                .ToListAsync();
        }

        [HttpGet("UserEntries")]
        public async Task<ActionResult<IEnumerable<JournalEntry>>> GetUserEntries()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _context.JournalEntries
                .Where(e => e.UserId == userId)
                .Include(e => e.Emotion) 
                .ToListAsync();
        }


        // GET: api/JournalEntry/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<JournalEntry>> GetJournalEntry(int id)
        {
            var entry = await _context.JournalEntries
                .Include(e => e.Emotion)
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (entry == null)
            {
                return NotFound();
            }
            return entry;
        }

        // POST: api/JournalEntry
        [HttpPost("add")]
        public async Task<ActionResult<JournalEntry>> PostJournalEntry(JournalEntry entry)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            entry.UserId = userId;
            entry.Date = entry.Date == default ? DateTime.UtcNow : entry.Date; // Setează automat data dacă lipsește

            // Verifică dacă EmotionId există în baza de date
            var emotionExists = await _context.Emotions.AnyAsync(e => e.Id == entry.EmotionId);
            if (!emotionExists)
            {
                return BadRequest("Invalid EmotionId.");
            }

            // Asigură-te că nu este trimis un obiect User nou
            entry.User = null;

            _context.JournalEntries.Add(entry);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJournalEntry", new { id = entry.Id }, entry);
        }


        // PUT: api/JournalEntry/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJournalEntry(int id, JournalEntry entry)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (id != entry.Id)
            {
                return BadRequest();
            }

            var existingEntry = await _context.JournalEntries.FindAsync(id);
            if (existingEntry == null || existingEntry.UserId != userId)
            {
                return Unauthorized();
            }

            existingEntry.Content = entry.Content;
            existingEntry.EmotionId = entry.EmotionId;

            _context.Entry(existingEntry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.JournalEntries.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/JournalEntry/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJournalEntry(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var entry = await _context.JournalEntries.FindAsync(id);

            if (entry == null || entry.UserId != userId)
            {
                return Unauthorized();
            }

            _context.JournalEntries.Remove(entry);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
