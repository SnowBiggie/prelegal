import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/api/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert "version" in body


@pytest.mark.asyncio
async def test_catalog_returns_twelve_templates():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/api/catalog")
    assert r.status_code == 200
    body = r.json()
    assert "templates" in body
    assert len(body["templates"]) == 12


@pytest.mark.asyncio
async def test_catalog_template_shape():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/api/catalog")
    templates = r.json()["templates"]
    for t in templates:
        assert "name" in t
        assert "description" in t
        assert "filename" in t
