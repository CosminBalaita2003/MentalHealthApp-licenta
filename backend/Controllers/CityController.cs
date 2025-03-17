using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MentalHealthApp.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MentalHealthApp.Data;

namespace MentalHealthApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CityController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<City>>> GetCities()
        {
            return await _context.Cities.ToListAsync();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchCities([FromQuery] string name = null)
        {
            if (string.IsNullOrEmpty(name))
                return BadRequest("City name is required for search.");

            var query = _context.Cities
                .Where(c => EF.Functions.Like(c.Name, $"{name}%")) // 🔹 Căutare case-insensitive
                .Select(c => new { c.Id, c.Name, c.Country }) // 🔹 Returnăm doar datele necesare
                .Take(10); // 🔹 Limităm rezultatele pentru performanță

            var results = await query.ToListAsync();

            if (!results.Any())
                return NotFound("No cities found with the given name.");

            return new JsonResult(results) { ContentType = "application/json" };
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<City>> GetCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);

            if (city == null)
                return NotFound();

            return city;
        }   
    }
}
