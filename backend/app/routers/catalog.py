import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.schemas.catalog import CatalogResponse

router = APIRouter(tags=["catalog"])

# catalog.json lives at the repo root. In Docker (WORKDIR=/app) it's at /app/catalog.json.
# Locally it is four .parent calls up from this file.
_CATALOG_PATH = Path(__file__).parent.parent.parent.parent / "catalog.json"

try:
    _catalog = CatalogResponse(**json.loads(_CATALOG_PATH.read_text(encoding="utf-8")))
except FileNotFoundError:
    _catalog = None


@router.get("/catalog", response_model=CatalogResponse)
async def get_catalog() -> CatalogResponse:
    if _catalog is None:
        raise HTTPException(status_code=500, detail="catalog.json not found")
    return _catalog
