Project Management Collaboration Tool — Backend setup

Prerequisites
- .NET SDK 10.x installed (dotnet --version >= 10.0)
- Git
- SQLite (optional; the project uses a file-based DB)
- bash shell (for scripts)

Quick setup (development)
1. Clone the repo

   git clone <repo-url> && cd Project_Management_Collaboration_Tool

2. Restore and build

   dotnet restore
   dotnet build

3. Make scripts executable (if needed)

   chmod +x ./scripts/*.sh

4. Configure JWT secret for local/dev runs
- The app reads `Jwt:Key` from configuration. For local safety export an environment variable (recommended):

   export Jwt__Key="replace-with-a-secure-32-char-min-key"

- Note: ASP.NET Core maps `:` to `__` for environment variables.

5. Apply the SQL migration (creates the SQLite DB file used by the API)

   ./scripts/apply_migrations.sh

   This creates `src/Api/ProjectManagement.Api/data/app.db`.

6. Run the API

   cd src/Api/ProjectManagement.Api
   ASPNETCORE_ENVIRONMENT=Development dotnet run --urls http://localhost:5000

7. Run smoke tests (quick end-to-end checks)

   ./scripts/run_smoke_tests.sh

8. Run integration tests

   dotnet test src/Tests/ProjectManagement.IntegrationTests/ProjectManagement.IntegrationTests.csproj

Notes & best practices
- Do NOT commit production secrets. Use environment variables or a secrets store (Azure Key Vault, GitHub Secrets, etc.).
- For CI, set `Jwt__Key` as a repository secret and pass it into the workflow environment.
- This project currently uses a dev JWT key in `appsettings.json` for convenience — replace it before any public deployment.
- If you plan to use EF Core migrations instead of SQL scripts, install `dotnet-ef` matching your SDK and run migrations from the `Infrastructure` project.

Troubleshooting
- "unable to open database file": ensure `src/Api/ProjectManagement.Api/data/` exists and is writable.
- JWT key size errors: ensure `Jwt__Key` is at least 32 characters (256 bits) for HMAC-SHA256.
- If you hit serialization errors in tests (System.Text.Json / PipeWriter), switching MVC to Newtonsoft.Json was applied in this repo — no action needed locally.

If you want, I can scaffold a CI workflow (GitHub Actions) that runs restore, build, applies the migration script, and runs tests on push/PR.