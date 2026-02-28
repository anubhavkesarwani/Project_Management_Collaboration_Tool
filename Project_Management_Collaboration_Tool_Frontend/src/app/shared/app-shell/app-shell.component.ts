import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { MessageService } from '../../core/services/message.service';

@Component({
    selector: 'app-shell',
    standalone: true,
    imports: [
        CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
        MatIconModule, MatButtonModule, MatTooltipModule,
        MatBadgeModule, MatMenuModule, MatDividerModule
    ],
    template: `
    <div class="shell">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <div class="sidebar-header">
          <div class="brand" [routerLink]="['/dashboard']">
            <div class="brand-icon"><mat-icon>hub</mat-icon></div>
            <span class="brand-name">ProjectFlow</span>
          </div>
          <button mat-icon-button class="collapse-btn" (click)="sidebarCollapsed.update(v => !v)"
                  [matTooltip]="sidebarCollapsed() ? 'Expand' : 'Collapse'">
            <mat-icon>{{sidebarCollapsed() ? 'chevron_right' : 'chevron_left'}}</mat-icon>
          </button>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="nav-label">Main</span>
            <a *ngFor="let item of navItems" class="nav-item"
               [routerLink]="[item.path]" routerLinkActive="active"
               [matTooltip]="sidebarCollapsed() ? item.label : ''" matTooltipPosition="right">
              <div class="nav-icon-wrap">
                <mat-icon>{{item.icon}}</mat-icon>
                <span class="nav-badge" *ngIf="item.badge && getBadgeCount(item.badge) > 0">
                  {{getBadgeCount(item.badge)}}
                </span>
              </div>
              <span class="nav-label-text">{{item.label}}</span>
            </a>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info" [matMenuTriggerFor]="userMenu">
            <div class="user-avatar">
              {{getUserInitials()}}
            </div>
            <div class="user-details">
              <span class="user-name">{{authService.currentUser()?.fullName}}</span>
              <span class="user-role">{{authService.currentUser()?.role}}</span>
            </div>
            <mat-icon class="chevron-icon">expand_less</mat-icon>
          </div>
        </div>
      </aside>

      <!-- User Menu -->
      <mat-menu #userMenu="matMenu" class="user-menu">
        <div class="menu-user-info">
          <strong>{{authService.currentUser()?.fullName}}</strong>
          <span>{{authService.currentUser()?.email}}</span>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item [routerLink]="['/dashboard']">
          <mat-icon>dashboard</mat-icon> Dashboard
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()" class="logout-item">
          <mat-icon>logout</mat-icon> Sign Out
        </button>
      </mat-menu>

      <!-- Main Area -->
      <div class="main-area">
        <!-- Top Header -->
        <header class="top-header">
          <div class="header-left">
            <button mat-icon-button class="mobile-menu-btn" (click)="sidebarCollapsed.update(v => !v)">
              <mat-icon>menu</mat-icon>
            </button>
          </div>
          <div class="header-right">
            <button mat-icon-button [routerLink]="['/messages']"
                    [matBadge]="msgService.unreadCount() || null"
                    matBadgeColor="warn" matBadgeSize="small"
                    matTooltip="Messages">
              <mat-icon>chat_bubble_outline</mat-icon>
            </button>
            <button mat-icon-button [routerLink]="['/notifications']"
                    [matBadge]="notifService.unreadCount() || null"
                    matBadgeColor="warn" matBadgeSize="small"
                    matTooltip="Notifications">
              <mat-icon>notifications_none</mat-icon>
            </button>
            <div class="header-avatar" [matMenuTriggerFor]="userMenu">
              {{getUserInitials()}}
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
    styles: [`
    .shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      background: var(--bg-secondary);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: width var(--transition), min-width var(--transition);
      z-index: 100;
      overflow: hidden;

      &.collapsed {
        width: 72px;
        min-width: 72px;
        .brand-name, .nav-label, .nav-label-text, .user-details, .chevron-icon { display: none !important; }
        .nav-label { display: none !important; }
        .sidebar-header { justify-content: center; }
        .brand { cursor: pointer; }
        .collapse-btn { position: static; }
        .user-info { justify-content: center; padding: 12px; }
      }
    }

    .sidebar-header {
      height: var(--header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      border-bottom: 1px solid var(--border-color);
      flex-shrink: 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-decoration: none;

      .brand-icon {
        width: 34px;
        height: 34px;
        background: linear-gradient(135deg, #58a6ff, #7c5cfc);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        mat-icon { color: white; font-size: 18px; width: 18px; height: 18px; }
      }

      .brand-name {
        font-size: 15px;
        font-weight: 700;
        color: var(--text-primary);
        white-space: nowrap;
      }
    }

    .collapse-btn {
      color: var(--text-muted) !important;
      flex-shrink: 0;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 10px;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: 24px;
    }

    .nav-label {
      display: block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--text-muted);
      padding: 0 10px;
      margin-bottom: 6px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 10px;
      border-radius: var(--radius-sm);
      text-decoration: none;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      transition: background var(--transition), color var(--transition);
      margin-bottom: 2px;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }

      &.active {
        background: rgba(88,166,255,0.1);
        color: var(--accent-blue);
        border: 1px solid rgba(88,166,255,0.2);

        .nav-icon-wrap mat-icon { color: var(--accent-blue); }
      }

      .nav-icon-wrap {
        position: relative;
        display: flex;
        align-items: center;

        mat-icon { font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; }
      }

      .nav-badge {
        position: absolute;
        top: -5px; right: -8px;
        background: var(--accent-red);
        color: white;
        font-size: 9px;
        font-weight: 700;
        border-radius: 10px;
        padding: 0 4px;
        min-width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .sidebar-footer {
      padding: 12px 10px;
      border-top: 1px solid var(--border-color);
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background var(--transition);

      &:hover { background: var(--bg-tertiary); }
    }

    .user-avatar, .header-avatar {
      width: 34px;
      height: 34px;
      min-width: 34px;
      background: linear-gradient(135deg, #58a6ff, #7c5cfc);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: white;
      cursor: pointer;
    }

    .user-details {
      flex: 1;
      overflow: hidden;

      .user-name {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-role {
        display: block;
        font-size: 11px;
        color: var(--text-muted);
        text-transform: capitalize;
      }
    }

    .chevron-icon {
      color: var(--text-muted);
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
    }

    /* User Menu */
    .menu-user-info {
      padding: 12px 16px;
      strong { display: block; color: var(--text-primary); font-size: 13px; margin-bottom: 2px; }
      span { color: var(--text-muted); font-size: 12px; }
    }

    .logout-item mat-icon { color: var(--accent-red) !important; }

    /* ── Main Area ── */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .top-header {
      height: var(--header-height);
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      flex-shrink: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;

      button mat-icon { color: var(--text-secondary); }
    }

    .mobile-menu-btn { display: none; @media (max-width: 768px) { display: inline-flex; } }

    .page-content {
      flex: 1;
      overflow-y: auto;
      padding: 28px;
      background: var(--bg-primary);
    }
  `]
})
export class AppShellComponent implements OnInit, OnDestroy {
    sidebarCollapsed = signal(false);

    navItems = [
        { path: '/dashboard', icon: 'dashboard', label: 'Dashboard', badge: null },
        { path: '/projects', icon: 'folder_open', label: 'Projects', badge: null },
        { path: '/messages', icon: 'chat_bubble_outline', label: 'Messages', badge: 'messages' },
        { path: '/notifications', icon: 'notifications_none', label: 'Notifications', badge: 'notifications' },
    ];

    constructor(
        public authService: AuthService,
        public notifService: NotificationService,
        public msgService: MessageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.notifService.startConnection();
        this.msgService.startConnection();
    }

    ngOnDestroy(): void {
        this.notifService.stopConnection();
        this.msgService.stopConnection();
    }

    getUserInitials(): string {
        const name = this.authService.currentUser()?.fullName || 'U';
        return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    }

    getBadgeCount(type: string | null): number {
        if (type === 'messages') return this.msgService.unreadCount();
        if (type === 'notifications') return this.notifService.unreadCount();
        return 0;
    }

    logout(): void { this.authService.logout(); }
}
