import type { CatalogTemplate } from "@/types/catalog";

interface Props {
  template: CatalogTemplate;
}

const ACCENTS = ["border-brand-blue", "border-brand-purple", "border-brand-yellow"];

function accentFor(name: string): string {
  return ACCENTS[name.charCodeAt(0) % ACCENTS.length];
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
      <button
        className="mt-auto self-start text-xs font-medium text-brand-blue
                   hover:underline focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        disabled
        title="Coming in a future release"
      >
        Draft document →
      </button>
    </div>
  );
}
