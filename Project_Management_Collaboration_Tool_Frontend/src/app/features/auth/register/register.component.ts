import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, RouterLink,
        MatFormFieldModule, MatInputModule, MatButtonModule,
        MatIconModule, MatProgressSpinnerModule
    ],
    template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-icon"><mat-icon>hub</mat-icon></div>
          <h1>ProjectFlow</h1>
          <p>Join thousands of teams building great things together.</p>
        </div>
        <div class="auth-bg-circles">
          <div class="circle c1"></div>
          <div class="circle c2"></div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card fade-in">
          <div class="auth-header">
            <h2>Create your account</h2>
            <p>Start collaborating with your team today</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Full Name</mat-label>
              <mat-icon matPrefix>person</mat-icon>
              <input matInput formControlName="fullName" placeholder="John Doe">
              <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">Full name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Username</mat-label>
              <mat-icon matPrefix>alternate_email</mat-icon>
              <input matInput formControlName="username" placeholder="johndoe">
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">Username is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Email address</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" formControlName="email">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Invalid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
                <mat-icon>{{showPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Minimum 6 characters</mat-error>
            </mat-form-field>

            <div *ngIf="errorMsg" class="error-banner">
              <mat-icon>error_outline</mat-icon> {{errorMsg}}
            </div>

            <button mat-raised-button type="submit" class="submit-btn w-100"
                    [disabled]="registerForm.invalid || loading">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Create Account</span>
            </button>
          </form>

          <p class="auth-redirect">
            Already have an account? <a routerLink="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-page { display: flex; height: 100vh; overflow: hidden; }
    .auth-left {
      flex: 1;
      background: linear-gradient(135deg, #0d1117 0%, #1a1f2e 50%, #0d1117 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px;
      position: relative;
      overflow: hidden;
      @media (max-width: 768px) { display: none; }
    }
    .auth-brand {
      position: relative; z-index: 2;
      .brand-icon {
        width: 56px; height: 56px;
        background: linear-gradient(135deg, #58a6ff, #7c5cfc);
        border-radius: 14px; display: flex; align-items: center; justify-content: center;
        margin-bottom: 20px;
        mat-icon { color: white; font-size: 28px; width: 28px; height: 28px; }
      }
      h1 { font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #58a6ff, #7c5cfc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 12px; }
      p { color: #8b949e; font-size: 15px; line-height: 1.7; max-width: 340px; }
    }
    .auth-bg-circles {
      position: absolute; inset: 0; pointer-events: none;
      .circle { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.15; }
      .c1 { width: 400px; height: 400px; background: #7c5cfc; top: -100px; right: -50px; }
      .c2 { width: 300px; height: 300px; background: #39d2b7; bottom: 50px; left: -50px; }
    }
    .auth-right { width: 480px; background: #161b22; display: flex; align-items: center; justify-content: center; padding: 40px; @media (max-width: 768px) { width: 100%; } }
    .auth-card { width: 100%; max-width: 380px; }
    .auth-header { text-align: center; margin-bottom: 28px; h2 { font-size: 24px; font-weight: 700; color: #e6edf3; margin-bottom: 6px; } p { color: #8b949e; font-size: 14px; } }
    .auth-form { display: flex; flex-direction: column; gap: 12px; }
    .submit-btn { height: 48px; font-size: 15px; font-weight: 600; background: linear-gradient(135deg, #7c5cfc, #58a6ff) !important; border-radius: 8px !important; margin-top: 4px; }
    .error-banner { display: flex; align-items: center; gap: 8px; background: rgba(248,81,73,0.1); border: 1px solid rgba(248,81,73,0.3); color: #f85149; padding: 10px 14px; border-radius: 8px; font-size: 13px; }
    .auth-redirect { text-align: center; margin-top: 24px; color: #8b949e; font-size: 13px; a { color: #58a6ff; text-decoration: none; font-weight: 500; &:hover { text-decoration: underline; } } }
  `]
})
export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;
    loading = false;
    showPassword = false;
    errorMsg = '';

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            fullName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.registerForm.invalid) return;
        this.loading = true;
        this.authService.register(this.registerForm.value).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (err) => {
                this.errorMsg = err?.error?.message || 'Registration failed. Please try again.';
                this.loading = false;
            }
        });
    }
}
