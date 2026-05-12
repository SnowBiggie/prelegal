# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The catalog currently contains 12 document types (see catalog.json).

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b:free` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
The frontend is statically built (`npm run build` → `out/`) and served by FastAPI via `StaticFiles`.  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032247` (headings)
- Gray Text: `#888888`

## Implementation Status

### Done (V1 Foundation — PL-4)
- **Docker**: multi-stage build (Node frontend + Python backend), `docker-compose.yml`, start/stop scripts for Mac/Linux/Windows
- **Backend**: FastAPI (uv project), `GET /api/health`, `GET /api/catalog` endpoints; SQLite DB (`/data/prelegal.db`) with `users` table created on startup
- **Frontend**: Next.js 15 statically built and served via FastAPI `StaticFiles`
  - `/` — landing/home page
  - `/login` — login page (localStorage-only fake auth, no backend auth API yet)
  - `/dashboard` — lists all 12 document types from the catalog
  - `/nda` — Mutual NDA creator (PL-3, AI-assisted PDF generation)

### Not yet implemented
- Backend auth API (sign up / sign in endpoints, JWT/session)
- AI chat interface for document drafting (beyond the NDA page)
- Document persistence (saving drafted documents per user)
- Per-document pages for the other 11 template types

