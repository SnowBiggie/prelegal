import catalogData from "../../../../../catalog.json";
import DocumentPageClient from "./DocumentPageClient";

export function generateStaticParams() {
  return catalogData.templates.map((t) => ({
    slug: t.filename
      .replace("templates/", "")
      .replace(".md", "")
      .toLowerCase(),
  }));
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <DocumentPageClient slug={slug} />;
}
