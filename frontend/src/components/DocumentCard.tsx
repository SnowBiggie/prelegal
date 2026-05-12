import type { CatalogTemplate } from "@/types/catalog";
import { deriveSlug } from "@/lib/api";

interface Props {
  template: CatalogTemplate;
}

const ACCENTS = ["border-brand-blue", "border-brand-purple", "border-brand-yellow"];

function accentFor(name: string): string {
  return ACCENTS[name.charCodeAt(0) % ACCENTS.length];
}

function hrefFor(filename: string): string {
  const slug = deriveSlug(filename);
  return slug === "mutual-nda" ? "/nda/" : `/document/${slug}/`;
}

export default function DocumentCard({ template }: Props) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-t-4 ${accentFor(template.name)}
                  p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}
    >
      <h2 className="text-sm font-semibold text-brand-navy leading-snug">
        {template.name}
      </h2>
      <p className="text-xs text-brand-gray leading-relaxed flex-1">
        {template.description}
      </p>
      <a
        href={hrefFor(template.filename)}
        className="mt-auto self-start text-xs font-medium text-brand-blue hover:underline"
      >
        Draft document →
      </a>
    </div>
  );
}
