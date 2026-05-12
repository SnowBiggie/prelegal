import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.schemas.document import (
    CreateChatAIResult,
    CreateChatRequest,
    CreateChatResponse,
    DocumentChatAIResult,
    DocumentChatRequest,
    DocumentChatResponse,
    TemplateResponse,
)
from app.utils.ai_client import call_structured
from app.utils.template_parser import get_template

router = APIRouter(tags=["document"])

_CATALOG_PATH = Path(__file__).parent.parent.parent.parent / "catalog.json"

try:
    _catalog: list[dict] = json.loads(_CATALOG_PATH.read_text(encoding="utf-8"))["templates"]
except FileNotFoundError:
    _catalog = []


def _find_entry(slug: str) -> dict | None:
    for t in _catalog:
        if Path(t["filename"]).stem.lower() == slug:
            return t
    return None


def _all_slugs() -> list[dict]:
    return [
        {"slug": Path(t["filename"]).stem.lower(), "name": t["name"]}
        for t in _catalog
    ]


def _document_system_prompt(doc_name: str, doc_description: str, fields: list[str], current: dict[str, str]) -> str:
    field_status = "\n".join(
        f"  {i + 1}. {f}: {'\"' + current[f] + '\"' if current.get(f) else '(not yet provided)'}"
        for i, f in enumerate(fields)
    )
    supported = json.dumps(_all_slugs(), indent=2)
    return f"""You are a friendly legal document assistant helping a user complete a {doc_name}.

{doc_description}

Your goal is to conversationally collect the following required fields. Ask about one or two fields at a time in a natural, approachable way. Once a field is confirmed, move on to the next.

REQUIRED FIELDS:
{field_status}

INSTRUCTIONS:
- Be friendly and concise. Avoid overly formal or legal language.
- Only include field_updates for fields the user explicitly confirmed in their latest message.
- field_name in field_updates must exactly match a name from the REQUIRED FIELDS list above.
- Set is_complete to true only when ALL {len(fields)} required fields have been collected.
- If the user asks for a completely different document type, set redirect_slug to the matching slug from the supported list and explain the redirect in your reply. Otherwise set redirect_slug to null.

SUPPORTED DOCUMENT SLUGS (for redirect_slug only, never show slugs to the user):
{supported}"""


def _create_system_prompt() -> str:
    catalog_summary = "\n".join(
        f"  - {t['name']} (slug: {Path(t['filename']).stem.lower()}): {t['description']}"
        for t in _catalog
    )
    return f"""You are a friendly legal document assistant on the Prelegal platform. Your job is to understand what legal document the user needs and direct them to the right template.

AVAILABLE DOCUMENTS:
{catalog_summary}

INSTRUCTIONS:
- Ask what the user needs. Ask clarifying questions if the request is ambiguous.
- When confident (confidence >= 0.85) which document they need, set redirect_slug to that document's slug.
- If the user needs something not in the list, suggest the closest matching document and explain why.
- Keep responses friendly, brief, and helpful.
- Never mention slug values to the user — only use document names.
- Set confidence to a value between 0.0 and 1.0 reflecting how certain you are about the match."""


@router.get("/document/{slug}/template", response_model=TemplateResponse)
def get_template_endpoint(slug: str) -> TemplateResponse:
    entry = _find_entry(slug)
    if entry is None:
        raise HTTPException(status_code=404, detail=f"No template for slug '{slug}'")
    try:
        content, fields = get_template(slug)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Template file not found")
    return TemplateResponse(
        slug=slug,
        name=entry["name"],
        description=entry["description"],
        fields=fields,
        template_content=content,
    )


@router.post("/document/{slug}/chat", response_model=DocumentChatResponse)
def document_chat(slug: str, body: DocumentChatRequest) -> DocumentChatResponse:
    entry = _find_entry(slug)
    if entry is None:
        raise HTTPException(status_code=404, detail=f"No template for slug '{slug}'")

    try:
        _, fields_list = get_template(slug)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Template file not found")

    system_prompt = _document_system_prompt(
        doc_name=entry["name"],
        doc_description=entry["description"],
        fields=fields_list,
        current=body.fields,
    )

    messages = [{"role": "system", "content": system_prompt}]
    for msg in body.history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": body.message})

    try:
        ai_result = call_structured(messages, DocumentChatAIResult)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {e}")

    updated_fields = dict(body.fields)
    for upd in ai_result.field_updates:
        if upd.field_name in updated_fields or upd.field_name in fields_list:
            updated_fields[upd.field_name] = upd.value

    return DocumentChatResponse(
        reply=ai_result.reply,
        fields=updated_fields,
        redirect_slug=ai_result.redirect_slug,
    )


@router.post("/create/chat", response_model=CreateChatResponse)
def create_chat(body: CreateChatRequest) -> CreateChatResponse:
    system_prompt = _create_system_prompt()

    messages = [{"role": "system", "content": system_prompt}]
    for msg in body.history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": body.message})

    try:
        ai_result = call_structured(messages, CreateChatAIResult)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {e}")

    return CreateChatResponse(
        reply=ai_result.reply,
        suggested_slug=ai_result.redirect_slug if (ai_result.confidence or 0) >= 0.85 else None,
    )
