using Microsoft.AspNetCore.Mvc;
using ProjectManagement.Core.Interfaces;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _users;
        public UsersController(IUserRepository users) => _users = users;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _users.ListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var u = await _users.GetByIdAsync(id);
            return u == null ? NotFound() : Ok(u);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            // Hash password on create (API expects a plaintext password in PasswordHash field for now)
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash ?? string.Empty);
            await _users.AddAsync(user);
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] User user)
        {
            var existing = await _users.GetByIdAsync(id);
            if (existing == null) return NotFound();
            existing.Username = user.Username;
            existing.Email = user.Email;
            existing.PasswordHash = user.PasswordHash;
            await _users.UpdateAsync(existing);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _users.GetByIdAsync(id);
            if (existing == null) return NotFound();
            await _users.DeleteAsync(existing);
            return NoContent();
        }
    }
}
