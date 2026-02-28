# 🚀 ProjectFlow — Real-time Project Management Collaboration Tool

> A modern, full-featured project management frontend built with **Angular 21**, **TypeScript**, **Angular Material**, and **SignalR** for real-time collaboration.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Backend Integration Guide](#-backend-integration-guide)
- [API Endpoints Reference](#-api-endpoints-reference)
- [SignalR Hubs](#-signalr-hubs)
- [Authentication Flow](#-authentication-flow)
- [Pages & Routes](#-pages--routes)
- [Data Models](#-data-models)
- [Scripts](#-scripts)

---

## 🌟 Overview

ProjectFlow is a **real-time project management collaboration tool** where users can:

- Create and manage projects
- Assign tasks via a **drag-and-drop Kanban board**
- Send **direct messages** and create **group discussions**
- Receive **live notifications** for task updates and messages
- Collaborate in real-time via **SignalR WebSockets**

Built for the **Hackathon** — frontend part ready to plug into your ASP.NET Core / C# Web API backend.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based login & registration with route guards |
| 📋 **Kanban Board** | Drag-and-drop task management with CDK DnD |
| 💬 **Messaging** | Real-time direct messages + group discussions via SignalR |
| 🔔 **Notifications** | Live push notifications for task updates and messages |
| 📁 **Project Management** | Create, edit, delete projects with member management |
| ✅ **Task Tracking** | Full CRUD with priority, assignee, due date, and status |
| 📊 **Dashboard** | Stats overview, assigned tasks, recent projects, activity feed |
| 🌐 **Landing Page** | Marketing page with hero, features, pricing, and testimonials |

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Angular 21** | Frontend framework (Standalone Components) |
| **TypeScript** | Type safety across the entire codebase |
| **Angular Material** | UI component library with custom dark theme |
| **Angular CDK** | Drag-and-drop for the Kanban board |
| **@microsoft/signalr** | Real-time WebSocket communication |
| **RxJS** | Reactive data streams |
| **Angular Signals** | Fine-grained reactive state management |
| **SCSS** | Styling with CSS variables and nesting |

---

## 📁 Project Structure

```
pm-tool/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/               # TypeScript interfaces
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── project.model.ts
│   │   │   │   ├── task.model.ts
│   │   │   │   ├── message.model.ts
│   │   │   │   └── notification.model.ts
│   │   │   ├── services/             # HTTP + SignalR services
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── project.service.ts
│   │   │   │   ├── task.service.ts
│   │   │   │   ├── message.service.ts
│   │   │   │   └── notification.service.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts   # Auto-attaches JWT to all requests
│   │   │   └── guards/
│   │   │       └── auth.guard.ts         # Route protection
│   │   ├── features/
│   │   │   ├── landing/              # Marketing landing page
│   │   │   ├── auth/
│   │   │   │   ├── login/            # Login page
│   │   │   │   └── register/         # Registration page
│   │   │   ├── dashboard/            # Dashboard overview
│   │   │   ├── projects/
│   │   │   │   ├── project-list/     # Projects grid view
│   │   │   │   ├── project-detail/   # Project detail with tabs
│   │   │   │   └── project-form-dialog/ # Create/edit dialog
│   │   │   ├── tasks/
│   │   │   │   ├── kanban-board/     # Drag-and-drop board
│   │   │   │   └── task-form-dialog/ # Create/edit task dialog
│   │   │   ├── messages/             # Chat UI
│   │   │   └── notifications/        # Notification center
│   │   ├── shared/
│   │   │   └── app-shell/            # Main layout (sidebar + header)
│   │   ├── app.routes.ts             # Lazy-loaded routing
│   │   ├── app.config.ts             # App providers config
│   │   └── app.ts                    # Root component
│   ├── environments/
│   │   ├── environment.ts            # Development config
│   │   └── environment.prod.ts       # Production config
│   ├── styles.scss                   # Global styles + dark theme
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (LTS recommended — use Node LTS versions such as v18 or v20; avoid odd-numbered non-LTS releases like v25)
- **npm** v9+

### Installation

```bash
# 1. Navigate to the project folder
cd "pm-tool"

# 2. Install all dependencies
npm install

# 3. Start the development server
npm start
```

The app will be available at **http://localhost:4200**

### Build for Production

```bash
npm run build
```

Output goes to `dist/pm-tool/`.

---

## ⚙️ Environment Configuration

Before connecting to the backend, update the environment files:

**`src/environments/environment.ts`** (Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',    // ← Your C# Web API URL
  hubUrl: 'http://localhost:5000/hubs'    // ← Your SignalR hub base URL
};
```

**`src/environments/environment.prod.ts`** (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  hubUrl: 'https://your-production-api.com/hubs'
};
```

---

## 🔗 Backend Integration Guide

### 1. CORS Configuration (ASP.NET Core)

Add CORS policy in `Program.cs` to allow the Angular dev server:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required for SignalR
    });
});

app.UseCors("AllowAngular");
```

### 2. JWT Authentication

The frontend stores the JWT in `localStorage` and automatically attaches it to every HTTP request via `authInterceptor`:

```
Authorization: Bearer <your-jwt-token>
```

Your backend should:
- Issue a JWT on successful login/register
- Return it as `{ token: string, user: UserObject }` from `POST /auth/login`

### 3. SignalR Setup

In `Program.cs`:
```csharp
builder.Services.AddSignalR();

app.MapHub<MessageHub>("/hubs/messageHub");
app.MapHub<NotificationHub>("/hubs/notificationHub");
```

---

## 📡 API Endpoints Reference

### Authentication

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| `POST` | `/auth/login` | `{ email, password }` | `{ token, user }` |
| `POST` | `/auth/register` | `{ fullName, username, email, password }` | `{ token, user }` |
| `GET` | `/auth/me` | — | `User` object |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects` | Get all projects for current user |
| `POST` | `/projects` | Create a new project |
| `GET` | `/projects/:id` | Get project details |
| `PUT` | `/projects/:id` | Update project |
| `DELETE` | `/projects/:id` | Delete project |
| `POST` | `/projects/:id/members` | Add member to project |
| `DELETE` | `/projects/:id/members/:userId` | Remove member |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects/:id/tasks` | Get all tasks for a project |
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks/:id` | Get task details |
| `PUT` | `/tasks/:id` | Update task (status, priority, assignee, etc.) |
| `DELETE` | `/tasks/:id` | Delete task |
| `GET` | `/tasks/mine` | Get tasks assigned to current user |

### Messages

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/messages/conversations` | Get all conversations |
| `GET` | `/messages/direct/:userId` | Get direct message history |
| `POST` | `/messages` | Send a message |
| `GET` | `/projects/:id/threads` | Get project discussion threads |
| `POST` | `/projects/:id/threads` | Create a thread |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/notifications` | Get all notifications for current user |
| `PUT` | `/notifications/:id/read` | Mark notification as read |
| `PUT` | `/notifications/read-all` | Mark all as read |
| `DELETE` | `/notifications/:id` | Delete a notification |

---

## ⚡ SignalR Hubs

### Message Hub — `/hubs/messageHub`

| Event (Server → Client) | Payload | Description |
|---|---|---|
| `ReceiveMessage` | `Message` object | New direct message received |
| `ReceiveThreadMessage` | `Message` object | New group thread message |

### Notification Hub — `/hubs/notificationHub`

| Event (Server → Client) | Payload | Description |
|---|---|---|
| `ReceiveNotification` | `Notification` object | New notification pushed |

The frontend connects to these hubs in `AppShellComponent` after login.

---

## 🔐 Authentication Flow

```
User visits /          → Landing page
User clicks Sign In    → /login
                         POST /auth/login
                         ← { token, user }
                         Token stored in localStorage
                         Redirect to /dashboard

User visits /dashboard → authGuard checks localStorage for token
                         If no token → redirect to /login

Every API call         → authInterceptor adds:
                         Authorization: Bearer <token>

User clicks Logout     → Token cleared from localStorage
                         Redirect to /login
```

---

## 🗺 Pages & Routes

| Route | Component | Auth Required | Description |
|---|---|---|---|
| `/` | `LandingComponent` | No | Marketing landing page |
| `/login` | `LoginComponent` | No | User login |
| `/register` | `RegisterComponent` | No | User registration |
| `/dashboard` | `DashboardComponent` | ✅ Yes | Overview dashboard |
| `/projects` | `ProjectListComponent` | ✅ Yes | All projects grid |
| `/projects/:id` | `ProjectDetailComponent` | ✅ Yes | Project detail (tabs) |
| `/projects/:id/tasks` | `KanbanBoardComponent` | ✅ Yes | Kanban board |
| `/messages` | `MessagesComponent` | ✅ Yes | Direct messages |
| `/messages/:userId` | `MessagesComponent` | ✅ Yes | Chat with specific user |
| `/notifications` | `NotificationsComponent` | ✅ Yes | Notification center |

---

## 📐 Data Models

### User
```typescript
interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold';
  color?: string;
  deadline?: string;
  createdAt: string;
  members: User[];
  taskCount: number;
  completedTaskCount: number;
}
```

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string;
  assigneeId?: string;
  assignee?: User;
  dueDate?: string;
  createdAt: string;
  tags?: string[];
}
```

### Message
```typescript
interface Message {
  id: string;
  content: string;
  senderId: string;
  sender?: User;
  receiverId?: string;
  projectId?: string;
  messageType: 'direct' | 'group';
  isRead: boolean;
  createdAt: string;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'task_assigned' | 'task_updated' | 'task_completed' | 'message_received' | 'mention' | 'project_updated';
  isRead: boolean;
  relatedEntityId?: string;
  createdAt: string;
}
```

---

## 📦 Scripts

```bash
npm start          # Start dev server at http://localhost:4200
npm run build      # Build for production
npm run watch      # Build in watch mode
npm test           # Run unit tests
```

---

## 🐛 Known Issues & Notes

- SignalR connections are established on login and disconnected on logout
- The `assigneeId` field in the Task form expects a valid User ID from the backend's user list
- For production, update CORS origins in `Program.cs` to your deployed frontend URL
- Ensure your backend JWT secret key matches between environments

---

## 👥 Team

This frontend was built as part of a **Hackathon** project.

- **Frontend**: Angular 21, TypeScript, Angular Material, SignalR Client
- **Backend**: C#, ASP.NET Core, Web API, SignalR Server

---

## 📄 License

MIT License — built for the hackathon. Good luck! 🎉
