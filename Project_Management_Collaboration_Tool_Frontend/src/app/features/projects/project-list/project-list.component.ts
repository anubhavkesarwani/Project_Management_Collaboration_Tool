import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { ProjectFormDialogComponent } from '../project-form-dialog/project-form-dialog.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatProgressBarModule, MatMenuModule, MatTooltipModule
  ],
  template: `
    <div class="projects-page fade-in">
      <div class="page-header">
        <div>
          <h2>Projects</h2>
          <div class="page-subtitle">{{projects().length}} projects in your workspace</div>
        </div>
        <div class="header-actions">
          <button mat-stroked-button class="filter-btn">
            <mat-icon>filter_list</mat-icon> Filter
          </button>
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> New Project
          </button>
        </div>
      </div>

      <div class="filter-tabs mb-3">
        <button *ngFor="let f of filters" (click)="activeFilter.set(f.value)"
                [class.active]="activeFilter() === f.value" class="filter-tab">
          {{f.label}}
        </button>
      </div>

      <!-- Loading skeleton -->
      <div class="projects-grid" *ngIf="loading()">
        <div class="skeleton-card" *ngFor="let s of [1,2,3,4,5,6]"></div>
      </div>

      <!-- Projects Grid -->
      <div class="projects-grid" *ngIf="!loading()">
        <div *ngIf="filteredProjects().length === 0" class="empty-state">
          <mat-icon>folder_open</mat-icon>
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> Create Project
          </button>
        </div>

        <div class="project-card hover-card" *ngFor="let p of filteredProjects(); let i = index"
             [style.animation-delay]="(i * 0.06) + 's'" [style.--card-color]="getColor(p)">
          <div class="card-header">
            <div class="project-icon" [style.background]="p.color || 'linear-gradient(135deg,#58a6ff,#7c5cfc)'">
              <mat-icon>folder</mat-icon>
            </div>
            <div class="card-actions">
              <span class="badge" [class]="'badge-' + p.status">{{p.status}}</span>
              <button mat-icon-button [matMenuTriggerFor]="projectMenu" (click)="$event.stopPropagation()">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #projectMenu="matMenu">
                <button mat-menu-item [routerLink]="['/projects', p.id]"><mat-icon>open_in_new</mat-icon> Open</button>
                <button mat-menu-item (click)="openEditDialog(p)"><mat-icon>edit</mat-icon> Edit</button>
                <button mat-menu-item (click)="deleteProject(p.id)" class="danger-item"><mat-icon>delete</mat-icon> Delete</button>
              </mat-menu>
            </div>
          </div>

          <div class="card-body" [routerLink]="['/projects', p.id]">
            <h3 class="project-name">{{p.name}}</h3>
            <p class="project-desc">{{p.description || 'No description provided.'}}</p>

            <div class="progress-section">
              <div class="progress-header">
                <span>Progress</span>
                <span>{{getProgress(p)}}%</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="getProgress(p)" color="accent"></mat-progress-bar>
              <div class="task-counts">
                <span>{{p.completedTaskCount || 0}} / {{p.taskCount || 0}} tasks done</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="members-stack">
              <div class="member-avatar" *ngFor="let m of (p.members || []).slice(0, 4)"
                   [matTooltip]="m.fullName" [style.background]="getAvatarColor(m.id)">
                {{m.fullName[0]}}
              </div>
              <div class="member-avatar more" *ngIf="(p.members.length || 0) > 4">
                +{{(p.members.length || 0) - 4}}
              </div>
            </div>
            <div class="deadline" *ngIf="p.deadline">
              <mat-icon>schedule</mat-icon>
              <span>{{p.deadline | date:'MMM d'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-page { max-width: 1400px; }
    .header-actions { display: flex; gap: 12px; align-items: center; }
    .filter-tab { background: none; border: 1px solid var(--border-color); color: var(--text-secondary); padding: 6px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; transition: all 0.2s; margin-right: 6px; &:hover { border-color: var(--accent-blue); color: var(--accent-blue); } &.active { background: rgba(88,166,255,0.1); border-color: var(--accent-blue); color: var(--accent-blue); font-weight: 600; } }
    .filter-tabs { margin-bottom: 24px; }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .skeleton-card {
      height: 260px;
      background: var(--bg-card);
      border-radius: var(--radius-md);
      animation: pulse 1.5s infinite;
      border: 1px solid var(--border-color);
    }

    .project-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: fadeIn 0.35s ease both;
      transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);

      &:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.5) !important; border-color: rgba(88,166,255,0.4) !important; }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 16px 8px;
    }

    .project-icon {
      width: 44px; height: 44px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      mat-icon { color: white; font-size: 22px; width: 22px; height: 22px; }
    }

    .card-actions { display: flex; align-items: center; gap: 4px; }
    .danger-item mat-icon { color: var(--accent-red) !important; }

    .card-body {
      flex: 1; padding: 0 16px 16px; cursor: pointer;

      .project-name { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
      .project-desc { font-size: 12px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    }

    .progress-section {
      .progress-header { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; }
      .task-counts { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
    }

    .card-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px;
      border-top: 1px solid var(--border-color);
    }

    .members-stack { display: flex; }
    .member-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; color: white;
      border: 2px solid var(--bg-card);
      margin-left: -6px;
      &:first-child { margin-left: 0; }
      &.more { background: var(--bg-tertiary) !important; color: var(--text-muted); }
    }

    .deadline {
      display: flex; align-items: center; gap: 4px;
      font-size: 12px; color: var(--text-muted);
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    .empty-state {
      grid-column: 1 / -1; text-align: center; padding: 80px 40px;
      mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--text-muted); opacity: 0.4; margin-bottom: 16px; }
      h3 { font-size: 18px; color: var(--text-secondary); margin-bottom: 8px; }
      p { color: var(--text-muted); margin-bottom: 24px; }
    }
  `]
})
export class ProjectListComponent implements OnInit {
  projects = signal<Project[]>([]);
  loading = signal(true);
  activeFilter = signal('all');

  filters = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'On Hold', value: 'on-hold' },
  ];

  avatarColors = ['#58a6ff', '#7c5cfc', '#3fb950', '#d29922', '#f85149', '#39d2b7'];

  constructor(private projectService: ProjectService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.projectService.getProjects().subscribe({
      next: (p) => { this.projects.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  filteredProjects(): Project[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.projects();
    return this.projects().filter(p => p.status === filter);
  }

  getProgress(p: Project): number {
    if (!p.taskCount) return 0;
    return Math.round((p.completedTaskCount / p.taskCount) * 100);
  }

  getColor(p: Project): string { return p.color || '#58a6ff'; }
  getAvatarColor(id: number | string): string {
    const s = String(id);
    const idx = s.charCodeAt(0) % this.avatarColors.length;
    return this.avatarColors[idx];
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(ProjectFormDialogComponent, { width: '520px', data: null });
    ref.afterClosed().subscribe(result => { if (result) this.loadProjects(); });
  }

  openEditDialog(p: Project): void {
    const ref = this.dialog.open(ProjectFormDialogComponent, { width: '520px', data: p });
    ref.afterClosed().subscribe(result => { if (result) this.loadProjects(); });
  }

  deleteProject(id: number | string): void {
    this.projectService.deleteProject(id).subscribe(() => this.loadProjects());
  }
}
