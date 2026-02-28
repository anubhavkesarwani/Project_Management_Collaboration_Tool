import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Message, SendMessageRequest, Conversation, Thread } from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private apiUrl = `${environment.apiUrl}/messages`;
    private hubConnection: signalR.HubConnection | null = null;
    messages = signal<Message[]>([]);
    unreadCount = signal<number>(0);

    constructor(private http: HttpClient, private authService: AuthService) { }

    // Provide a lightweight conversations list by listing users (excluding current user).
    getConversations(): Observable<Conversation[]> {
        const currentId = this.authService.currentUser()?.id ?? '';
        return this.http.get<{ id: number; username: string; fullName: string }[]>(`${environment.apiUrl}/users`)
            .pipe(map(users => users
                .filter(u => u.id !== currentId)
            .map(u => ({ userId: u.id, user: { id: u.id, username: u.username, email: '', fullName: u.fullName, role: '', createdAt: '' }, lastMessage: undefined, unreadCount: 0 } as Conversation))));
    }

    // Convenience: get direct messages between the current user and `userId`.
    getDirectMessages(userId: string): Observable<Message[]> {
        const me = this.authService.currentUser()?.id ?? '';
        return this.getDirectMessagesBetween(me, userId);
    }

    startConnection(): void {
        // OpenAPI defines a single collaboration hub at `${environment.hubUrl}/collaboration`.
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.hubUrl}/collaboration`, {
                accessTokenFactory: () => this.authService.getToken() ?? ''
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.on('ReceiveMessage', (message: Message) => {
            this.messages.update(msgs => [...msgs, message]);
            this.unreadCount.update(c => c + 1);
        });

        this.hubConnection.start().catch(err => console.error('MessageHub error:', err));
    }

    stopConnection(): void {
        this.hubConnection?.stop();
    }

    // OpenAPI endpoints:
    // GET /api/messages/project/{projectId}
    getProjectMessages(projectId: string): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/project/${projectId}`);
    }

    // GET /api/messages/dm/{userA}/{userB}
    getDirectMessagesBetween(userA: number | string, userB: number | string): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/dm/${userA}/${userB}`);
    }

    sendMessage(request: SendMessageRequest): Observable<Message> {
        return this.http.post<Message>(this.apiUrl, request);
    }

    // The backend exposes mark-read per message at: PUT /api/messages/{id}
    // If a specific read endpoint is available, this method should be adjusted.
    markAsRead(messageId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${messageId}`, { isRead: true });
    }
}
