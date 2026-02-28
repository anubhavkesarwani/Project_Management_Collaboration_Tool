# 🚀 Project Management Collaboration Tool

A real-time Project Management Collaboration Tool built using:

-   Frontend: Angular (TypeScript)
-   Backend: ASP.NET Core Web API (C#)
-   Database: SQL Server
-   Real-time Communication: SignalR
-   Authentication: JWT Token-based Authentication

------------------------------------------------------------------------

## 📌 Project Overview

This application allows teams to:

-   Create and manage projects
-   Assign tasks to users
-   Track task progress
-   Send direct messages
-   Participate in group discussions
-   Receive real-time notifications for updates

The system ensures secure access control and real-time synchronization
across users.

------------------------------------------------------------------------

## 🏗️ Architecture

Angular Frontend → ASP.NET Core Web API → SQL Server Database\
↓\
SignalR Hub

-   Angular handles UI and client-side logic\
-   ASP.NET Core Web API handles business logic\
-   SQL Server stores data\
-   SignalR enables real-time updates

------------------------------------------------------------------------

## ✨ Features

### 🔐 Authentication & Authorization

-   User Registration\
-   User Login\
-   JWT-based authentication\
-   Role-based project access

### 📁 Project Management

-   Create Project\
-   Update Project\
-   Delete Project\
-   View Projects\
-   Manage Project Members

### ✅ Task Management

-   Create Tasks\
-   Assign Tasks to Users\
-   Update Task Status\
-   Track Progress\
-   Due Date Management

### 💬 Communication

-   Direct Messaging\
-   Group Discussions\
-   Real-time Chat using SignalR

### 🔔 Notifications

-   Task updates\
-   New messages\
-   Project changes\
-   Real-time alerts

------------------------------------------------------------------------

## 🗄️ Database Schema (Core Tables)

-   Users\
-   Projects\
-   ProjectMembers\
-   Tasks\
-   Messages\
-   Notifications

------------------------------------------------------------------------

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/project-management-tool.git\
cd project-management-tool

------------------------------------------------------------------------

### 2️⃣ Backend Setup (ASP.NET Core)

cd Backend\
dotnet restore\
dotnet ef database update\
dotnet run

Backend runs on:\
https://localhost:5001

------------------------------------------------------------------------

### 3️⃣ Frontend Setup (Angular)

cd Frontend\
npm install\
ng serve

Frontend runs on:\
http://localhost:4200

------------------------------------------------------------------------

## 🔑 API Endpoints

### Authentication

POST /api/auth/register - Register new user\
POST /api/auth/login - Login user

### Projects

GET /api/projects - Get all projects\
POST /api/projects - Create project\
PUT /api/projects/{id} - Update project\
DELETE /api/projects/{id} - Delete project

### Tasks

GET /api/tasks/project/{id} - Get project tasks\
POST /api/tasks - Create task\
PUT /api/tasks/{id} - Update task\
DELETE /api/tasks/{id} - Delete task

------------------------------------------------------------------------

## 🔄 Real-Time Communication (SignalR)

Hub Endpoint:\
/hubs/notificationHub

Handles: - Live task updates\
- Instant messaging\
- Notifications

------------------------------------------------------------------------

## 🛡️ Security

-   Password hashing\
-   JWT authentication\
-   Role-based authorization\
-   Secure API endpoints

------------------------------------------------------------------------

## 📊 Future Improvements

-   File attachments\
-   Activity logs\
-   Dashboard analytics\
-   Email notifications\
-   Mobile responsive optimization\
-   Docker containerization

------------------------------------------------------------------------

## 🧠 Learning Outcomes

This project demonstrates:

-   Full-stack development\
-   RESTful API design\
-   Real-time systems with SignalR\
-   Authentication & Authorization\
-   Database relationships & EF Core\
-   Scalable architecture principles

------------------------------------------------------------------------

## 📄 License

This project is developed for educational and hackathon purposes.

------------------------------------------------------------------------

## 👨‍💻 Author

Developed as a Full Stack Project using Angular and ASP.NET Core.
