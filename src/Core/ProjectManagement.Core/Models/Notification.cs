namespace ProjectManagement.Core.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string Content { get; set; } = null!;
        public bool IsRead { get; set; }
        public string? Type { get; set; }
        public int? ReferenceId { get; set; }
    }
}
