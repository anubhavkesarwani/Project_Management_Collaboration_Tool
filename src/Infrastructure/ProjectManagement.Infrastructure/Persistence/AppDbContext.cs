using Microsoft.EntityFrameworkCore;
using ProjectManagement.Core.Models;

namespace ProjectManagement.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Project> Projects => Set<Project>();
        public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
        public DbSet<TaskItem> Tasks => Set<TaskItem>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<Notification> Notifications => Set<Notification>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProjectMember>()
                .HasIndex(pm => new { pm.ProjectId, pm.UserId })
                .IsUnique();

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Parent)
                .WithMany(m => m.Replies)
                .HasForeignKey(m => m.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasIndex(m => m.ProjectId);

            modelBuilder.Entity<Message>()
                .HasIndex(m => m.ReceiverId);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Owner)
                .WithMany();

            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Assignee)
                .WithMany();
        }
    }
}
