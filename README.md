Project Management Collaboration Tool

A real-time project management and team collaboration platform built using Angular, ASP.NET Core Web API, and C#.
This application enables teams to create projects, assign tasks, communicate in real-time, and track progress efficiently.

🚀 Features

🔐 User Authentication & Authorization

📁 Project Creation and Management

✅ Task Assignment and Progress Tracking

💬 Real-Time Direct Messaging

👥 Group Discussions within Projects

🔔 Real-Time Notifications for Task Updates

📊 Project Status Monitoring

⚡ Live Updates using SignalR (Real-Time Communication)

🏗️ Tech Stack
Frontend

Angular

TypeScript

RxJS

Angular Router

Angular Forms (Reactive Forms)

Backend

ASP.NET Core Web API

C#

Entity Framework Core

SignalR (for real-time communication)

JWT Authentication

Database

SQL Server (or In-Memory DB for development)

📂 Project Structure
Project_Management_Collaboration_Tool
│
├── Frontend (Angular)
│   ├── src/app
│   │   ├── components
│   │   ├── services
│   │   ├── models
│   │   ├── guards
│   │   └── interceptors
│
├── Backend (ASP.NET Core)
│   ├── Controllers
│   ├── Services
│   ├── Models
│   ├── Data
│   ├── DTOs
│   └── Hubs (SignalR)
│
└── Database Schema
🧩 System Architecture

The system follows a client-server architecture:

Angular frontend communicates with ASP.NET Core Web API.

Web API handles authentication, business logic, and database operations.

SignalR enables real-time updates for:

Task changes

New messages

Notifications

Entity Framework Core manages database interactions.

🔐 Authentication Flow

Users register/login.

JWT token is generated.

Token is stored on the client side.

Protected API routes validate JWT via middleware.

Role-based authorization controls access.

🗃️ Database Schema Overview
Users

Id

Username

Email

PasswordHash

CreatedAt

Projects

Id

Name

Description

OwnerId (FK → Users)

Tasks

Id

Title

Description

Status

Priority

DueDate

AssignedUserId (FK → Users)

ProjectId (FK → Projects)

Messages

Id

Content

SenderId

ProjectId

CreatedAt

⚙️ Installation & Setup
Backend Setup

Navigate to backend folder:

cd Backend

Restore dependencies:

dotnet restore

Update database:

dotnet ef database update

Run API:

dotnet run

API runs on:

https://localhost:5001
Frontend Setup

Navigate to frontend folder:

cd Frontend

Install dependencies:

npm install

Run Angular app:

ng serve

Application runs on:

http://localhost:4200
🔄 Real-Time Communication

SignalR is used for:

Live task updates

Instant messaging

Project notifications

Frontend connects to SignalR hub on application initialization.

🧪 API Endpoints (Sample)
Authentication

POST /api/auth/register

POST /api/auth/login

Projects

GET /api/projects

POST /api/projects

GET /api/projects/{id}

Tasks

GET /api/tasks/project/{projectId}

POST /api/tasks

PUT /api/tasks/{id}

DELETE /api/tasks/{id}

Messages

GET /api/messages/project/{projectId}

POST /api/messages

🎯 Key Functional Highlights

Modular architecture (Clean separation of concerns)

Scalable backend structure

Secure authentication using JWT

Real-time collaboration with SignalR

Reusable Angular services and components

RESTful API design

📈 Future Improvements

Role-based permissions (Admin, Manager, Member)

File attachments in projects

Activity logs & audit tracking

Email notifications

Deployment using Docker

CI/CD integration

👨‍💻 Contributors

Team #10

📄 License

This project is for educational and hackathon purposes.
