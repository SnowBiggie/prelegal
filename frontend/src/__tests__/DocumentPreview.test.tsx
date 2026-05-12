import React from "react";
import { render, screen } from "@testing-library/react";

// preprocessMarkdown is not exported; test via rendered output
// We import the component directly since jest can render it
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));
jest.mock("remark-gfm", () => ({ __esModule: true, default: () => {} }));
jest.mock("rehype-raw", () => ({ __esModule: true, default: () => {} }));

import DocumentPreview from "@/components/DocumentPreview";

const TEMPLATE_WITH_SPANS = `# Test Doc
Some text <span class="coverpage_link">Customer</span> and <span class="keyterms_link">Provider</span>.`;

const TEMPLATE_BRACKET = `### Purpose
[Some default purpose text here]`;

describe("DocumentPreview – field substitution", () => {
  it("renders filled field values in place of span annotations", () => {
    render(
      <DocumentPreview
        templateContent={TEMPLATE_WITH_SPANS}
        fields={{ Customer: "Acme Inc", Provider: "TechCorp" }}
        documentName="Test Doc"
      />
    );
    const md = screen.getByTestId("markdown");
    expect(md.textContent).toContain("**Acme Inc**");
    expect(md.textContent).toContain("**TechCorp**");
  });

  it("renders field-blank spans for unfilled fields", () => {
    render(
      <DocumentPreview
        templateContent={TEMPLATE_WITH_SPANS}
        fields={{ Customer: "", Provider: "" }}
        documentName="Test Doc"
      />
    );
    const md = screen.getByTestId("markdown");
    expect(md.textContent).toContain('class="field-blank"');
  });

  it("shows correct field progress count", () => {
    render(
      <DocumentPreview
        templateContent={TEMPLATE_WITH_SPANS}
        fields={{ Customer: "Acme Inc", Provider: "" }}
        documentName="Test Doc"
      />
    );
    expect(screen.getByText("1 of 2 fields filled")).toBeInTheDocument();
  });

  it("hides progress when fields object is empty", () => {
    render(
      <DocumentPreview
        templateContent="# Doc"
        fields={{}}
        documentName="Test Doc"
      />
    );
    expect(screen.queryByText(/fields filled/)).not.toBeInTheDocument();
  });

  it("renders the Download PDF button", () => {
    render(
      <DocumentPreview
        templateContent="# Doc"
        fields={{}}
        documentName="Test Doc"
      />
    );
    expect(screen.getByText("Download PDF")).toBeInTheDocument();
  });
});
