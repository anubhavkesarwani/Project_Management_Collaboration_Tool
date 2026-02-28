using Microsoft.AspNetCore.Mvc;
using ProjectManagement.Core.Interfaces;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectRepository _projects;
        public ProjectsController(IProjectRepository projects) => _projects = projects;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _projects.ListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var p = await _projects.GetByIdAsync(id);
            return p == null ? NotFound() : Ok(p);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Project project)
        {
            await _projects.AddAsync(project);
            return CreatedAtAction(nameof(Get), new { id = project.Id }, new { id = project.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Project project)
        {
            var existing = await _projects.GetByIdAsync(id);
            if (existing == null) return NotFound();
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (existing.OwnerId != userId) return Forbid();
            existing.Name = project.Name;
            existing.Description = project.Description;
            await _projects.UpdateAsync(existing);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _projects.GetByIdAsync(id);
            if (existing == null) return NotFound();
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (existing.OwnerId != userId) return Forbid();
            await _projects.DeleteAsync(existing);
            return NoContent();
        }
    }
}
