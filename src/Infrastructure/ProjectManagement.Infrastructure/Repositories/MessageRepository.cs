using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Core.Interfaces;
using ProjectManagement.Core.Models;
using ProjectManagement.Infrastructure.Persistence;

namespace ProjectManagement.Infrastructure.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext _db;
        public MessageRepository(AppDbContext db) => _db = db;

        public async Task AddAsync(Message message)
        {
            await _db.Messages.AddAsync(message);
            await _db.SaveChangesAsync();
        }

        public async Task<Message?> GetByIdAsync(int id) => await _db.Messages.FindAsync(id);

        public async Task<IEnumerable<Message>> ListByProjectAsync(int projectId) => await _db.Messages.Where(m => m.ProjectId == projectId).ToListAsync();

        public async Task<IEnumerable<Message>> ListDirectMessagesAsync(int userA, int userB)
        {
            return await _db.Messages.Where(m => (m.SenderId == userA && m.ReceiverId == userB) || (m.SenderId == userB && m.ReceiverId == userA)).ToListAsync();
        }

        public async Task UpdateAsync(Message message)
        {
            _db.Messages.Update(message);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Message message)
        {
            _db.Messages.Remove(message);
            await _db.SaveChangesAsync();
        }
    }
}
