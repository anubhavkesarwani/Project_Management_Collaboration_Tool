using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Api.Hubs;
using ProjectManagement.Infrastructure.Persistence;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Api.Services
{
    public class TaskService
    {
        private readonly AppDbContext _db;
        private readonly IHubContext<CollaborationHub> _hub;

        public TaskService(AppDbContext db, IHubContext<CollaborationHub> hub)
        {
            _db = db;
            _hub = hub;
        }

        public async Task UpdateTaskStatusAsync(int taskId, string status)
        {
            var task = await _db.Tasks.FindAsync(taskId);
            if (task == null) return;
            task.Status = status;
            await _db.SaveChangesAsync();

            if (task.ProjectId != 0)
            {
                await _hub.Clients.Group($"project-{task.ProjectId}").SendAsync("TaskUpdated", new { task.Id, task.Title, task.Status, task.AssigneeId });
            }
            else if (task.AssigneeId.HasValue)
            {
                var userId = task.AssigneeId.Value;
                // Push a notification to the user if connected
                // For MVP, rely on CollaborationHub's user registration mapping
                await _hub.Clients.User(userId.ToString()).SendAsync("TaskUpdated", new { task.Id, task.Title, task.Status });
            }
        }
    }
}
