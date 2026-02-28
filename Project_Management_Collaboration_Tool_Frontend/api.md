Frontend Integration Guide — Backend API

Base URL
- http://localhost:5000

Authentication
- JWT Bearer tokens
- Get token: POST /api/auth/login with JSON `{ "username": "...", "password": "..." }` → `{ "token": "..." }`
- Include token in requests: `Authorization: Bearer <token>`
- For SignalR, use `accessTokenFactory` to provide the token when building the Hub connection.

Swagger
- UI available (dev): http://localhost:5000/swagger
- Full machine-readable OpenAPI spec: `docs/openapi.yaml` (use to generate TypeScript/Angular client)

SignalR
- Hub URL: `/hubs/collaboration`
- Client example (SignalR JS):
```js
import * as signalR from '@microsoft/signalr';
const connection = new signalR.HubConnectionBuilder()
  .withUrl('http://localhost:5000/hubs/collaboration', { accessTokenFactory: () => token })
  .withAutomaticReconnect()
  .build();

connection.on('ReceiveMessage', msg => console.log('msg', msg));
await connection.start();
```

Endpoint mapping & quick notes
- Auth
  - `POST /api/auth/login` — login, returns `{ token }`.
- Users
  - `GET /api/users` — list
  - `POST /api/users` — create (signup): send `{ username, email, password }` (server hashes)
  - `GET /api/users/{id}`
  - `PUT /api/users/{id}` (auth)
  - `DELETE /api/users/{id}` (auth)
- Projects
  - `GET /api/projects`, `GET /api/projects/{id}`
  - `POST /api/projects` (auth) — `{ name, description, ownerId }`
  - `PUT /api/projects/{id}`, `DELETE /api/projects/{id}` (owner only)
- Tasks
  - `GET /api/tasks/project/{projectId}`
  - `POST /api/tasks` (auth) — `{ title, description, status, projectId, assigneeId }`
  - `PUT /api/tasks/{id}`, `PUT /api/tasks/{id}/status`, `DELETE /api/tasks/{id}`
- Messages
  - `GET /api/messages/project/{projectId}`
  - `GET /api/messages/dm/{userA}/{userB}`
  - `POST /api/messages` (auth) — `{ senderId, projectId?, receiverId?, parentId?, content }`
  - `PUT/DELETE /api/messages/{id}` (auth; sender only)
- Notifications
  - `GET /api/notifications/user/{userId}`
  - `POST /api/notifications` (auth) — create
  - `PUT /api/notifications/{id}/read` (auth)
  - `DELETE /api/notifications/{id}` (auth; owner only)

Error handling
- Uses HTTP status codes. When available, returns RFC 7807 ProblemDetails JSON.
- `204 NoContent` responses return empty body.

Pagination
- Not implemented — endpoints return full lists. We can add `?page=`/`?pageSize=` if needed.

Sample request (login + create project)
1) Login
```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password"}' | jq
```
2) Create project (replace `<TOKEN>`)
```bash
curl -i -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"MyFrontendProj","description":"Created from frontend","ownerId":1}'
```

Notes for frontend devs
- Use the `docs/openapi.yaml` to generate a client (e.g. OpenAPI Generator or NSwag/Swagger Codegen).
- For local development use `http://localhost:5000` and `http://localhost:4200` for the Angular app. CORS is permissive in dev.
- If you need sample form models or stub responses, I can generate a Postman collection or an `http` file.
