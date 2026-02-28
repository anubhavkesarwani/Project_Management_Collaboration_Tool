import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MessageService } from '../../core/services/message.service';
import { Message, Conversation } from '../../core/models/message.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTooltipModule
  ],
  template: `
    <div class="messages-page fade-in">
      <div class="messages-sidebar">
        <div class="sidebar-header">
          <h3>Messages</h3>
          <button mat-icon-button matTooltip="New conversation">
            <mat-icon>edit_square</mat-icon>
          </button>
        </div>

        <div class="search-box">
          <mat-icon>search</mat-icon>
          <input placeholder="Search conversations..." [(ngModel)]="searchTerm">
        </div>

        <div class="conversations-list">
          <div class="conv-item" *ngFor="let conv of filteredConversations()"
               (click)="selectConversation(conv)"
               [class.active]="selectedConv()?.userId === conv.userId">
            <div class="conv-avatar" [style.background]="getAvatarColor(conv.userId)">
              {{conv.user.fullName[0]}}
              <div class="online-dot" *ngIf="isOnline(conv.userId)"></div>
            </div>
            <div class="conv-info">
              <div class="conv-header-row">
                <span class="conv-name">{{conv.user.fullName}}</span>
                <span class="conv-time">{{getTimeAgo(conv.lastMessage?.createdAt)}}</span>
              </div>
              <div class="conv-preview-row">
                <span class="conv-preview">{{conv.lastMessage?.content || 'No messages yet'}}</span>
                <div class="unread-badge" *ngIf="conv.unreadCount > 0">{{conv.unreadCount}}</div>
              </div>
            </div>
          </div>

          <div class="empty-convs" *ngIf="conversations().length === 0">
            <mat-icon>chat_bubble_outline</mat-icon>
            <p>No conversations yet</p>
          </div>
        </div>
      </div>

      <!-- Chat Window -->
      <div class="chat-window" *ngIf="selectedConv()">
        <div class="chat-header">
          <div class="chat-user">
            <div class="conv-avatar sm" [style.background]="getAvatarColor(selectedConv()!.userId)">
              {{selectedConv()!.user.fullName[0]}}
              <div class="online-dot sm" *ngIf="isOnline(selectedConv()!.userId)"></div>
            </div>
            <div>
              <strong>{{selectedConv()!.user.fullName}}</strong>
              <span class="status-text">{{isOnline(selectedConv()!.userId) ? 'Online' : 'Offline'}}</span>
            </div>
          </div>
          <div class="chat-actions">
            <button mat-icon-button matTooltip="Call"><mat-icon>videocam</mat-icon></button>
            <button mat-icon-button matTooltip="Info"><mat-icon>info_outline</mat-icon></button>
          </div>
        </div>

        <div class="messages-list" #messagesList>
          <div class="date-divider">Today</div>
          <div class="message-bubble" *ngFor="let msg of messages()"
               [class.sent]="msg.senderId === currentUserId()"
               [class.received]="msg.senderId !== currentUserId()">
            <div class="bubble-content">
              <p>{{msg.content}}</p>
              <span class="bubble-time">{{msg.createdAt | date:'h:mm a'}}</span>
            </div>
            <div class="bubble-status" *ngIf="msg.senderId === currentUserId()">
              <mat-icon>{{msg.isRead ? 'done_all' : 'done'}}</mat-icon>
            </div>
          </div>

          <div class="no-messages" *ngIf="messages().length === 0">
            <mat-icon>chat</mat-icon>
            <p>Start the conversation!</p>
          </div>
        </div>

        <div class="message-input-area">
          <form [formGroup]="messageForm" (ngSubmit)="sendMessage()" class="input-row">
            <button mat-icon-button type="button" class="attach-btn">
              <mat-icon>attach_file</mat-icon>
            </button>
            <mat-form-field appearance="outline" class="input-field">
              <input matInput formControlName="content" placeholder="Type a message..."
                     (keydown.enter)="$event.preventDefault(); sendMessage()">
            </mat-form-field>
            <button mat-fab extended color="primary" type="submit"
                    [disabled]="!messageForm.get('content')?.value?.trim()">
              <mat-icon>send</mat-icon>
            </button>
          </form>
        </div>
      </div>

      <!-- No Chat Selected -->
      <div class="no-chat-selected" *ngIf="!selectedConv()">
        <mat-icon>message</mat-icon>
        <h3>Select a conversation</h3>
        <p>Choose a conversation from the left to start messaging</p>
      </div>
    </div>
  `,
  styles: [`
    .messages-page {
      display: flex;
      height: calc(100vh - var(--header-height) - 56px);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .messages-sidebar {
      width: 300px;
      min-width: 300px;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      background: var(--bg-secondary);
    }

    .sidebar-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 16px 12px;
      border-bottom: 1px solid var(--border-color);
      h3 { font-size: 16px; font-weight: 700; color: var(--text-primary); }
    }

    .search-box {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border-color);
      mat-icon { color: var(--text-muted); font-size: 18px; width: 18px; height: 18px; }
      input { flex: 1; background: none; border: none; outline: none; color: var(--text-primary); font-size: 13px; font-family: 'Inter', sans-serif; &::placeholder { color: var(--text-muted); } }
    }

    .conversations-list { flex: 1; overflow-y: auto; }

    .conv-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px;
      cursor: pointer;
      border-bottom: 1px solid var(--border-color);
      transition: background var(--transition);
      &:hover { background: var(--bg-tertiary); }
      &.active { background: rgba(88,166,255,0.08); border-left: 3px solid var(--accent-blue); }
    }

    .conv-avatar {
      width: 42px; height: 42px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 700; color: white;
      position: relative; flex-shrink: 0;
      &.sm { width: 36px; height: 36px; font-size: 14px; }
    }

    .online-dot {
      position: absolute; bottom: 1px; right: 1px;
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--accent-green); border: 2px solid var(--bg-secondary);
      &.sm { width: 8px; height: 8px; }
    }

    .conv-info { flex: 1; overflow: hidden; }
    .conv-header-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
    .conv-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .conv-time { font-size: 11px; color: var(--text-muted); }
    .conv-preview-row { display: flex; justify-content: space-between; align-items: center; }
    .conv-preview { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
    .unread-badge { background: var(--accent-blue); color: white; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

    .empty-convs { text-align: center; padding: 40px 20px; mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--text-muted); opacity: 0.4; margin-bottom: 8px; } p { color: var(--text-muted); font-size: 13px; } }

    /* Chat Window */
    .chat-window { flex: 1; display: flex; flex-direction: column; }

    .chat-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid var(--border-color);
      background: var(--bg-secondary);
      .chat-user { display: flex; align-items: center; gap: 12px; }
      strong { display: block; font-size: 14px; color: var(--text-primary); }
      .status-text { display: block; font-size: 11px; color: var(--accent-green); }
      .chat-actions { display: flex; gap: 4px; mat-icon { color: var(--text-muted); } }
    }

    .messages-list {
      flex: 1; overflow-y: auto; padding: 20px;
      display: flex; flex-direction: column; gap: 12px;
      background: var(--bg-primary);
    }

    .date-divider { text-align: center; font-size: 11px; color: var(--text-muted); background: var(--bg-tertiary); border-radius: 10px; padding: 3px 12px; align-self: center; margin: 4px 0; }

    .message-bubble {
      display: flex; align-items: flex-end; gap: 6px;
      max-width: 70%;

      &.sent { align-self: flex-end; flex-direction: row-reverse; }
      &.received { align-self: flex-start; }

      .bubble-content {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 10px 14px;
        p { font-size: 13px; color: var(--text-primary); line-height: 1.5; margin: 0; }
        .bubble-time { display: block; font-size: 10px; color: var(--text-muted); margin-top: 4px; text-align: right; }
      }

      &.sent .bubble-content {
        background: linear-gradient(135deg, rgba(88,166,255,0.2), rgba(124,92,252,0.2));
        border-color: rgba(88,166,255,0.3);
      }

      .bubble-status mat-icon { font-size: 14px; width: 14px; height: 14px; color: var(--accent-green); }
    }

    .no-messages { text-align: center; margin: auto; mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--text-muted); opacity: 0.3; } p { color: var(--text-muted); font-size: 14px; margin-top: 12px; } }

    .message-input-area {
      padding: 12px 16px;
      border-top: 1px solid var(--border-color);
      background: var(--bg-secondary);
    }

    .input-row { display: flex; align-items: center; gap: 8px; }
    .attach-btn mat-icon { color: var(--text-muted); }
    .input-field { flex: 1; }

    /* No chat selected */
    .no-chat-selected {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: var(--text-muted);
      mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.3; margin-bottom: 16px; }
      h3 { font-size: 18px; color: var(--text-secondary); margin-bottom: 8px; }
      p { font-size: 13px; }
    }
  `]
})
export class MessagesComponent implements OnInit {
  conversations = signal<Conversation[]>([]);
  messages = signal<Message[]>([]);
  selectedConv = signal<Conversation | null>(null);
  messageForm: FormGroup;
  searchTerm = '';

  avatarColors = ['#58a6ff', '#7c5cfc', '#3fb950', '#d29922', '#f85149', '#39d2b7'];

  constructor(
    private messageService: MessageService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.messageForm = this.fb.group({ content: ['', Validators.required] });
  }

  ngOnInit(): void {
    this.messageService.getConversations().subscribe({
      next: (convs: Conversation[]) => this.conversations.set(convs),
      error: () => { }
    });
  }

  filteredConversations(): Conversation[] {
    if (!this.searchTerm) return this.conversations();
    return this.conversations().filter(c =>
      c.user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectConversation(conv: Conversation): void {
    this.selectedConv.set(conv);
    this.messageService.getDirectMessages(conv.userId).subscribe({
      next: (msgs: Message[]) => this.messages.set(msgs),
      error: () => { }
    });
  }

  sendMessage(): void {
    const content = this.messageForm.get('content')?.value?.trim();
    if (!content || !this.selectedConv()) return;
    this.messageService.sendMessage({
      receiverId: this.selectedConv()!.userId,
      content,
      messageType: 'direct'
    }).subscribe({
      next: (msg) => {
        this.messages.update(msgs => [...msgs, msg]);
        this.messageForm.reset();
      },
      error: () => { }
    });
  }

  currentUserId(): number | null { return this.authService.currentUser()?.id ?? null; }
  isOnline(_userId: number | string): boolean { return Math.random() > 0.5; }
  getAvatarColor(id: number | string): string { const s = String(id); return this.avatarColors[s.charCodeAt(0) % this.avatarColors.length]; }
  getTimeAgo(dateStr?: string): string {
    if (!dateStr) return '';
    const diff = (Date.now() - new Date(dateStr).getTime()) / 60000;
    if (diff < 1) return 'now';
    if (diff < 60) return `${Math.floor(diff)}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  }
}
