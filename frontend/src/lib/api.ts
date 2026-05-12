import type { CatalogResponse } from "@/types/catalog";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchCatalog(): Promise<CatalogResponse> {
  const res = await fetch(`${BASE}/api/catalog`);
  if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status}`);
  return res.json();
}
