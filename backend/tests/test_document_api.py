import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_template_unknown_slug_returns_404():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/api/document/nonexistent-slug/template")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_template_mutual_nda_returns_fields():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/api/document/mutual-nda/template")
    assert r.status_code == 200
    body = r.json()
    assert body["slug"] == "mutual-nda"
    assert body["name"] == "Mutual Non-Disclosure Agreement"
    assert isinstance(body["fields"], list)
    assert len(body["fields"]) > 0
    assert "Purpose" in body["fields"]
    assert isinstance(body["template_content"], str)
    assert len(body["template_content"]) > 100


@pytest.mark.asyncio
async def test_template_csa_returns_fields():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/api/document/csa/template")
    assert r.status_code == 200
    body = r.json()
    assert body["slug"] == "csa"
    assert len(body["fields"]) > 0


@pytest.mark.asyncio
async def test_all_catalog_slugs_have_templates():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        catalog = (await client.get("/api/catalog")).json()
        for t in catalog["templates"]:
            slug = t["filename"].replace("templates/", "").replace(".md", "").lower()
            r = await client.get(f"/api/document/{slug}/template")
            assert r.status_code == 200, f"Expected 200 for slug '{slug}', got {r.status_code}"


@pytest.mark.asyncio
async def test_document_chat_unknown_slug_returns_404():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.post(
            "/api/document/not-a-real-doc/chat",
            json={"history": [], "message": "hello", "fields": {}},
        )
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_document_chat_response_shape(monkeypatch):
    from app.schemas.document import DocumentChatAIResult, FieldUpdate

    fake_result = DocumentChatAIResult(
        reply="What is the purpose of this NDA?",
        field_updates=[FieldUpdate(field_name="Purpose", value="evaluating a partnership")],
        is_complete=False,
        redirect_slug=None,
    )

    monkeypatch.setattr(
        "app.routers.document.call_structured",
        lambda messages, model: fake_result,
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.post(
            "/api/document/mutual-nda/chat",
            json={"history": [], "message": "I need an NDA for a business deal", "fields": {}},
        )
    assert r.status_code == 200
    body = r.json()
    assert "reply" in body
    assert "fields" in body
    assert body["fields"].get("Purpose") == "evaluating a partnership"
    assert body["redirect_slug"] is None


@pytest.mark.asyncio
async def test_create_chat_response_shape(monkeypatch):
    from app.schemas.document import CreateChatAIResult

    fake_result = CreateChatAIResult(
        reply="That sounds like you need an NDA!",
        redirect_slug="mutual-nda",
        confidence=0.92,
    )

    monkeypatch.setattr(
        "app.routers.document.call_structured",
        lambda messages, model: fake_result,
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.post(
            "/api/create/chat",
            json={"history": [], "message": "I need a non-disclosure agreement"},
        )
    assert r.status_code == 200
    body = r.json()
    assert "reply" in body
    assert body["suggested_slug"] == "mutual-nda"
