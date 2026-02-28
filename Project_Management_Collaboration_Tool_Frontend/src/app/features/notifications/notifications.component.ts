import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule],
  template: `
    <div class="notifications-page fade-in">
      <div class="page-header">
        <div>
          <h2>Notifications</h2>
          <div class="page-subtitle">{{unreadCount()}} unread notification{{unreadCount() !== 1 ? 's' : ''}}</div>
        </div>
        <button mat-stroked-button (click)="markAllRead()" [disabled]="unreadCount() === 0">
          <mat-icon>done_all</mat-icon> Mark all as read
        </button>
      </div>

      <!-- Filter tabs -->
      <div class="filter-tabs mb-3">
        <button *ngFor="let f of filters" (click)="activeFilter.set(f.value)"
                [class.active]="activeFilter() === f.value" class="filter-tab">
          {{f.label}}
        </button>
      </div>

      <div class="notifications-list">
        <!-- Empty state -->
        <div class="empty-state" *ngIf="filteredNotifications().length === 0">
          <mat-icon>notifications_none</mat-icon>
          <h3>All caught up!</h3>
          <p>No {{activeFilter() !== 'all' ? activeFilter() + ' ' : ''}}notifications</p>
        </div>

        <div class="notif-item" *ngFor="let n of filteredNotifications(); let i = index"
             [class.unread]="!n.isRead"
             [style.animation-delay]="(i * 0.04) + 's'"
             (click)="markRead(n)">
          <div class="notif-icon" [style.background]="getNotifColor(n.type)">
            <mat-icon>{{getNotifIcon(n.type)}}</mat-icon>
          </div>
          <div class="notif-content">
            <div class="notif-title">{{n.title}}</div>
            <div class="notif-body">{{n.body}}</div>
            <div class="notif-time">
              <mat-icon>schedule</mat-icon>
              {{getTimeAgo(n.createdAt)}}
            </div>
          </div>
          <div class="notif-actions">
            <div class="unread-dot" *ngIf="!n.isRead"></div>
            <button mat-icon-button (click)="$event.stopPropagation(); deleteNotification(n.id)"
                    matTooltip="Dismiss">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-page { max-width: 760px; }

    .notifications-list {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .notif-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: background var(--transition);
      animation: fadeIn 0.3s ease both;

      &:last-child { border-bottom: none; }
      &:hover { background: var(--bg-tertiary); }

      &.unread {
        background: rgba(88,166,255,0.04);
        .notif-title { font-weight: 700; color: var(--text-primary); }
      }
    }

    .notif-icon {
      width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      mat-icon { color: white; font-size: 18px; width: 18px; height: 18px; }
    }

    .notif-content { flex: 1; overflow: hidden; }
    .notif-title { font-size: 13px; color: var(--text-primary); margin-bottom: 4px; }
    .notif-body { font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 6px; }
    .notif-time { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-muted); mat-icon { font-size: 12px; width: 12px; height: 12px; } }

    .notif-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-blue); }

    .empty-state { text-align: center; padding: 80px 40px; mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--text-muted); opacity: 0.3; margin-bottom: 16px; } h3 { font-size: 18px; color: var(--text-secondary); margin-bottom: 8px; } p { color: var(--text-muted); } }
    .filter-tab { background: none; border: 1px solid var(--border-color); color: var(--text-secondary); padding: 6px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; transition: all 0.2s; margin-right: 6px; &:hover { border-color: var(--accent-blue); color: var(--accent-blue); } &.active { background: rgba(88,166,255,0.1); border-color: var(--accent-blue); color: var(--accent-blue); font-weight: 600; } }
    .filter-tabs { margin-bottom: 16px; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  activeFilter = signal('all');

  filters = [
    { label: 'All', value: 'all' },
    { label: 'Tasks', value: 'task' },
    { label: 'Messages', value: 'message' },
    { label: 'Unread', value: 'unread' },
  ];

  constructor(private notifService: NotificationService, private authService: AuthService) { }

  ngOnInit(): void {
    const userId = this.authService.currentUser()?.id ?? '';
    if (userId) {
      this.notifService.getNotificationsForUser(userId).subscribe({
        next: (ns: Notification[]) => this.notifications.set(ns),
        error: () => { }
      });
    }
  }

  filteredNotifications(): Notification[] {
    const f = this.activeFilter();
    const ns = this.notifications();
    if (f === 'all') return ns;
    if (f === 'unread') return ns.filter(n => !n.isRead);
    if (f === 'task') return ns.filter(n => n.type.startsWith('task'));
    if (f === 'message') return ns.filter(n => n.type.startsWith('message'));
    return ns;
  }

  unreadCount(): number { return this.notifications().filter(n => !n.isRead).length; }

  markRead(n: Notification): void {
    if (n.isRead) return;
    this.notifService.markAsRead(n.id).subscribe(() => {
      this.notifications.update(ns => ns.map(item =>
        item.id === n.id ? { ...item, isRead: true } : item
      ));
    });
  }

  markAllRead(): void {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications.update(ns => ns.map(n => ({ ...n, isRead: true })));
    });
  }

  deleteNotification(id: number | string): void {
    this.notifService.deleteNotification(id).subscribe(() => {
      const numericId = typeof id === 'number' ? id : Number(id);
      this.notifications.update(ns => ns.filter(n => n.id !== numericId));
    });
  }

  getNotifIcon(type: string): string {
    const icons: Record<string, string> = {
      task_assigned: 'assignment_ind', task_updated: 'edit', task_completed: 'check_circle',
      message_received: 'chat', project_updated: 'folder', mention: 'alternate_email', comment_added: 'comment'
    };
    return icons[type] || 'notifications';
  }

  getNotifColor(type: string): string {
    if (type.startsWith('task')) return 'rgba(88,166,255,0.8)';
    if (type.startsWith('message')) return 'rgba(124,92,252,0.8)';
    if (type === 'mention') return 'rgba(57,210,183,0.8)';
    return 'rgba(63,185,80,0.8)';
  }

  getTimeAgo(dateStr: string): string {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 60000;
    if (diff < 1) return 'just now';
    if (diff < 60) return `${Math.floor(diff)} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  }
}
