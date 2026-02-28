import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { Project } from '../../core/models/project.model';
import { Task } from '../../core/models/task.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule],
    template: `
    <div class="dashboard fade-in">
      <div class="page-header">
        <div>
          <h2>Good {{getTimeOfDay()}}, {{firstName()}} 👋</h2>
          <div class="page-subtitle">Here's what's happening across your workspace</div>
        </div>
        <button mat-raised-button color="primary" routerLink="/projects">
          <mat-icon>add</mat-icon> New Project
        </button>
      </div>

      <!-- Stats Row -->
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats; let i = index"
             [style.animation-delay]="(i * 0.08) + 's'">
          <div class="stat-icon" [style.background]="stat.gradient">
            <mat-icon>{{stat.icon}}</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{stat.value}}</div>
            <div class="stat-label">{{stat.label}}</div>
          </div>
          <div class="stat-trend" [class.up]="stat.trend > 0">
            <mat-icon>{{stat.trend > 0 ? 'trending_up' : 'trending_down'}}</mat-icon>
            <span>{{Math.abs(stat.trend)}}%</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- My Tasks -->
        <div class="dashboard-section">
          <div class="section-header">
            <h3><mat-icon>task_alt</mat-icon> My Tasks</h3>
            <a routerLink="/projects" class="view-all">View all</a>
          </div>
          <div class="task-list">
            <div *ngIf="myTasks().length === 0" class="empty-state-sm">
              <mat-icon>check_circle</mat-icon>
              <span>No tasks assigned to you</span>
            </div>
            <div class="task-item" *ngFor="let task of myTasks().slice(0, 5)">
              <div class="task-status-dot" [class]="'dot-' + task.status"></div>
              <div class="task-meta">
                <span class="task-title">{{task.title}}</span>
                <span class="task-project">{{task.projectId}}</span>
              </div>
              <span class="badge" [class]="'badge-' + task.priority">{{task.priority}}</span>
            </div>
            <div class="skeleton-item" *ngFor="let s of [1,2,3]" [class.hidden]="myTasks().length > 0 || !loading()"></div>
          </div>
        </div>

        <!-- Recent Projects -->
        <div class="dashboard-section">
          <div class="section-header">
            <h3><mat-icon>folder_open</mat-icon> Recent Projects</h3>
            <a routerLink="/projects" class="view-all">View all</a>
          </div>
          <div class="project-list">
            <div *ngIf="projects().length === 0 && !loading()" class="empty-state-sm">
              <mat-icon>folder</mat-icon>
              <span>No projects yet</span>
            </div>
            <div class="project-item hover-card" *ngFor="let p of projects().slice(0, 4)"
                 [routerLink]="['/projects', p.id]">
              <div class="project-color" [style.background]="p.color || 'linear-gradient(135deg,#58a6ff,#7c5cfc)'"></div>
              <div class="project-info">
                <span class="project-name">{{p.name}}</span>
                <span class="project-members">{{p.members.length || 0}} members</span>
              </div>
              <div class="project-progress">
                <span class="progress-text">{{getProgress(p)}}%</span>
                <mat-progress-bar mode="determinate" [value]="getProgress(p)"></mat-progress-bar>
              </div>
              <span class="badge" [class]="'badge-' + p.status">{{p.status}}</span>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="dashboard-section activity-section">
          <div class="section-header">
            <h3><mat-icon>bolt</mat-icon> Activity Feed</h3>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let a of activities">
              <div class="activity-icon" [style.background]="a.color">
                <mat-icon>{{a.icon}}</mat-icon>
              </div>
              <div class="activity-meta">
                <span class="activity-text" [innerHTML]="a.text"></span>
                <span class="activity-time">{{a.time}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dashboard { max-width: 1400px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      animation: fadeIn 0.4s ease both;
      transition: border-color var(--transition), transform var(--transition);

      &:hover { border-color: var(--accent-blue); transform: translateY(-2px); }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { color: white; font-size: 22px; width: 22px; height: 22px; }
    }

    .stat-info {
      flex: 1;
      .stat-value { font-size: 26px; font-weight: 800; color: var(--text-primary); line-height: 1; }
      .stat-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      color: var(--accent-red);
      &.up { color: var(--accent-green); }
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 20px;

      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }

    .activity-section { grid-column: 1 / -1; }

    .dashboard-section {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 20px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        color: var(--text-primary);
        mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--accent-blue); }
      }

      .view-all { color: var(--accent-blue); font-size: 12px; text-decoration: none; &:hover { text-decoration: underline; } }
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-color);
      &:last-child { border-bottom: none; }
    }

    .task-status-dot {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
      &.dot-todo { background: var(--accent-blue); }
      &.dot-in-progress { background: var(--accent-amber); }
      &.dot-done { background: var(--accent-green); }
    }

    .task-meta { flex: 1; overflow: hidden; }
    .task-title { display: block; font-size: 13px; color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .task-project { display: block; font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    .project-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      margin-bottom: 8px;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .project-color { width: 4px; height: 40px; border-radius: 2px; flex-shrink: 0; }
    .project-info { flex: 1; }
    .project-name { display: block; font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .project-members { display: block; font-size: 11px; color: var(--text-muted); }
    .project-progress { width: 100px; .progress-text { display: block; font-size: 11px; color: var(--text-muted); text-align: right; margin-bottom: 4px; } }

    .activity-list { display: flex; flex-direction: column; gap: 0; }
    .activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-color); &:last-child { border-bottom: none; } }
    .activity-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; mat-icon { color: white; font-size: 16px; width: 16px; height: 16px; } }
    .activity-meta { flex: 1; }
    .activity-text { display: block; font-size: 13px; color: var(--text-primary); line-height: 1.5; }
    .activity-time { display: block; font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    .empty-state-sm { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); mat-icon { font-size: 36px; width: 36px; height: 36px; opacity: 0.4; } span { font-size: 13px; } }

    .skeleton-item { height: 44px; background: var(--bg-tertiary); border-radius: 6px; margin-bottom: 8px; animation: pulse 1.5s infinite; &.hidden { display: none; } }
  `]
})
export class DashboardComponent implements OnInit {
    projects = signal<Project[]>([]);
    myTasks = signal<Task[]>([]);
    loading = signal(true);
    Math = Math;

    stats = [
        { icon: 'folder_open', label: 'Active Projects', value: '8', trend: 12, gradient: 'linear-gradient(135deg,#58a6ff,#1f6feb)' },
        { icon: 'task_alt', label: 'Open Tasks', value: '24', trend: -5, gradient: 'linear-gradient(135deg,#7c5cfc,#a87bff)' },
        { icon: 'check_circle', label: 'Completed', value: '137', trend: 18, gradient: 'linear-gradient(135deg,#3fb950,#238636)' },
        { icon: 'chat_bubble', label: 'Messages', value: '12', trend: 8, gradient: 'linear-gradient(135deg,#d29922,#bb8009)' },
    ];

    activities = [
        { icon: 'task_alt', color: 'rgba(63,185,80,0.8)', text: '<strong>Alice Chen</strong> completed task <em>Design landing page</em>', time: '2 min ago' },
        { icon: 'person_add', color: 'rgba(88,166,255,0.8)', text: '<strong>Bob Singh</strong> was added to <em>Mobile App Redesign</em>', time: '45 min ago' },
        { icon: 'comment', color: 'rgba(124,92,252,0.8)', text: '<strong>Carol Liu</strong> commented on <em>API Integration task</em>', time: '1h ago' },
        { icon: 'assignment', color: 'rgba(210,153,34,0.8)', text: '<strong>You</strong> created task <em>Set up CI/CD pipeline</em>', time: '3h ago' },
        { icon: 'folder_open', color: 'rgba(57,210,183,0.8)', text: '<strong>David Park</strong> created project <em>Analytics Dashboard</em>', time: 'Yesterday' },
    ];

    constructor(
        public authService: AuthService,
        private projectService: ProjectService,
        private taskService: TaskService
    ) { }

    ngOnInit(): void {
        this.projectService.getProjects().subscribe({
            next: (projects) => { this.projects.set(projects); this.loading.set(false); },
            error: () => this.loading.set(false)
        });
        this.taskService.getMyTasks().subscribe({
            next: (tasks) => this.myTasks.set(tasks),
            error: () => { }
        });
    }

    firstName(): string {
        const full = this.authService.currentUser()?.fullName || 'there';
        return full.split(' ')[0];
    }

    getTimeOfDay(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    }

    getProgress(p: Project): number {
        if (!p.taskCount || p.taskCount === 0) return 0;
        return Math.round((p.completedTaskCount / p.taskCount) * 100);
    }
}
