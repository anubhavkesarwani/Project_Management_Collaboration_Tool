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
    selector: 'app-login',
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
          <div class="brand-icon">
            <mat-icon>hub</mat-icon>
          </div>
          <h1>ProjectFlow</h1>
          <p>The modern project collaboration platform for high-performing teams.</p>
        </div>
        <div class="feature-list">
          <div class="feature-item" *ngFor="let f of features">
            <mat-icon>{{f.icon}}</mat-icon>
            <div>
              <strong>{{f.title}}</strong>
              <span>{{f.desc}}</span>
            </div>
          </div>
        </div>
        <div class="auth-bg-circles">
          <div class="circle c1"></div>
          <div class="circle c2"></div>
          <div class="circle c3"></div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card fade-in">
          <div class="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to your workspace</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Email address</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" formControlName="email" placeholder="you@company.com">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Invalid email format</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
                <mat-icon>{{showPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <div *ngIf="errorMsg" class="error-banner">
              <mat-icon>error_outline</mat-icon>
              {{errorMsg}}
            </div>

            <button mat-raised-button color="primary" type="submit" class="submit-btn w-100"
                    [disabled]="loginForm.invalid || loading">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>

          <div class="auth-divider">
            <span>Demo credentials</span>
          </div>
          <div class="demo-creds">
            <button mat-stroked-button (click)="fillDemo()">
              <mat-icon>bolt</mat-icon> Use Demo Account
            </button>
          </div>

          <p class="auth-redirect">
            Don't have an account? <a routerLink="/register">Create one</a>
          </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-page {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

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
      margin-bottom: 48px;
      position: relative;
      z-index: 2;

      .brand-icon {
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #58a6ff, #7c5cfc);
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        box-shadow: 0 8px 32px rgba(88,166,255,0.3);

        mat-icon { color: white; font-size: 28px; width: 28px; height: 28px; }
      }

      h1 {
        font-size: 32px;
        font-weight: 800;
        background: linear-gradient(135deg, #58a6ff, #7c5cfc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 12px;
      }

      p {
        color: #8b949e;
        font-size: 15px;
        line-height: 1.7;
        max-width: 340px;
      }
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
      z-index: 2;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;

      mat-icon {
        color: #58a6ff;
        background: rgba(88,166,255,0.1);
        border-radius: 8px;
        padding: 8px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      strong {
        display: block;
        color: #e6edf3;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 2px;
      }

      span {
        color: #8b949e;
        font-size: 13px;
      }
    }

    .auth-bg-circles {
      position: absolute;
      inset: 0;
      pointer-events: none;

      .circle {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.15;
      }

      .c1 { width: 400px; height: 400px; background: #58a6ff; top: -100px; right: -100px; }
      .c2 { width: 300px; height: 300px; background: #7c5cfc; bottom: 50px; left: -50px; }
      .c3 { width: 200px; height: 200px; background: #39d2b7; top: 40%; left: 30%; }
    }

    .auth-right {
      width: 480px;
      background: #161b22;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;

      @media (max-width: 768px) { width: 100%; }
    }

    .auth-card {
      width: 100%;
      max-width: 380px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;

      h2 {
        font-size: 26px;
        font-weight: 700;
        color: #e6edf3;
        margin-bottom: 6px;
      }

      p { color: #8b949e; font-size: 14px; }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .submit-btn {
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.3px;
      background: linear-gradient(135deg, #58a6ff, #7c5cfc) !important;
      border-radius: 8px !important;
      margin-top: 4px;

      mat-spinner { display: inline-block; }
    }

    .auth-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 24px 0 12px;
      color: #656d76;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #30363d;
      }
    }

    .demo-creds {
      display: flex;
      justify-content: center;

      button {
        border-color: #30363d !important;
        color: #8b949e !important;
        border-radius: 8px !important;
        font-size: 13px;
        gap: 6px;
      }
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(248,81,73,0.1);
      border: 1px solid rgba(248,81,73,0.3);
      color: #f85149;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
    }

    .auth-redirect {
      text-align: center;
      margin-top: 24px;
      color: #8b949e;
      font-size: 13px;

      a {
        color: #58a6ff;
        text-decoration: none;
        font-weight: 500;
        &:hover { text-decoration: underline; }
      }
    }
  `]
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    showPassword = false;
    errorMsg = '';

    features = [
        { icon: 'view_kanban', title: 'Kanban Boards', desc: 'Visual task tracking with drag & drop' },
        { icon: 'chat_bubble', title: 'Real-time Messaging', desc: 'Direct messages and group discussions' },
        { icon: 'notifications', title: 'Smart Notifications', desc: 'Stay updated on what matters most' },
        { icon: 'group', title: 'Team Collaboration', desc: 'Manage members, roles and permissions' },
    ];

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    fillDemo(): void {
        this.loginForm.patchValue({ email: 'demo@projectflow.io', password: 'Demo@1234' });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) return;
        this.loading = true;
        this.errorMsg = '';
        const form = this.loginForm.value;
        const payload = { username: form.email, password: form.password };
        this.authService.login(payload).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (err) => {
                this.errorMsg = err?.error?.message || 'Invalid credentials. Please try again.';
                this.loading = false;
            }
        });
    }
}
