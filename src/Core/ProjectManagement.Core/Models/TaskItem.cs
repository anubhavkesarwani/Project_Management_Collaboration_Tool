namespace ProjectManagement.Core.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Status { get; set; }
        public int ProjectId { get; set; }
        public Project? Project { get; set; }
        public int? AssigneeId { get; set; }
        public User? Assignee { get; set; }
    }
}
