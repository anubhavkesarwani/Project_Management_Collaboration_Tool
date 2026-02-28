namespace ProjectManagement.Api.Hubs
{
    public class MessageDto
    {
        public int SenderId { get; set; }
        public int? ProjectId { get; set; }
        public int? ReceiverId { get; set; }
        public int? ParentId { get; set; }
        public string Content { get; set; } = null!;
    }
}
