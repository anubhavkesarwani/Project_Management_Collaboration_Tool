# Project Management Collaboration Tool — MVP scaffold

This workspace contains a Clean/Onion architecture scaffold (MVP Phase 1) using .NET 8 and SQLite for prototyping.

Quick start (Arch Linux):

```bash
# from repository root
dotnet restore
dotnet build
cd src/Api/ProjectManagement.Api
dotnet run
```

Default SQLite DB: `./data/app.db` (appsettings.json connection string)
