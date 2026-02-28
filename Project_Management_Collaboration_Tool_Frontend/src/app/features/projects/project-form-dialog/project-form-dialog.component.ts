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
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
    selector: 'app-project-form-dialog',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
        MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
        MatDatepickerModule, MatNativeDateModule
    ],
    template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="dialog-title-icon">
          <mat-icon>{{isEdit ? 'edit' : 'add_circle'}}</mat-icon>
        </div>
        <div>
          <h2>{{isEdit ? 'Edit Project' : 'Create New Project'}}</h2>
          <p>{{isEdit ? 'Update project details' : 'Set up your new project workspace'}}</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div mat-dialog-content class="dialog-content">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Project Name *</mat-label>
            <mat-icon matPrefix>folder</mat-icon>
            <input matInput formControlName="name" placeholder="e.g. Mobile App Redesign">
            <mat-error>Project name is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Description</mat-label>
            <mat-icon matPrefix>description</mat-icon>
            <textarea matInput formControlName="description" rows="3"
                      placeholder="Brief description of the project goals..."></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100" *ngIf="isEdit">
            <mat-label>Status</mat-label>
            <mat-icon matPrefix>flag</mat-icon>
            <mat-select formControlName="status">
              <mat-option value="active">Active</mat-option>
              <mat-option value="on-hold">On Hold</mat-option>
              <mat-option value="completed">Completed</mat-option>
              <mat-option value="archived">Archived</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Deadline (optional)</mat-label>
            <mat-icon matPrefix>event</mat-icon>
            <input matInput [matDatepicker]="picker" formControlName="deadline">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <div class="color-section">
            <label>Project Color</label>
            <div class="color-options">
              <div class="color-option" *ngFor="let c of colors"
                   [style.background]="c" (click)="form.patchValue({ color: c })"
                   [class.selected]="form.get('color')?.value === c">
                <mat-icon *ngIf="form.get('color')?.value === c">check</mat-icon>
              </div>
            </div>
          </div>

          <div *ngIf="error" class="error-banner">
            <mat-icon>error</mat-icon> {{error}}
          </div>
        </div>

        <div mat-dialog-actions class="dialog-actions">
          <button mat-stroked-button type="button" mat-dialog-close>Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            <mat-icon>{{isEdit ? 'save' : 'add'}}</mat-icon>
            {{loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Project')}}
          </button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .dialog-container { min-width: 480px; }
    .dialog-header { display: flex; align-items: center; gap: 14px; padding: 24px 24px 0; margin-bottom: 4px; }
    .dialog-title-icon { width: 44px; height: 44px; background: linear-gradient(135deg,#58a6ff,#7c5cfc); border-radius: 10px; display: flex; align-items: center; justify-content: center; mat-icon { color: white; } }
    .dialog-header h2 { font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0 0 2px; }
    .dialog-header p { font-size: 12px; color: var(--text-muted); margin: 0; }
    .dialog-content { display: flex; flex-direction: column; gap: 8px; padding: 20px 24px; max-height: 70vh; overflow-y: auto; }
    .color-section { margin-top: 4px; label { display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 10px; } }
    .color-options { display: flex; gap: 10px; flex-wrap: wrap; }
    .color-option { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; border: 2px solid transparent; transition: all 0.2s; mat-icon { color: white; font-size: 16px; width: 16px; height: 16px; } &.selected { border-color: white; transform: scale(1.15); } &:hover { transform: scale(1.1); } }
    .error-banner { display: flex; align-items: center; gap: 8px; background: rgba(248,81,73,0.1); border: 1px solid rgba(248,81,73,0.3); color: #f85149; padding: 10px; border-radius: 8px; font-size: 13px; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border-color); }
  `]
})
export class ProjectFormDialogComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    error = '';
    isEdit = false;

    colors = [
        'linear-gradient(135deg,#58a6ff,#1f6feb)',
        'linear-gradient(135deg,#7c5cfc,#a87bff)',
        'linear-gradient(135deg,#3fb950,#238636)',
        'linear-gradient(135deg,#d29922,#bb8009)',
        'linear-gradient(135deg,#f85149,#da3633)',
        'linear-gradient(135deg,#39d2b7,#1abc9c)',
    ];

    constructor(
        private fb: FormBuilder,
        private projectService: ProjectService,
        private dialogRef: MatDialogRef<ProjectFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Project | null
    ) { }

    ngOnInit(): void {
        this.isEdit = !!this.data;
        this.form = this.fb.group({
            name: [this.data?.name || '', Validators.required],
            description: [this.data?.description || ''],
            status: [this.data?.status || 'active'],
            deadline: [this.data?.deadline || null],
            color: [this.data?.color || this.colors[0]]
        });
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        this.loading = true;
        const request = this.form.value;
        const obs = this.isEdit
            ? this.projectService.updateProject(this.data!.id, request)
            : this.projectService.createProject(request);
        obs.subscribe({
            next: (result) => { this.dialogRef.close(result); },
            error: (err) => { this.error = err?.error?.message || 'Failed to save project.'; this.loading = false; }
        });
    }
}
