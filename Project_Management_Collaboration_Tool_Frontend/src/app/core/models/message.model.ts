import { User } from './user.model';

export interface Message {
    id: number;
    senderId: number;
    sender?: User;
    receiverId?: number;
    projectId?: number;
    threadId?: number;
    content: string;
    isRead: boolean;
    createdAt: string;
    messageType: 'direct' | 'group';
}

export interface Thread {
    id: number;
    projectId: number;
    title: string;
    createdById: number;
    createdBy?: User;
    messageCount: number;
    lastMessage?: Message;
    createdAt: string;
    updatedAt: string;
}

export interface SendMessageRequest {
    receiverId?: number | string;
    projectId?: number;
    threadId?: number;
    content: string;
    messageType: 'direct' | 'group';
}

export interface Conversation {
    userId: string | number;
    user: User;
    lastMessage?: Message;
    unreadCount: number;
}
