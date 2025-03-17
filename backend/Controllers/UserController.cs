using MentalHealthApp.Data;
using MentalHealthApp.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public UserController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Verificăm dacă datele primite sunt valide
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { success = false, message = "Datele de înregistrare sunt incomplete." });
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                DateOfBirth = request.DateOfBirth,
                TimeOfBirth = TimeSpan.TryParse(request.TimeOfBirth, out var time) ? time : TimeSpan.Zero,
                CityId = request.CityId,
                Gender = request.Gender,
                Pronouns = request.Pronouns,
                Bio = request.Bio,
                CreatedAt = DateTime.Now
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Eroare la înregistrare.",
                    errors = result.Errors.Select(e => e.Description)
                });
            }

            await _userManager.AddToRoleAsync(user, "User");

            // Returnăm utilizatorul creat, dar fără câmpuri sensibile (ex. parole)
            return Ok(new
            {
                success = true,
                message = "User registered successfully",
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    dateOfBirth = user.DateOfBirth,
                    timeOfBirth = user.TimeOfBirth.ToString(@"hh\:mm\:ss"),
                    cityId = user.CityId,
                    gender = user.Gender,
                    pronouns = user.Pronouns,
                    bio = user.Bio
                }
            });
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !(await _userManager.CheckPasswordAsync(user, request.Password)))
            {
                return Unauthorized(new { Message = "Invalid email or password" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = Encoding.ASCII.GetBytes("cheie-secreta-super-sigura");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.Users.Include(u => u.City).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.DateOfBirth,
                user.TimeOfBirth,
                user.CityId,
                CityName = user.City?.Name,
                user.Gender,
                user.Pronouns,
                user.Bio,
                user.CreatedAt,
                Roles = await _userManager.GetRolesAsync(user)
            });
        }

        [HttpDelete("{userId}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var currentUserId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (currentUserId != userId && !isAdmin)
                return Forbid();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
                return Ok(new { message = "User deleted successfully" });

            return BadRequest("Failed to delete user");
        }

        [HttpPut("edit")]
        [Authorize]
        public async Task<IActionResult> EditUser([FromBody] EditUserRequest request)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");
            //to string to avoid error
            user.FullName = request.FullName.ToString();
            user.DateOfBirth = request.DateOfBirth;
            user.TimeOfBirth = user.TimeOfBirth = TimeSpan.Parse(request.TimeOfBirth);
            user.CityId = request.CityId;
            user.Bio = request.Bio;
            user.Gender = request.Gender;
            user.Pronouns = request.Pronouns;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "User updated successfully" });
        }
    }

    public class RegisterRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string TimeOfBirth { get; set; }
        public int CityId { get; set; }
        public string Gender { get; set; }
        public string Pronouns { get; set; }
        public string Bio { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class EditUserRequest
    {
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string TimeOfBirth { get; set; }
        public int CityId { get; set; }
        public string Bio { get; set; }
        public string Gender { get; set; }
        public string Pronouns { get; set; }
    }
}