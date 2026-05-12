"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";

interface Props {
  templateContent: string;
  fields: Record<string, string>;
  documentName: string;
}

const FIELD_SPAN_RE =
  /<span\s+class="(?:coverpage|keyterms|orderform|sow|businessterms)_link">([^<]+)<\/span>/g;
const OTHER_SPAN_RE = /<span(?!\s+class="field-blank")[^>]*>(.*?)<\/span>/g;

function preprocessMarkdown(
  content: string,
  fields: Record<string, string>
): string {
  // Replace annotated field spans with values or underlined placeholders
  let processed = content.replace(FIELD_SPAN_RE, (_match, fieldName: string) => {
    const name = fieldName.trim();
    const value = fields[name];
    return value && value.trim()
      ? `**${value}**`
      : `<span class="field-blank">${name}</span>`;
  });

  // Strip remaining non-field spans (e.g. header_2, header_3), keeping their text
  processed = processed.replace(OTHER_SPAN_RE, "$1");

  return processed;
}

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-brand-navy mb-4 mt-6">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-brand-navy mb-3 mt-5 uppercase tracking-wide">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-brand-navy mb-2 mt-4">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-3 text-gray-800">{children}</p>,
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>
  ),
  table: ({ children }) => (
    <table className="w-full border-collapse text-sm mb-4">{children}</table>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-3 py-2">{children}</td>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-brand-blue underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
};

export default function DocumentPreview({ templateContent, fields, documentName }: Props) {
  const total = Object.keys(fields).length;
  const filled = Object.values(fields).filter((v) => v.trim() !== "").length;
  const processed = preprocessMarkdown(templateContent, fields);

  return (
    <div className="flex flex-col h-full print:h-auto print:block">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 print:hidden shrink-0">
        <h2 className="text-base font-semibold text-brand-navy">Document Preview</h2>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <span className="text-xs text-brand-gray">
              {filled} of {total} fields filled
            </span>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-brand-purple hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded shadow-sm transition-opacity print:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M4 8h16M8 4h8a2 2 0 012 2v2H6V6a2 2 0 012-2z"
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Document */}
      <div
        className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm px-10 py-10 text-sm leading-relaxed text-gray-800 print:flex-none print:h-auto print:border-0 print:shadow-none print:px-0 print:py-0 print:overflow-visible"
      >
        <style>{`
          .field-blank {
            display: inline-block;
            border-bottom: 2px dashed #a5b4fc;
            color: #a5b4fc;
            font-style: italic;
            min-width: 6rem;
            padding: 0 0.25rem;
          }
        `}</style>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={mdComponents}
        >
          {processed}
        </ReactMarkdown>
      </div>
    </div>
  );
}
