using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Core.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> ListByUserAsync(int userId);
        Task AddAsync(Notification notification);
        Task UpdateAsync(Notification notification);
        Task DeleteAsync(Notification notification);
    }
}
