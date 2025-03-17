using backend.Models;
using MentalHealthApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/tests")]
    [ApiController]
    public class TestResultController : Controller
    {
        private readonly ApplicationDbContext _context;
        public TestResultController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SaveTest([FromBody] TestResult testResult)
        {
            if (testResult == null || string.IsNullOrEmpty(testResult.UserId))
                return BadRequest("Testul trebuie să aibă un utilizator asociat.");

            var user = await _context.Users.FindAsync(testResult.UserId);
            if (user == null)
                return NotFound("Utilizatorul nu există.");

            testResult.TestDate = DateTime.UtcNow;
            _context.TestResults.Add(testResult);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Test salvat cu succes!", testResult });
        }
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserTests(string userId)
        {
            var tests = await _context.TestResults
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.TestDate)
                .ToListAsync();

            if (tests.Count == 0)
                return NotFound("Niciun test găsit pentru acest utilizator.");

            return Ok(tests);
        }

    }
}
