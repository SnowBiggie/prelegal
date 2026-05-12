from typing import Optional
from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str
    content: str


class TemplateResponse(BaseModel):
    slug: str
    name: str
    description: str
    fields: list[str]
    template_content: str


class DocumentChatRequest(BaseModel):
    history: list[ChatMessage]
    message: str
    fields: dict[str, str]


class DocumentChatResponse(BaseModel):
    reply: str
    fields: dict[str, str]
    redirect_slug: Optional[str] = None


class CreateChatRequest(BaseModel):
    history: list[ChatMessage]
    message: str


class CreateChatResponse(BaseModel):
    reply: str
    suggested_slug: Optional[str] = None


# ---- AI structured output models ----

class FieldUpdate(BaseModel):
    field_name: str
    value: str


class DocumentChatAIResult(BaseModel):
    reply: str
    field_updates: list[FieldUpdate]
    is_complete: bool
    redirect_slug: Optional[str] = None


class CreateChatAIResult(BaseModel):
    reply: str
    redirect_slug: Optional[str] = None
    confidence: float = 0.0
