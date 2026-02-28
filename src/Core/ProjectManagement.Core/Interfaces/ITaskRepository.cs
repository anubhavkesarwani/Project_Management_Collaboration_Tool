using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Core.Interfaces
{
    public interface ITaskRepository
    {
        Task<TaskItem?> GetByIdAsync(int id);
        Task<IEnumerable<TaskItem>> ListByProjectAsync(int projectId);
        Task AddAsync(TaskItem task);
        Task UpdateAsync(TaskItem task);
        Task DeleteAsync(TaskItem task);
    }
}
