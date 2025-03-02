using MentalHealthApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MentalHealthApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Dictionary<string, string> model)
        {
            if (!model.ContainsKey("fullName") || !model.ContainsKey("email") || !model.ContainsKey("password"))
                return BadRequest("Missing required fields: fullName, email, password");

            var user = new ApplicationUser
            {
                UserName = model["email"],
                Email = model["email"],
                FullName = model["fullName"]
            };

            var result = await _userManager.CreateAsync(user, model["password"]);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
                return Ok(new { message = "User created successfully!" });
            }

            return BadRequest(result.Errors);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _userManager.Users
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    Roles = _userManager.GetRolesAsync(u).Result
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<object>> GetCurrentUser()
        {
            var userId = _userManager.GetUserId(User);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new { user.Id, user.FullName, user.Email, Roles = roles });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<object>> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new { user.Id, user.FullName, user.Email, Roles = roles });
        }

        [HttpPost("assign-admin/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignAdminRole(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            if (!await _roleManager.RoleExistsAsync("Admin"))
                return BadRequest("Admin role does not exist");

            await _userManager.AddToRoleAsync(user, "Admin");
            return Ok(new { message = $"User {user.Email} is now an Admin" });
        }

        [HttpPost("remove-admin/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveAdminRole(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var adminCount = await _userManager.GetUsersInRoleAsync("Admin");
            if (adminCount.Count <= 1)
                return BadRequest("Cannot remove the last admin!");

            await _userManager.RemoveFromRoleAsync(user, "Admin");
            return Ok(new { message = $"User {user.Email} is no longer an Admin" });
        }

        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            var adminCount = await _userManager.GetUsersInRoleAsync("Admin");
            if (isAdmin && adminCount.Count <= 1)
                return BadRequest("Cannot delete the last admin!");

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
                return Ok(new { message = "User deleted successfully" });

            return BadRequest("Failed to delete user");
        }

    }
}
