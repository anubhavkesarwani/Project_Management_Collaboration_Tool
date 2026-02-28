using Microsoft.EntityFrameworkCore;
using ProjectManagement.Api.Hubs;
using ProjectManagement.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ProjectManagement.Infrastructure.Persistence;
using ProjectManagement.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

builder.Services.AddSignalR();
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        // Avoid serialization issues with TestServer's pipe writer and EF navigation loops
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => options.AddDefaultPolicy(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));

// Authentication (simple JWT for prototyping)
var jwtKey = builder.Configuration["Jwt:Key"] ?? "dev-secret-key-change-me";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "ProjectMgmtApi";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// Repositories
builder.Services.AddScoped<ProjectManagement.Core.Interfaces.IUserRepository, ProjectManagement.Infrastructure.Repositories.UserRepository>();
builder.Services.AddScoped<ProjectManagement.Core.Interfaces.IProjectRepository, ProjectManagement.Infrastructure.Repositories.ProjectRepository>();
builder.Services.AddScoped<ProjectManagement.Core.Interfaces.ITaskRepository, ProjectManagement.Infrastructure.Repositories.TaskRepository>();
builder.Services.AddScoped<ProjectManagement.Core.Interfaces.IMessageRepository, ProjectManagement.Infrastructure.Repositories.MessageRepository>();
builder.Services.AddScoped<ProjectManagement.Core.Interfaces.INotificationRepository, ProjectManagement.Infrastructure.Repositories.NotificationRepository>();

var connection = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=./data/app.db;Cache=Shared";
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connection));

builder.Services.AddScoped<TaskService>();
builder.Services.AddScoped<DataSeeder>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ensure database exists and schema is created for development/testing.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Seed sample data for development when DB is empty
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await seeder.SeedAsync();
}

app.MapControllers();
app.MapHub<CollaborationHub>("/hubs/collaboration");

app.Run();

// Expose Program class for integration testing (WebApplicationFactory requires a Program type)
public partial class Program { }
