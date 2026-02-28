import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';

interface KanbanColumn {
    id: TaskStatus;
    title: string;
    icon: string;
    color: string;
    tasks: Task[];
}

@Component({
    selector: 'app-kanban-board',
    standalone: true,
    imports: [
        CommonModule, DragDropModule, MatButtonModule, MatIconModule,
        MatDialogModule, MatMenuModule, MatTooltipModule, MatChipsModule
    ],
    template: `
    <div class="kanban-page fade-in">
      <div class="page-header">
        <div>
          <h2>Task Board</h2>
          <div class="page-subtitle">{{totalTasks()}} total tasks</div>
        </div>
        <div class="header-actions">
          <button mat-stroked-button class="filter-btn">
            <mat-icon>filter_list</mat-icon> Filter
          </button>
          <button mat-raised-button color="primary" (click)="openCreateTask()">
            <mat-icon>add</mat-icon> Add Task
          </button>
        </div>
      </div>

      <div class="kanban-board" cdkDropListGroup>
        <div class="kanban-column" *ngFor="let col of columns()">
          <div class="column-header" [style.border-top-color]="col.color">
            <div class="col-title">
              <mat-icon [style.color]="col.color">{{col.icon}}</mat-icon>
              <span>{{col.title}}</span>
              <div class="task-count">{{col.tasks.length}}</div>
            </div>
            <button mat-icon-button (click)="openCreateTask(col.id)" matTooltip="Add task">
              <mat-icon>add</mat-icon>
            </button>
          </div>

          <div class="column-body"
               cdkDropList
               [id]="col.id"
               [cdkDropListData]="col.tasks"
               [cdkDropListConnectedTo]="getConnectedLists(col.id)"
               (cdkDropListDropped)="onDrop($event)">

            <div class="task-card" *ngFor="let task of col.tasks"
                 cdkDrag [cdkDragData]="task">
              <!-- Drag placeholder -->
              <div class="task-placeholder" *cdkDragPlaceholder></div>

              <div class="task-card-header">
                <span class="badge" [class]="'badge-' + task.priority">{{task.priority}}</span>
                <div class="task-actions">
                  <button mat-icon-button [matMenuTriggerFor]="taskMenu" (click)="$event.stopPropagation()">
                    <mat-icon>more_horiz</mat-icon>
                  </button>
                  <mat-menu #taskMenu="matMenu">
                    <button mat-menu-item (click)="openEditTask(task)"><mat-icon>edit</mat-icon> Edit</button>
                    <button mat-menu-item (click)="deleteTask(task, col)"><mat-icon>delete</mat-icon> Delete</button>
                  </mat-menu>
                </div>
              </div>

              <h4 class="task-title">{{task.title}}</h4>
              <p class="task-desc" *ngIf="task.description">{{task.description}}</p>

              <div class="task-tags" *ngIf="task.tags?.length">
                <span class="tag" *ngFor="let tag of task.tags">{{tag}}</span>
              </div>

              <div class="task-footer">
                <div class="assignee-info" *ngIf="task.assignee">
                  <div class="assignee-avatar" [matTooltip]="task.assignee.fullName">
                    {{task.assignee.fullName[0]}}
                  </div>
                  <span class="assignee-name">{{task.assignee.fullName.split(' ')[0]}}</span>
                </div>
                <div class="no-assignee" *ngIf="!task.assignee">
                  <mat-icon matTooltip="Unassigned">person_outline</mat-icon>
                </div>
                <div class="due-date" *ngIf="task.dueDate" [class.overdue]="isOverdue(task.dueDate)">
                  <mat-icon>calendar_today</mat-icon>
                  <span>{{task.dueDate | date:'MMM d'}}</span>
                </div>
              </div>
            </div>

            <!-- Empty column state -->
            <div class="column-empty" *ngIf="col.tasks.length === 0 && !loading()">
              <mat-icon>add_circle_outline</mat-icon>
              <span>Drop tasks here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .kanban-page { height: 100%; display: flex; flex-direction: column; }
    .header-actions { display: flex; gap: 12px; }
    .filter-btn { border-color: var(--border-color) !important; color: var(--text-secondary) !important; }

    .kanban-board {
      display: flex;
      gap: 16px;
      flex: 1;
      overflow-x: auto;
      padding-bottom: 16px;
      align-items: flex-start;
    }

    .kanban-column {
      min-width: 300px;
      max-width: 320px;
      flex-shrink: 0;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 200px);
    }

    .column-header {
      padding: 14px 14px 12px;
      border-top: 3px solid;
      border-radius: var(--radius-md) var(--radius-md) 0 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;

      .col-title {
        display: flex;
        align-items: center;
        gap: 8px;
        mat-icon { font-size: 18px; width: 18px; height: 18px; }
        span { font-size: 13px; font-weight: 600; color: var(--text-primary); }
      }

      button mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--text-muted); }
    }

    .task-count {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      font-size: 11px;
      font-weight: 600;
      padding: 1px 7px;
      border-radius: 10px;
    }

    .column-body {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .task-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 12px;
      cursor: grab;
      transition: box-shadow var(--transition), border-color var(--transition), transform var(--transition);

      &:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        border-color: rgba(88,166,255,0.3);
        transform: translateY(-1px);
      }

      &.cdk-drag-dragging { cursor: grabbing; box-shadow: 0 16px 40px rgba(0,0,0,0.6); transform: rotate(2deg) scale(1.02); border-color: var(--accent-blue); }
    }

    .task-placeholder {
      background: rgba(88,166,255,0.08);
      border: 2px dashed rgba(88,166,255,0.4);
      border-radius: var(--radius-sm);
      height: 80px;
    }

    .cdk-drop-list-dragging .task-card:not(.cdk-drag-placeholder) { transition: transform 250ms cubic-bezier(0,0,0.2,1); }

    .task-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
      button { width: 24px; height: 24px; line-height: 24px; mat-icon { font-size: 16px; width: 16px; height: 16px; } }
    }

    .task-title { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.5; margin-bottom: 4px; }
    .task-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

    .task-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
    .tag { background: rgba(88,166,255,0.1); color: var(--accent-blue); font-size: 10px; padding: 2px 7px; border-radius: 4px; }

    .task-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border-color); }
    .assignee-info { display: flex; align-items: center; gap: 6px; }
    .assignee-avatar { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg,#58a6ff,#7c5cfc); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; }
    .assignee-name { font-size: 11px; color: var(--text-muted); }
    .no-assignee mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--text-muted); }

    .due-date { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--text-muted);
      mat-icon { font-size: 12px; width: 12px; height: 12px; }
      &.overdue { color: var(--accent-red); }
    }

    .column-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 24px 12px; color: var(--text-muted); opacity: 0.5; mat-icon { font-size: 28px; width: 28px; height: 28px; } span { font-size: 12px; } }
  `]
})
export class KanbanBoardComponent implements OnInit {
    columns = signal<KanbanColumn[]>([
        { id: 'todo', title: 'To Do', icon: 'radio_button_unchecked', color: '#58a6ff', tasks: [] },
        { id: 'in-progress', title: 'In Progress', icon: 'pending', color: '#d29922', tasks: [] },
        { id: 'done', title: 'Done', icon: 'check_circle', color: '#3fb950', tasks: [] },
    ]);
    loading = signal(true);
    projectId = '';

    constructor(
        private route: ActivatedRoute,
        private taskService: TaskService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.projectId = this.route.snapshot.paramMap.get('id') || '';
        this.loadTasks();
    }

    loadTasks(): void {
        this.taskService.getTasksByProject(this.projectId).subscribe({
            next: (tasks) => {
                const cols = this.columns();
                cols.forEach(col => col.tasks = tasks.filter(t => t.status === col.id));
                this.columns.set([...cols]);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    getConnectedLists(current: string): string[] {
        return this.columns().map(c => c.id).filter(id => id !== current);
    }

    onDrop(event: CdkDragDrop<Task[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            const newStatus = event.container.id as TaskStatus;
            const task = event.item.data as Task;
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            this.taskService.updateTask(task.id, { status: newStatus }).subscribe();
        }
    }

    totalTasks(): number { return this.columns().reduce((acc, c) => acc + c.tasks.length, 0); }
    isOverdue(date: string): boolean { return new Date(date) < new Date(); }

    openCreateTask(status: TaskStatus = 'todo'): void {
        const ref = this.dialog.open(TaskFormDialogComponent, {
            width: '540px',
            data: { projectId: this.projectId, status }
        });
        ref.afterClosed().subscribe(result => { if (result) this.loadTasks(); });
    }

    openEditTask(task: Task): void {
        const ref = this.dialog.open(TaskFormDialogComponent, {
            width: '540px',
            data: { task, projectId: this.projectId }
        });
        ref.afterClosed().subscribe(result => { if (result) this.loadTasks(); });
    }

    deleteTask(task: Task, col: KanbanColumn): void {
        this.taskService.deleteTask(task.id).subscribe(() => {
            col.tasks = col.tasks.filter(t => t.id !== task.id);
            this.columns.update(cols => [...cols]);
        });
    }
}
