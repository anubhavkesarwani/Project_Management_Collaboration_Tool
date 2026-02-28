using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ProjectManagement.Core.Interfaces;

namespace ProjectManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly IConfiguration _config;

        public AuthController(IUserRepository users, IConfiguration config)
        {
            _users = users;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var u = await _users.GetByUsernameAsync(req.Username);
            if (u == null) return Unauthorized();
            // verify hashed password
            var isValid = BCrypt.Net.BCrypt.Verify(req.Password ?? string.Empty, u.PasswordHash ?? string.Empty);
            if (!isValid) return Unauthorized();

            var key = _config["Jwt:Key"] ?? "dev-secret-key-change-me";
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, u.Id.ToString()), new Claim(ClaimTypes.Name, u.Username) }),
                Expires = DateTime.UtcNow.AddHours(4),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { token = tokenHandler.WriteToken(token) });
        }

        public class LoginRequest { public string Username { get; set; } = ""; public string Password { get; set; } = ""; }
    }
}
