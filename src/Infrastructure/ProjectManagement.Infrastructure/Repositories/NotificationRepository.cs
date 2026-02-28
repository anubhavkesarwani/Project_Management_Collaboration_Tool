using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Core.Interfaces;
using ProjectManagement.Core.Models;
using ProjectManagement.Infrastructure.Persistence;

namespace ProjectManagement.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _db;
        public NotificationRepository(AppDbContext db) => _db = db;

        public async Task AddAsync(Notification notification)
        {
            await _db.Notifications.AddAsync(notification);
            await _db.SaveChangesAsync();
        }

        public async Task<IEnumerable<Notification>> ListByUserAsync(int userId) => await _db.Notifications.Where(n => n.UserId == userId).ToListAsync();

        public async Task UpdateAsync(Notification notification)
        {
            _db.Notifications.Update(notification);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Notification notification)
        {
            _db.Notifications.Remove(notification);
            await _db.SaveChangesAsync();
        }
    }
}
