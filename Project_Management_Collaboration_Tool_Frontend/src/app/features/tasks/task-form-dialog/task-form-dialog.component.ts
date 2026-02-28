import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../../core/models/task.model';

@Component({
    selector: 'app-task-form-dialog',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
        MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
        MatDatepickerModule, MatNativeDateModule, MatChipsModule
    ],
    template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="dialog-icon"><mat-icon>{{isEdit ? 'edit' : 'add_task'}}</mat-icon></div>
        <div>
          <h2>{{isEdit ? 'Edit Task' : 'Create New Task'}}</h2>
          <p>{{isEdit ? 'Update task details' : 'Add a task to the board'}}</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div mat-dialog-content class="dialog-content">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Task Title *</mat-label>
            <mat-icon matPrefix>task_alt</mat-icon>
            <input matInput formControlName="title" placeholder="e.g. Design login screen">
            <mat-error>Title is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Description</mat-label>
            <mat-icon matPrefix>notes</mat-icon>
            <textarea matInput formControlName="description" rows="3" placeholder="Task details..."></textarea>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" style="flex: 1">
              <mat-label>Status</mat-label>
              <mat-icon matPrefix>flag</mat-icon>
              <mat-select formControlName="status">
                <mat-option value="todo">To Do</mat-option>
                <mat-option value="in-progress">In Progress</mat-option>
                <mat-option value="done">Done</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" style="flex: 1">
              <mat-label>Priority</mat-label>
              <mat-icon matPrefix>priority_high</mat-icon>
              <mat-select formControlName="priority">
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
                <mat-option value="urgent">Urgent</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Assign To (User ID)</mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input matInput formControlName="assigneeId" placeholder="User ID from backend">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Due Date</mat-label>
            <mat-icon matPrefix>event</mat-icon>
            <input matInput [matDatepicker]="picker" formControlName="dueDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <div *ngIf="error" class="error-banner">
            <mat-icon>error</mat-icon> {{error}}
          </div>
        </div>

        <div mat-dialog-actions class="dialog-actions">
          <button mat-stroked-button type="button" mat-dialog-close>Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            <mat-icon>{{isEdit ? 'save' : 'add'}}</mat-icon>
            {{loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Task')}}
          </button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .dialog-container { min-width: 480px; }
    .dialog-header { display: flex; align-items: center; gap: 14px; padding: 24px 24px 0; margin-bottom: 4px; }
    .dialog-icon { width: 44px; height: 44px; background: linear-gradient(135deg,#7c5cfc,#58a6ff); border-radius: 10px; display: flex; align-items: center; justify-content: center; mat-icon { color: white; } }
    .dialog-header h2 { font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0 0 2px; }
    .dialog-header p { font-size: 12px; color: var(--text-muted); margin: 0; }
    .dialog-content { display: flex; flex-direction: column; gap: 8px; padding: 20px 24px; }
    .form-row { display: flex; gap: 12px; }
    .error-banner { display: flex; align-items: center; gap: 8px; background: rgba(248,81,73,0.1); border: 1px solid rgba(248,81,73,0.3); color: #f85149; padding: 10px; border-radius: 8px; font-size: 13px; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-color); }
  `]
})
export class TaskFormDialogComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    error = '';
    isEdit = false;

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private dialogRef: MatDialogRef<TaskFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { task?: Task; projectId: string; status?: TaskStatus }
    ) { }

    ngOnInit(): void {
        this.isEdit = !!this.data.task;
        this.form = this.fb.group({
            title: [this.data.task?.title || '', Validators.required],
            description: [this.data.task?.description || ''],
            status: [this.data.task?.status || this.data.status || 'todo'],
            priority: [this.data.task?.priority || 'medium'],
            assigneeId: [this.data.task?.assigneeId || ''],
            dueDate: [this.data.task?.dueDate || null]
        });
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        this.loading = true;
        const val = this.form.value;
        const obs = this.isEdit
            ? this.taskService.updateTask(this.data.task!.id, val)
            : this.taskService.createTask({ ...val, projectId: this.data.projectId });
        obs.subscribe({
            next: (result) => this.dialogRef.close(result),
            error: (err) => { this.error = err?.error?.message || 'Failed to save task.'; this.loading = false; }
        });
    }
}
