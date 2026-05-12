import type { CatalogResponse } from "@/types/catalog";
import type {
  CreateChatRequest,
  CreateChatResponse,
  DocumentChatRequest,
  DocumentChatResponse,
  TemplateResponse,
} from "@/types/document";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function deriveSlug(filename: string): string {
  return filename.replace("templates/", "").replace(".md", "").toLowerCase();
}

export async function fetchCatalog(): Promise<CatalogResponse> {
  const res = await fetch(`${BASE}/api/catalog`);
  if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchTemplate(slug: string): Promise<TemplateResponse> {
  const res = await fetch(`${BASE}/api/document/${slug}/template`);
  if (!res.ok) throw new Error(`Template fetch failed: ${res.status}`);
  return res.json();
}

export async function postDocumentChat(
  slug: string,
  body: DocumentChatRequest
): Promise<DocumentChatResponse> {
  const res = await fetch(`${BASE}/api/document/${slug}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  return res.json();
}

export async function postCreateChat(
  body: CreateChatRequest
): Promise<CreateChatResponse> {
  const res = await fetch(`${BASE}/api/create/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Create chat failed: ${res.status}`);
  return res.json();
}
