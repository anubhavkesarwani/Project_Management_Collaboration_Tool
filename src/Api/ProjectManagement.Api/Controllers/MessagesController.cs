using Microsoft.AspNetCore.Mvc;
using ProjectManagement.Core.Interfaces;
using ProjectManagement.Core.Models;
using ProjectManagement.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace ProjectManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageRepository _messages;
        private readonly IHubContext<CollaborationHub> _hub;

        public MessagesController(IMessageRepository messages, IHubContext<CollaborationHub> hub)
        {
            _messages = messages;
            _hub = hub;
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId) => Ok(await _messages.ListByProjectAsync(projectId));

        [HttpGet("dm/{userA}/{userB}")]
        public async Task<IActionResult> GetDirect(int userA, int userB) => Ok(await _messages.ListDirectMessagesAsync(userA, userB));

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Send([FromBody] Message message)
        {
            await _messages.AddAsync(message);

            if (message.ProjectId.HasValue)
            {
                await _hub.Clients.Group($"project-{message.ProjectId.Value}").SendAsync("ReceiveMessage", new { message.SenderId, message.ProjectId, message.ReceiverId, message.ParentId, message.Content });
            }
            else if (message.ReceiverId.HasValue)
            {
                await _hub.Clients.User(message.ReceiverId.Value.ToString()).SendAsync("ReceiveMessage", new { message.SenderId, message.ProjectId, message.ReceiverId, message.ParentId, message.Content });
            }

            return CreatedAtAction(nameof(GetByProject), new { projectId = message.ProjectId }, message);
        }

        [HttpPut("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] Message message)
        {
            var existing = await _messages.GetByIdAsync(id);
            if (existing == null) return NotFound();
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (existing.SenderId != userId) return Forbid();
            existing.Content = message.Content;
            await _messages.UpdateAsync(existing);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _messages.GetByIdAsync(id);
            if (existing == null) return NotFound();
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (existing.SenderId != userId) return Forbid();
            await _messages.DeleteAsync(existing);
            return NoContent();
        }
    }
}
