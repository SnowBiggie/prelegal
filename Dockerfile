# Stage 1: Build Next.js static export
FROM node:22-alpine AS frontend-build

WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --prefer-offline
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend
FROM python:3.12-slim AS backend

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

COPY catalog.json ./catalog.json
COPY templates/ ./templates/
COPY backend/ ./backend/

WORKDIR /app/backend
RUN uv sync --frozen --no-dev

COPY --from=frontend-build /build/frontend/out/ /app/frontend/out/

WORKDIR /app

RUN mkdir -p /data

EXPOSE 8000

CMD ["uv", "run", "--directory", "/app/backend", "uvicorn", "app.main:app", \
     "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
