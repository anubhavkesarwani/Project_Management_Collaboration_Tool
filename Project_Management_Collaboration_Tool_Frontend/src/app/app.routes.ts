import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: '',
        loadComponent: () => import('./shared/app-shell/app-shell.component').then(m => m.AppShellComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'projects',
                loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent)
            },
            {
                path: 'projects/:id',
                loadComponent: () => import('./features/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
            },
            {
                path: 'projects/:id/tasks',
                loadComponent: () => import('./features/tasks/kanban-board/kanban-board.component').then(m => m.KanbanBoardComponent)
            },
            {
                path: 'messages',
                loadComponent: () => import('./features/messages/messages.component').then(m => m.MessagesComponent)
            },
            {
                path: 'messages/:userId',
                loadComponent: () => import('./features/messages/messages.component').then(m => m.MessagesComponent)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
