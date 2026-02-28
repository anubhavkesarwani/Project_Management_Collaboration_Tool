#!/usr/bin/env bash
set -euo pipefail

DB=src/Api/ProjectManagement.Api/data/app.db
SQL=docs/migrations/InitialCreate.sql

mkdir -p "$(dirname "$DB")"
if [ ! -f "$DB" ]; then
  sqlite3 "$DB" < "$SQL"
  echo "Database created and schema applied to $DB"
else
  sqlite3 "$DB" < "$SQL"
  echo "Schema applied to existing database $DB"
fi
