using ProjectManagement.Infrastructure.Persistence;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Api.Services
{
    public class DataSeeder
    {
        private readonly AppDbContext _db;
        public DataSeeder(AppDbContext db) => _db = db;

        public async Task SeedAsync()
        {
            // quick no-op if data exists
            if (_db.Users.Any()) return;

            var u1 = new User { Username = "alice", Email = "alice@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"), CreatedAt = DateTime.UtcNow };
            var u2 = new User { Username = "bob", Email = "bob@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"), CreatedAt = DateTime.UtcNow };
            _db.Users.AddRange(u1, u2);

            var p = new Project { Name = "Proj1", Description = "Seeded project", Owner = u1 };
            _db.Projects.Add(p);

            var t = new TaskItem { Title = "T1", Description = "Seed task", Status = "Open", Project = p, Assignee = u1 };
            _db.Tasks.Add(t);

            var m = new Message { Sender = u1, Project = p, Content = "Hello project" };
            _db.Messages.Add(m);

            var n = new Notification { User = u1, Content = "Task assigned", IsRead = false, Type = "Task", ReferenceId = 1 };
            _db.Notifications.Add(n);

            await _db.SaveChangesAsync();
        }
    }
}
