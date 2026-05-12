import re
from pathlib import Path

SPAN_FIELD_RE = re.compile(
    r'<span\s+class="(?:coverpage|keyterms|orderform|sow|businessterms)_link">([^<]+)</span>'
)
HEADER3_FIELD_RE = re.compile(r"^### (.+?)$", re.MULTILINE)

_TEMPLATES_DIR = Path(__file__).parent.parent.parent.parent / "templates"


def _slug_to_path(slug: str) -> Path:
    for path in _TEMPLATES_DIR.glob("*.md"):
        if path.stem.lower() == slug:
            return path
    raise FileNotFoundError(f"No template found for slug '{slug}'")


def parse_fields(content: str) -> list[str]:
    seen: set[str] = set()
    fields: list[str] = []

    for m in SPAN_FIELD_RE.finditer(content):
        name = m.group(1).strip()
        if name and name not in seen:
            seen.add(name)
            fields.append(name)

    # Fallback for cover-page style templates that use ### headers
    if not fields:
        for m in HEADER3_FIELD_RE.finditer(content):
            name = m.group(1).strip()
            if name and name not in seen:
                seen.add(name)
                fields.append(name)

    return fields


def get_template(slug: str) -> tuple[str, list[str]]:
    path = _slug_to_path(slug)
    content = path.read_text(encoding="utf-8")
    return content, parse_fields(content)
