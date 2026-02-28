import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [
        CommonModule, RouterLink, MatTabsModule, MatButtonModule,
        MatIconModule, MatProgressBarModule, MatChipsModule, MatTooltipModule
    ],
    template: `
    <div class="project-detail fade-in" *ngIf="project()">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a routerLink="/projects">Projects</a>
        <mat-icon>chevron_right</mat-icon>
        <span>{{project()?.name}}</span>
      </div>

      <!-- Project Header -->
      <div class="project-hero">
        <div class="project-icon-lg" [style.background]="project()?.color || 'linear-gradient(135deg,#58a6ff,#7c5cfc)'">
          <mat-icon>folder</mat-icon>
        </div>
        <div class="project-hero-info">
          <div class="title-row">
            <h2>{{project()?.name}}</h2>
            <span class="badge" [class]="'badge-' + project()?.status">{{project()?.status}}</span>
          </div>
          <p>{{project()?.description}}</p>
          <div class="hero-meta">
            <span><mat-icon>group</mat-icon> {{project()?.members?.length || 0}} members</span>
            <span><mat-icon>task_alt</mat-icon> {{project()?.taskCount || 0}} tasks</span>
            <span *ngIf="project()?.deadline"><mat-icon>event</mat-icon> Due {{project()?.deadline | date:'mediumDate'}}</span>
          </div>
        </div>
        <div class="hero-actions">
          <button mat-raised-button color="primary" [routerLink]="['/projects', projectId, 'tasks']">
            <mat-icon>view_kanban</mat-icon> Open Board
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="project-progress-bar">
        <div class="progress-info">
          <span>Overall progress</span>
          <span>{{getProgress()}}% complete</span>
        </div>
        <mat-progress-bar mode="determinate" [value]="getProgress()" color="accent" style="height: 8px; border-radius: 4px;"></mat-progress-bar>
      </div>

      <!-- Tabs -->
      <mat-tab-group animationDuration="200ms" class="project-tabs">
        <mat-tab label="Overview">
          <div class="tab-content">
            <div class="overview-grid">
              <div class="overview-card">
                <h4>About</h4>
                <p>{{project()?.description || 'No description provided.'}}</p>
                <div class="detail-list">
                  <div class="detail-row">
                    <span>Status</span>
                    <span class="badge" [class]="'badge-' + project()?.status">{{project()?.status}}</span>
                  </div>
                  <div class="detail-row" *ngIf="project()?.deadline">
                    <span>Deadline</span>
                    <strong>{{project()?.deadline | date:'mediumDate'}}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Created</span>
                    <strong>{{project()?.createdAt | date:'mediumDate'}}</strong>
                  </div>
                </div>
              </div>
              <div class="overview-card">
                <h4>Members ({{project()?.members?.length || 0}})</h4>
                <div class="member-list">
                  <div class="member-row" *ngFor="let m of project()?.members">
                    <div class="member-av">{{m.fullName[0]}}</div>
                    <div>
                      <strong>{{m.fullName}}</strong>
                      <span>{{m.email}}</span>
                    </div>
                    <span class="badge badge-active">{{m.role}}</span>
                  </div>
                  <div *ngIf="!project()?.members?.length" class="empty-sm">No members yet</div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Tasks">
          <div class="tab-content">
            <div class="quick-actions">
              <button mat-raised-button color="primary" [routerLink]="['/projects', projectId, 'tasks']">
                <mat-icon>view_kanban</mat-icon> Open Kanban Board
              </button>
            </div>
            <p style="color: var(--text-muted); font-size: 13px;">
              Click "Open Kanban Board" to manage tasks with drag-and-drop functionality.
            </p>
          </div>
        </mat-tab>
        <mat-tab label="Discussions">
          <div class="tab-content">
            <p style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 32px;">
              <mat-icon style="font-size: 40px; width: 40px; height: 40px; display: block; margin: 0 auto 12px; opacity: 0.4;">forum</mat-icon>
              Group discussions for this project will appear here.
            </p>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>

    <div *ngIf="!project() && !loading()" class="empty-state">
      <mat-icon>error_outline</mat-icon>
      <h3>Project not found</h3>
      <a routerLink="/projects">Back to Projects</a>
    </div>
  `,
    styles: [`
    .project-detail { max-width: 1100px; }
    .breadcrumb { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text-muted); margin-bottom: 20px; a { color: var(--accent-blue); text-decoration: none; } mat-icon { font-size: 16px; width: 16px; height: 16px; } }
    .project-hero { display: flex; align-items: flex-start; gap: 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px; margin-bottom: 16px; }
    .project-icon-lg { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; mat-icon { color: white; font-size: 28px; width: 28px; height: 28px; } }
    .project-hero-info { flex: 1; }
    .title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; h2 { font-size: 22px; font-weight: 700; color: var(--text-primary); } }
    .project-hero-info p { color: var(--text-secondary); font-size: 14px; margin-bottom: 12px; }
    .hero-meta { display: flex; gap: 20px; flex-wrap: wrap; span { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text-muted); mat-icon { font-size: 16px; width: 16px; height: 16px; } } }
    .hero-actions { flex-shrink: 0; }
    .project-progress-bar { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px 20px; margin-bottom: 20px; }
    .progress-info { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); margin-bottom: 10px; }
    .project-tabs { background: transparent !important; }
    .tab-content { padding: 24px 0; }
    .overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; @media (max-width: 700px) { grid-template-columns: 1fr; } }
    .overview-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; } p { color: var(--text-secondary); font-size: 13px; margin-bottom: 16px; } }
    .detail-list { display: flex; flex-direction: column; gap: 10px; }
    .detail-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: var(--text-secondary); strong { color: var(--text-primary); } }
    .member-list { display: flex; flex-direction: column; gap: 10px; }
    .member-row { display: flex; align-items: center; gap: 10px; strong { display: block; font-size: 13px; color: var(--text-primary); } span { display: block; font-size: 11px; color: var(--text-muted); } }
    .member-av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#58a6ff,#7c5cfc); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 700; flex-shrink: 0; }
    .empty-sm { color: var(--text-muted); font-size: 13px; padding: 12px 0; }
    .quick-actions { margin-bottom: 16px; }
    .empty-state { text-align: center; padding: 80px; mat-icon { font-size: 60px; width: 60px; height: 60px; color: var(--text-muted); opacity: 0.4; } h3 { color: var(--text-secondary); margin: 16px 0; } }
  `]
})
export class ProjectDetailComponent implements OnInit {
    project = signal<Project | null>(null);
    loading = signal(true);
    projectId = '';

    constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

    ngOnInit(): void {
        this.projectId = this.route.snapshot.paramMap.get('id') || '';
        this.projectService.getProject(this.projectId).subscribe({
            next: (p) => { this.project.set(p); this.loading.set(false); },
            error: () => this.loading.set(false)
        });
    }

    getProgress(): number {
        const p = this.project();
        if (!p || !p.taskCount) return 0;
        return Math.round((p.completedTaskCount / p.taskCount) * 100);
    }
}
