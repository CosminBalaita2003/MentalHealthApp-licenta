using Microsoft.AspNetCore.Mvc;

namespace MentalHealthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MentalHealthController : Controller
    {
        
       
        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            return Ok(new { message = "Backend is running!" });
        }

       
    }
}
