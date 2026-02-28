using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Core.Interfaces;
using ProjectManagement.Core.Models;
using ProjectManagement.Infrastructure.Persistence;

namespace ProjectManagement.Infrastructure.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly AppDbContext _db;
        public TaskRepository(AppDbContext db) => _db = db;

        public async Task AddAsync(TaskItem task)
        {
            await _db.Tasks.AddAsync(task);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(TaskItem task)
        {
            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();
        }

        public async Task<TaskItem?> GetByIdAsync(int id) => await _db.Tasks.FindAsync(id);

        public async Task<IEnumerable<TaskItem>> ListByProjectAsync(int projectId) => await _db.Tasks.Where(t => t.ProjectId == projectId).ToListAsync();

        public async Task UpdateAsync(TaskItem task)
        {
            _db.Tasks.Update(task);
            await _db.SaveChangesAsync();
        }
    }
}
