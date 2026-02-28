using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Core.Interfaces
{
    public interface IProjectRepository
    {
        Task<Project?> GetByIdAsync(int id);
        Task<IEnumerable<Project>> ListAsync();
        Task AddAsync(Project project);
        Task UpdateAsync(Project project);
        Task DeleteAsync(Project project);
    }
}
