using Microsoft.AspNetCore.Mvc;
using ProjectManagement.Core.Interfaces;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationRepository _notifications;
        public NotificationsController(INotificationRepository notifications) => _notifications = notifications;

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId) => Ok(await _notifications.ListByUserAsync(userId));

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Create([FromBody] Notification notification)
        {
            await _notifications.AddAsync(notification);
            return CreatedAtAction(nameof(GetByUser), new { userId = notification.UserId }, notification);
        }

        [HttpPut("{id}/read")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> MarkRead(int id)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var all = await _notifications.ListByUserAsync(userId);
            Notification? target = null;
            foreach (var n in all)
            {
                if (n.Id == id) { target = n; break; }
            }
            if (target == null) return NotFound();
            target.IsRead = true;
            await _notifications.UpdateAsync(target);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var all = await _notifications.ListByUserAsync(userId);
            Notification? target = null;
            foreach (var n in all)
            {
                if (n.Id == id) { target = n; break; }
            }
            if (target == null) return NotFound();
            if (target.UserId != userId) return Forbid();
            await _notifications.DeleteAsync(target);
            return NoContent();
        }
    }
}
