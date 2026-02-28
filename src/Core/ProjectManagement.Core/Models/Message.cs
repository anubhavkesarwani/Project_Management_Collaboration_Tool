using System.Collections.Generic;

namespace ProjectManagement.Core.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public User? Sender { get; set; }
        public int? ProjectId { get; set; }
        public Project? Project { get; set; }
        public int? ReceiverId { get; set; }
        public User? Receiver { get; set; }
        public int? ParentId { get; set; }
        public Message? Parent { get; set; }
        public ICollection<Message> Replies { get; set; } = new List<Message>();
        public string Content { get; set; } = null!;
    }
}
