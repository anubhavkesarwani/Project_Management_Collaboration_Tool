using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Core.Interfaces
{
    public interface IMessageRepository
    {
        Task<Message?> GetByIdAsync(int id);
        Task<IEnumerable<Message>> ListByProjectAsync(int projectId);
        Task<IEnumerable<Message>> ListDirectMessagesAsync(int userA, int userB);
        Task AddAsync(Message message);
        Task UpdateAsync(Message message);
        Task DeleteAsync(Message message);
    }
}
