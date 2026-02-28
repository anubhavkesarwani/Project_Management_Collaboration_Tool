export type NotificationType = 'task_assigned' | 'task_updated' | 'task_completed'
    | 'message_received' | 'project_updated' | 'mention' | 'comment_added';

export interface Notification {
    id: number;
    userId: number;
    type: NotificationType;
    title: string;
    body: string;
    isRead: boolean;
    relatedEntityId?: string;
    relatedEntityType?: 'task' | 'project' | 'message';
    createdAt: string;
}
