using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Core.Interfaces;
using ProjectManagement.Core.Models;
using ProjectManagement.Infrastructure.Persistence;

namespace ProjectManagement.Infrastructure.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly AppDbContext _db;
        public ProjectRepository(AppDbContext db) => _db = db;

        public async Task AddAsync(Project project)
        {
            await _db.Projects.AddAsync(project);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Project project)
        {
            _db.Projects.Remove(project);
            await _db.SaveChangesAsync();
        }

        public async Task<Project?> GetByIdAsync(int id) => await _db.Projects.Include(p => p.Members).FirstOrDefaultAsync(p => p.Id == id);

        public async Task<IEnumerable<Project>> ListAsync() => await _db.Projects.ToListAsync();

        public async Task UpdateAsync(Project project)
        {
            _db.Projects.Update(project);
            await _db.SaveChangesAsync();
        }
    }
}
