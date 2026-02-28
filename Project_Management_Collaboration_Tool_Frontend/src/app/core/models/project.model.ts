import { User } from './user.model';

export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'archived';

export interface Project {
    id: number;
    name: string;
    description: string;
    status: ProjectStatus;
    ownerId: number;
    members: User[];
    taskCount: number;
    completedTaskCount: number;
    createdAt: string;
    updatedAt: string;
    deadline?: string;
    color?: string;
}

export interface CreateProjectRequest {
    name: string;
    description: string;
    deadline?: string;
    memberIds?: string[];
    color?: string;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    deadline?: string;
    memberIds?: string[];
    color?: string;
}
