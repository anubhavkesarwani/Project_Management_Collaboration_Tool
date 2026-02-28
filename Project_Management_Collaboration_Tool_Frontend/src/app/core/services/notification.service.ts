import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/notification.model';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private apiUrl = `${environment.apiUrl}/notifications`;
    private hubConnection: signalR.HubConnection | null = null;
    notifications = signal<Notification[]>([]);
    unreadCount = signal<number>(0);

    constructor(private http: HttpClient, private authService: AuthService) { }

    startConnection(): void {
        // Use the collaboration hub defined in OpenAPI
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.hubUrl}/collaboration`, {
                accessTokenFactory: () => this.authService.getToken() ?? ''
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
            this.notifications.update(ns => [notification, ...ns]);
            this.unreadCount.update(c => c + 1);
        });

        this.hubConnection.start().catch(err => console.error('NotificationHub error:', err));
    }

    stopConnection(): void {
        this.hubConnection?.stop();
    }

    // OpenAPI: GET /api/notifications/user/{userId}
    getNotificationsForUser(userId: number | string): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${environment.apiUrl}/notifications/user/${userId}`);
    }

    markAsRead(id: number | string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/read`, {});
    }

    deleteNotification(id: number | string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    markAllAsRead(): Observable<void> {
        const items = this.notifications();
        if (!items || items.length === 0) return of(void 0);
        const calls = items.filter(n => !n.isRead).map(n => this.markAsRead(n.id));
        if (calls.length === 0) return of(void 0);
        return forkJoin(calls).pipe(map(() => void 0));
    }
}
