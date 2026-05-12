from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.database import create_tables
from app.routers import catalog, health

_STATIC_DIR = Path(__file__).parent.parent.parent / "frontend" / "out"


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await create_tables()
    yield


app = FastAPI(title="Prelegal API", version="0.1.0", lifespan=lifespan)

# API routes must be registered before the static file mount
app.include_router(health.router, prefix="/api")
app.include_router(catalog.router, prefix="/api")

# Serve static Next.js export — only available after `npm run build`
if _STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(_STATIC_DIR), html=True), name="static")
