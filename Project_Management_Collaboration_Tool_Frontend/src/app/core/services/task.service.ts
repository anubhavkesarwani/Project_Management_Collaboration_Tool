import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
    private apiUrl = `${environment.apiUrl}/tasks`;

    constructor(private http: HttpClient) { }

    getTasksByProject(projectId: number | string): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/project/${projectId}`);
    }

    getTask(id: number | string): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/${id}`);
    }

    createTask(request: CreateTaskRequest): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, request);
    }

    updateTask(id: number | string, request: UpdateTaskRequest): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${id}`, request);
    }

    deleteTask(id: number | string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getMyTasks(): Observable<Task[]> {
        // Backend does not expose a dedicated `my-tasks` endpoint in the OpenAPI.
        // Consumers should call `getTasksByProject` or use server list endpoints and filter client-side,
        // or backend must implement a `GET /tasks/my-tasks` endpoint.
        return this.http.get<Task[]>(this.apiUrl);
    }
}
