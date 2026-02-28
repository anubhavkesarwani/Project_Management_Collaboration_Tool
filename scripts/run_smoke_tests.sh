#!/usr/bin/env bash
set -euo pipefail

BASE_URL="http://localhost:5000"
echo "Running integration smoke tests against $BASE_URL"

http() {
  local method=$1; shift
  local url="$BASE_URL$1"; shift
  if [[ -n "${TOKEN-}" ]]; then
    if [[ "$method" == "GET" || "$method" == "get" ]]; then
      curl -sS -X "$method" "$url" -H "Content-Type: application/json" -H "Authorization: Bearer ${TOKEN}"
    else
      if [ "$#" -gt 0 ]; then
        curl -sS -X "$method" "$url" -H "Content-Type: application/json" -H "Authorization: Bearer ${TOKEN}" -d "$@"
      else
        curl -sS -X "$method" "$url" -H "Content-Type: application/json" -H "Authorization: Bearer ${TOKEN}"
      fi
    fi
  else
    if [[ "$method" == "GET" || "$method" == "get" ]]; then
      curl -sS -X "$method" "$url" -H "Content-Type: application/json"
    else
      if [ "$#" -gt 0 ]; then
        curl -sS -X "$method" "$url" -H "Content-Type: application/json" -d "$@"
      else
        curl -sS -X "$method" "$url" -H "Content-Type: application/json"
      fi
    fi
  fi
}

echo "Create user A"
userA=$(http POST /api/users '{"Username":"alice","Email":"alice@example.com","PasswordHash":"hash","CreatedAt":"2026-02-28T00:00:00Z"}')
echo "$userA"

echo "Create user B"
userB=$(http POST /api/users '{"Username":"bob","Email":"bob@example.com","PasswordHash":"hash","CreatedAt":"2026-02-28T00:00:00Z"}')
echo "$userB"

echo "Create project"
proj=$(http POST /api/projects '{"Name":"Proj1","Description":"Test project","OwnerId":1}')
echo "$proj"

echo "Create task"
task=$(http POST /api/tasks '{"Title":"T1","Description":"Do thing","Status":"Open","ProjectId":1,"AssigneeId":1}')
echo "$task"

echo "Send project message"
msg=$(http POST /api/messages '{"SenderId":1,"ProjectId":1,"ReceiverId":null,"ParentId":null,"Content":"Hello project"}')
echo "$msg"

echo "List project messages"
http GET /api/messages/project/1

echo "List tasks for project"
http GET /api/tasks/project/1

echo "Create notification"
http POST /api/notifications '{"UserId":1,"Content":"Task assigned","IsRead":false,"Type":"Task","ReferenceId":1}'

echo "List notifications for user"
http GET /api/notifications/user/1

echo "Smoke tests completed"

echo "Attempt auth login as alice"
login=$(curl -sS -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d '{"Username":"alice","Password":"hash"}')
TOKEN=$(echo "$login" | sed -n 's/.*"token" *: *"\([^"]*\)".*/\1/p')
echo "Token: ${TOKEN:0:8}..."

echo "Test update task status"
http PUT /api/tasks/1/status '"InProgress"'

echo "Test update message content"
http PUT /api/messages/1 '{"Content":"Edited message"}'

echo "Test delete message"
http DELETE /api/messages/1

echo "Test delete task"
http DELETE /api/tasks/1

echo "Test delete notification"
http DELETE /api/notifications/1

echo "Extended smoke tests completed"
