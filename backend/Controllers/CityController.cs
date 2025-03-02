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
        public async Task<ActionResult<IEnumerable<City>>> SearchCities(
            [FromQuery] string country = null,
            [FromQuery] string name = null)
        {
            var query = _context.Cities.AsQueryable();

            if (!string.IsNullOrEmpty(country))
                query = query.Where(c => c.Country == country);



            if (!string.IsNullOrEmpty(name))
                query = query.Where(c => c.Name.Contains(name));

            var results = await query.ToListAsync();

            if (!results.Any())
                return NotFound("No cities found with the given filters.");

            return Ok(results);
        }
    }
}
