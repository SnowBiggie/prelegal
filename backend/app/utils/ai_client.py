import os
from pathlib import Path
from typing import TypeVar, Type

from litellm import completion
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent.parent.parent / ".env")
except ImportError:
    pass

MODEL = "openrouter/openai/gpt-oss-120b:free"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

T = TypeVar("T", bound=BaseModel)


def call_structured(messages: list[dict], response_model: Type[T]) -> T:
    response = completion(
        model=MODEL,
        messages=messages,
        response_format=response_model,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
    )
    content = response.choices[0].message.content
    if content is None:
        raise ValueError("Model returned no content in message; structured output may have been routed via tool_calls.")
    return response_model.model_validate_json(content)
