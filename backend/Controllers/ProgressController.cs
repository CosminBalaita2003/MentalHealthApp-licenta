using MentalHealthApp.Data;
using MentalHealthApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace MentalHealthApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ProgressController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Progress>>> GetProgresses()
        {
            return await _context.Progresses.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Progress>> GetProgress(int id)
        {
            var progress = await _context.Progresses.FindAsync(id);
            if (progress == null)
            {
                return NotFound();
            }
            return progress;
        }

        [HttpPost]
        [Authorize (Roles = "Admin")]
        public async Task<ActionResult<Progress>> PostProgress(Progress progress)
        {
            if (!_context.Users.Any(u => u.Id == progress.UserId))
            {
                return BadRequest("User does not exist");
            }
            if (!_context.Exercises.Any(e => e.Id == progress.ExerciseId))
            {
                return BadRequest("Exercise does not exist");
            }
            _context.Progresses.Add(progress);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetProgress", new { id = progress.Id }, progress);
        }

        [HttpDelete("{id}")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> DeleteProgress(int id)
        {
            var progress = await _context.Progresses.FindAsync(id);
            if (progress == null)
            {
                return NotFound();
            }
            _context.Progresses.Remove(progress);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
