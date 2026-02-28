import { User } from './user.model';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: number;
    assignee?: User;
    assigneeId?: number;
    createdById: number;
    createdBy?: User;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    tags?: string[];
    commentCount?: number;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: number;
    assigneeId?: number;
    dueDate?: string;
    tags?: string[];
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: number;
    dueDate?: string;
    tags?: string[];
}
