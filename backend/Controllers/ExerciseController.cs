using Microsoft.AspNetCore.Mvc;
using MentalHealthApp.Data;
using MentalHealthApp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


namespace MentalHealthApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ExerciseController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exercise>>> GetExercises()
        {
            return await _context.Exercises.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Exercise>> GetExercise(int id)
        {
            var exercise = await _context.Exercises.Include(e => e.Category).FirstOrDefaultAsync(e => e.Id == id);
            if (exercise == null)
            {
                return NotFound();
            }
            return exercise;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Exercise>> PostExercise(Exercise exercise)
        {
            if (!_context.Categories.Any(c => c.Id == exercise.CategoryId))
            {
                return BadRequest("Category does not exist");
            }
            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetExercise", new { id = exercise.Id }, exercise);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutExercise(int id, Exercise exercise)
        {
            if (id != exercise.Id)
            {
                return BadRequest();
            }
            if (!_context.Categories.Any(c => c.Id == exercise.CategoryId))
            {
                return BadRequest("Category does not exist");
            }
            _context.Entry(exercise).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
            {
                return NotFound();
            }
            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();
            return NoContent();
        }



    }
}
