using Microsoft.AspNetCore.Mvc;
using ProjectManagement.Core.Interfaces;
using ProjectManagement.Core.Models;
using ProjectManagement.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace ProjectManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _tasks;
        private readonly IHubContext<CollaborationHub> _hub;

        public TasksController(ITaskRepository tasks, IHubContext<CollaborationHub> hub)
        {
            _tasks = tasks;
            _hub = hub;
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId) => Ok(await _tasks.ListByProjectAsync(projectId));

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var t = await _tasks.GetByIdAsync(id);
            return t == null ? NotFound() : Ok(t);
        }

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Create([FromBody] TaskItem task)
        {
            await _tasks.AddAsync(task);
            if (task.ProjectId != 0)
            {
                await _hub.Clients.Group($"project-{task.ProjectId}").SendAsync("TaskCreated", task);
            }
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] TaskItem task)
        {
            var existing = await _tasks.GetByIdAsync(id);
            if (existing == null) return NotFound();
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            // allow assignee or project owner to modify
            if (existing.AssigneeId != userId && existing.Project?.OwnerId != userId) return Forbid();
            existing.Title = task.Title;
            existing.Description = task.Description;
            existing.Status = task.Status;
            existing.AssigneeId = task.AssigneeId;
            await _tasks.UpdateAsync(existing);
            if (existing.ProjectId != 0)
                await _hub.Clients.Group($"project-{existing.ProjectId}").SendAsync("TaskUpdated", existing);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _tasks.GetByIdAsync(id);
            if (existing == null) return NotFound();
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (existing.AssigneeId != userId && existing.Project?.OwnerId != userId) return Forbid();
            await _tasks.DeleteAsync(existing);
            if (existing.ProjectId != 0)
                await _hub.Clients.Group($"project-{existing.ProjectId}").SendAsync("TaskDeleted", existing);
            return NoContent();
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var t = await _tasks.GetByIdAsync(id);
            if (t == null) return NotFound();
            t.Status = status;
            await _tasks.UpdateAsync(t);
            if (t.ProjectId != 0)
                await _hub.Clients.Group($"project-{t.ProjectId}").SendAsync("TaskUpdated", t);
            return NoContent();
        }
    }
}
