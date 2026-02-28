using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;

namespace SignalR.Client
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var hubUrl = args.Length > 0 ? args[0] : "http://localhost:5000/hubs/collaboration";
            var userId = args.Length > 1 ? int.Parse(args[1]) : 1001;
            var projectId = args.Length > 2 ? int.Parse(args[2]) : 42;

            Console.WriteLine($"Connecting to {hubUrl}");

            var connection = new HubConnectionBuilder()
                .WithUrl(hubUrl)
                .Build();

            connection.On<object>("ReceiveMessage", payload =>
            {
                Console.WriteLine("[ReceiveMessage] " + System.Text.Json.JsonSerializer.Serialize(payload));
            });

            connection.On<object>("TaskUpdated", payload =>
            {
                Console.WriteLine("[TaskUpdated] " + System.Text.Json.JsonSerializer.Serialize(payload));
            });

            await connection.StartAsync();
            Console.WriteLine("Connected.");

            // Register user (server keeps in-memory mapping)
            await connection.InvokeAsync("RegisterUser", userId);
            Console.WriteLine($"Registered user {userId}");

            // Join project group
            await connection.InvokeAsync("JoinProject", projectId);
            Console.WriteLine($"Joined project group {projectId}");

            // Send a group message
            var message = new
            {
                SenderId = userId,
                ProjectId = projectId as int?,
                ReceiverId = (int?)null,
                ParentId = (int?)null,
                Content = "Hello from SignalR client (group)"
            };

            await connection.InvokeAsync("SendMessage", message);
            Console.WriteLine("Sent group message.");

            // Send a DM to another user (1002)
            var dm = new
            {
                SenderId = userId,
                ProjectId = (int?)null,
                ReceiverId = (int?)1002,
                ParentId = (int?)null,
                Content = "Hello DM to 1002"
            };

            await connection.InvokeAsync("SendMessage", dm);
            Console.WriteLine("Sent DM message to 1002.");

            Console.WriteLine("Listening for incoming messages for 10 seconds...");
            await Task.Delay(TimeSpan.FromSeconds(10));

            await connection.InvokeAsync("UnregisterUser", userId);
            await connection.StopAsync();
            Console.WriteLine("Disconnected");
        }
    }
}
