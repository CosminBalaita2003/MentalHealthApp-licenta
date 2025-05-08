using backend.Models;
using MentalHealthApp.Data;
using MentalHealthApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Claims;

namespace MentalHealthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NatalChartController : Controller
    {
        private readonly ApplicationDbContext _context;

        public NatalChartController(ApplicationDbContext context)
        {
            _context = context;
        }

        //// GET chart for current user
        //[HttpGet]
        //public async Task<ActionResult> GetUserChart()
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //    var chart = await _context.NatalCharts
        //        .AsNoTracking()
        //        .FirstOrDefaultAsync(c => c.UserId == userId);

        //    if (chart == null)
        //        return NotFound();

        //    try
        //    {
        //        var planets = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(chart.PlanetsJson);
        //        var houses = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(chart.HousesJson);

        //        Console.WriteLine("✅ Planets loaded: " + planets.Count);
        //        Console.WriteLine("✅ Houses loaded: " + houses.Count);

        //        return Ok(new
        //        {
        //            chart.ChartSvg,
        //            planets,
        //            houses
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine("❌ Error deserializing natal chart data: " + ex.Message);
        //        return BadRequest("Error parsing saved natal chart.");
        //    }
        //}

        // GET chart for current user
        [HttpGet]
        public async Task<ActionResult<NatalChart>> GetUserChart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var chart = await _context.NatalCharts
                .AsNoTracking()
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (chart == null)
                return NotFound();

            return Ok(chart);
        }




        [HttpPost]
        public async Task<ActionResult<NatalChart>> PostNatalChart([FromBody] NatalChartDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var existingChart = await _context.NatalCharts.FirstOrDefaultAsync(c => c.UserId == userId);
            if (existingChart != null)
            {
                // 🔄 Update chart
                existingChart.ChartSvg = dto.ChartSvg;
                existingChart.PlanetsJson = dto.PlanetsJson;
                existingChart.HousesJson = dto.HousesJson;
                existingChart.CreatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(existingChart);
            }

            // ➕ Create new chart
            var chart = new NatalChart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                ChartSvg = dto.ChartSvg,
                PlanetsJson = dto.PlanetsJson,
                HousesJson = dto.HousesJson
            };

            _context.NatalCharts.Add(chart);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserChart), new { }, chart);
        }


        // DELETE chart for current user
        [HttpDelete]
        public async Task<IActionResult> DeleteChart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var chart = await _context.NatalCharts.FirstOrDefaultAsync(c => c.UserId == userId);

            if (chart == null)
                return NotFound();

            _context.NatalCharts.Remove(chart);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
