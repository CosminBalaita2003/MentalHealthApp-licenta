using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MentalHealthApp.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using MentalHealthApp.Data;

namespace MentalHealthApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UserProfileController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = _userManager.GetUserId(User);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(up => up.UserId == userId);
            if (userProfile == null) return NotFound("User profile not found");

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                userProfile.DateOfBirth,
                userProfile.TimeOfBirth,
                userProfile.BirthLocation,
                userProfile.Gender,
                userProfile.Bio,
                userProfile.Age
            });
        }

        [HttpPut("update")]
        [Authorize]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UserProfile model)
        {
            var userId = _userManager.GetUserId(User);
            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(up => up.UserId == userId);

            if (userProfile == null)
                return NotFound("User profile not found");

            var cityExists = await _context.Cities.AnyAsync(c => c.Name == model.BirthLocation);
            if (!cityExists)
                return BadRequest("Invalid city");

            userProfile.DateOfBirth = model.DateOfBirth;
            userProfile.TimeOfBirth = model.TimeOfBirth;
            userProfile.BirthLocation = model.BirthLocation;
            userProfile.Gender = model.Gender;
            userProfile.Bio = model.Bio;

            _context.UserProfiles.Update(userProfile);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully" });
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .Include(u => _context.UserProfiles.Where(p => p.UserId == u.Id))
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    Profile = _context.UserProfiles.FirstOrDefault(p => p.UserId == u.Id)
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpDelete("delete/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var profile = await _context.UserProfiles.FirstOrDefaultAsync(up => up.UserId == userId);
            if (profile != null)
            {
                _context.UserProfiles.Remove(profile);
                await _context.SaveChangesAsync();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded) return BadRequest("Failed to delete user");

            return Ok(new { message = "User deleted successfully" });
        }
    }
}
