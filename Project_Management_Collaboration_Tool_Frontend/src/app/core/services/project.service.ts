import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../models/project.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private apiUrl = `${environment.apiUrl}/projects`;

    constructor(private http: HttpClient) { }

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(this.apiUrl);
    }

    getProject(id: number | string): Observable<Project> {
        return this.http.get<Project>(`${this.apiUrl}/${id}`);
    }

    createProject(request: CreateProjectRequest): Observable<Project> {
        return this.http.post<Project>(this.apiUrl, request);
    }

    updateProject(id: number | string, request: UpdateProjectRequest): Observable<Project> {
        return this.http.put<Project>(`${this.apiUrl}/${id}`, request);
    }

    deleteProject(id: number | string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Project members are expected to be part of the `Project` payload (Project.members).
    // If the backend provides dedicated member endpoints, implement them here. For now, callers
    // should use `getProject(id)` and read the `members` property.
}
