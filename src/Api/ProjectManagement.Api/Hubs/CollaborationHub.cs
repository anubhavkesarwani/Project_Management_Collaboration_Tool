using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;

namespace ProjectManagement.Api.Hubs
{
    public class CollaborationHub : Hub
    {
        // Simple in-memory mapping of userId -> connectionIds for MVP
        private static readonly ConcurrentDictionary<int, ConcurrentDictionary<string, byte>> _userConnections = new();

        public Task RegisterUser(int userId)
        {
            var connections = _userConnections.GetOrAdd(userId, _ => new ConcurrentDictionary<string, byte>());
            connections[Context.ConnectionId] = 0;
            return Task.CompletedTask;
        }

        public Task UnregisterUser(int userId)
        {
            if (_userConnections.TryGetValue(userId, out var connections))
            {
                connections.TryRemove(Context.ConnectionId, out _);
            }
            return Task.CompletedTask;
        }

        public Task JoinProject(int projectId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, GetProjectGroup(projectId));
        }

        public Task LeaveProject(int projectId)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, GetProjectGroup(projectId));
        }

        public async Task SendMessage(MessageDto dto)
        {
            // Routing logic: ProjectId -> broadcast to group; ReceiverId -> direct push
            if (dto.ProjectId.HasValue)
            {
                await Clients.Group(GetProjectGroup(dto.ProjectId.Value)).SendAsync("ReceiveMessage", dto);
                return;
            }

            if (dto.ReceiverId.HasValue)
            {
                if (_userConnections.TryGetValue(dto.ReceiverId.Value, out var connections))
                {
                    var ids = connections.Keys.ToList();
                    await Clients.Clients(ids).SendAsync("ReceiveMessage", dto);
                }
                return;
            }
        }

        private static string GetProjectGroup(int projectId) => $"project-{projectId}";

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            // Best-effort: remove connection from any user mapping
            foreach (var kv in _userConnections)
            {
                kv.Value.TryRemove(Context.ConnectionId, out _);
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}
