import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import NdaPreview from "@/components/NdaPreview";
import { NdaFormData, defaultNdaFormData } from "@/types/nda";

const filledData: NdaFormData = {
  purpose: "Evaluating a potential partnership",
  effectiveDate: "2026-01-15",
  mndaTermType: "expires",
  mndaTermYears: 2,
  confidentialityTermType: "years",
  confidentialityTermYears: 3,
  governingLaw: "Delaware",
  jurisdiction: "Wilmington, Delaware",
  modifications: "Section 8 is amended to include limited warranty.",
  party1: {
    name: "Alice Johnson",
    title: "CEO",
    company: "Acme Corp",
    noticeAddress: "123 Main St, Wilmington, DE 19801",
  },
  party2: {
    name: "Bob Williams",
    title: "CTO",
    company: "Beta LLC",
    noticeAddress: "456 Oak Ave, Dover, DE 19901",
  },
};

const emptyData: NdaFormData = {
  ...defaultNdaFormData,
  purpose: "",
  effectiveDate: "",
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: { name: "", title: "", company: "", noticeAddress: "" },
  party2: { name: "", title: "", company: "", noticeAddress: "" },
};

beforeEach(() => {
  window.print = jest.fn();
});

describe("NdaPreview – document structure", () => {
  it("renders the document title", () => {
    render(<NdaPreview data={filledData} />);
    expect(
      screen.getByText("Mutual Non-Disclosure Agreement")
    ).toBeInTheDocument();
  });

  it("renders the Common Paper version attribution", () => {
    render(<NdaPreview data={filledData} />);
    expect(
      screen.getByText(/Common Paper Mutual NDA Standard Terms Version 1\.0/i)
    ).toBeInTheDocument();
  });

  it("renders the Cover Page section", () => {
    render(<NdaPreview data={filledData} />);
    expect(screen.getByText("Cover Page")).toBeInTheDocument();
  });

  it("renders the Standard Terms section heading", () => {
    render(<NdaPreview data={filledData} />);
    expect(screen.getByText("Standard Terms")).toBeInTheDocument();
  });

  it("renders all 11 numbered clauses", () => {
    render(<NdaPreview data={filledData} />);
    const headings = [
      /1\.\s+Introduction/,
      /2\.\s+Use and Protection/,
      /3\.\s+Exceptions/,
      /4\.\s+Disclosures Required by Law/,
      /5\.\s+Term and Termination/,
      /6\.\s+Return or Destruction/,
      /7\.\s+Proprietary Rights/,
      /8\.\s+Disclaimer/,
      /9\.\s+Governing Law and Jurisdiction/,
      /10\.\s+Equitable Relief/,
      /11\.\s+General/,
    ];
    headings.forEach((pattern) => {
      expect(screen.getByText(pattern)).toBeInTheDocument();
    });
  });

  it("renders the signature table with correct row labels", () => {
    render(<NdaPreview data={filledData} />);
    ["Signature", "Print Name", "Title", "Company", "Notice Address"].forEach(
      (label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      }
    );
  });

  it("renders the CC BY 4.0 attribution link", () => {
    render(<NdaPreview data={filledData} />);
    expect(screen.getByText(/CC BY 4\.0/i)).toBeInTheDocument();
  });

  it("renders the Download PDF button", () => {
    render(<NdaPreview data={filledData} />);
    expect(
      screen.getByRole("button", { name: /download pdf/i })
    ).toBeInTheDocument();
  });
});

describe("NdaPreview – filled data interpolation", () => {
  it("shows the purpose text in the cover page and clause 1 and clause 2", () => {
    render(<NdaPreview data={filledData} />);
    const purposeNodes = screen.getAllByText("Evaluating a potential partnership");
    expect(purposeNodes.length).toBeGreaterThanOrEqual(2);
  });

  it("formats the effective date as a human-readable string", () => {
    render(<NdaPreview data={filledData} />);
    expect(screen.getAllByText("January 15, 2026").length).toBeGreaterThan(0);
  });

  it("shows the MNDA term year count in the cover page", () => {
    const { container } = render(<NdaPreview data={filledData} />);
    expect(container.textContent).toMatch(/Expires.*2.*year\(s\)/i);
  });

  it("shows the confidentiality term year count in the cover page", () => {
    const { container } = render(<NdaPreview data={filledData} />);
    expect(container.textContent).toMatch(/3.*year\(s\).*Effective Date/i);
  });

  it("shows party company names as signature table column headers", () => {
    render(<NdaPreview data={filledData} />);
    expect(screen.getAllByText("Acme Corp").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Beta LLC").length).toBeGreaterThanOrEqual(1);
  });

  it("shows party print names in the signature table", () => {
    render(<NdaPreview data={filledData} />);
    expect(screen.getAllByText("Alice Johnson").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bob Williams").length).toBeGreaterThan(0);
  });

  it("shows governing law in the cover page and clause 9", () => {
    render(<NdaPreview data={filledData} />);
    const nodes = screen.getAllByText("Delaware");
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("shows jurisdiction in the cover page and clause 9", () => {
    render(<NdaPreview data={filledData} />);
    const nodes = screen.getAllByText("Wilmington, Delaware");
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("shows modifications when present", () => {
    render(<NdaPreview data={filledData} />);
    expect(
      screen.getByText("Section 8 is amended to include limited warranty.")
    ).toBeInTheDocument();
  });
});

describe("NdaPreview – blank placeholders for empty fields", () => {
  it("shows [purpose] placeholder in the cover page (lowercase) when purpose is empty", () => {
    render(<NdaPreview data={emptyData} />);
    // Cover page uses fallback="[purpose]" (lowercase); clauses 1 & 2 use "[Purpose]"
    expect(screen.getAllByText("[purpose]").length).toBeGreaterThan(0);
  });

  it("shows [Purpose] placeholder in clauses 1 and 2 when purpose is empty", () => {
    render(<NdaPreview data={emptyData} />);
    expect(screen.getAllByText("[Purpose]").length).toBeGreaterThanOrEqual(2);
  });

  it("shows [state] placeholder in the cover page when governingLaw is empty", () => {
    render(<NdaPreview data={emptyData} />);
    // Cover page uses fallback="[state]"; clause 9 uses "[Governing Law]"
    expect(screen.getAllByText("[state]").length).toBeGreaterThan(0);
  });

  it("shows [Governing Law] placeholder in clause 9 when governingLaw is empty", () => {
    render(<NdaPreview data={emptyData} />);
    expect(screen.getAllByText("[Governing Law]").length).toBeGreaterThan(0);
  });

  it("shows [city/county, state] placeholder in the cover page when jurisdiction is empty", () => {
    render(<NdaPreview data={emptyData} />);
    // Cover page uses fallback="[city/county, state]"; clause 9 uses "[Jurisdiction]"
    expect(screen.getAllByText("[city/county, state]").length).toBeGreaterThan(0);
  });

  it("shows [Jurisdiction] placeholder in clause 9 when jurisdiction is empty", () => {
    render(<NdaPreview data={emptyData} />);
    expect(screen.getAllByText("[Jurisdiction]").length).toBeGreaterThan(0);
  });

  it("shows Party 1 placeholder in the signature table header when party1 company is empty", () => {
    render(<NdaPreview data={emptyData} />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Party 1")).toBeInTheDocument();
  });

  it("shows Party 2 placeholder in the signature table header when party2 company is empty", () => {
    render(<NdaPreview data={emptyData} />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Party 2")).toBeInTheDocument();
  });

  it("shows body row placeholders in the signature table when all party fields are empty", () => {
    render(<NdaPreview data={emptyData} />);
    const table = screen.getByRole("table");
    // Each row renders one placeholder per party (2 per row)
    expect(within(table).getAllByText("[print name]")).toHaveLength(2);
    expect(within(table).getAllByText("[title]")).toHaveLength(2);
    expect(within(table).getAllByText("[company]")).toHaveLength(2);
    expect(within(table).getAllByText("[notice address]")).toHaveLength(2);
  });

  it("does NOT render modifications section when modifications is empty", () => {
    render(<NdaPreview data={emptyData} />);
    expect(screen.queryByText("MNDA Modifications")).not.toBeInTheDocument();
  });
});

describe("NdaPreview – MNDA term type variants", () => {
  it("shows 'Expires N year(s)' text for 'expires' term type", () => {
    const { container } = render(<NdaPreview data={{ ...filledData, mndaTermType: "expires", mndaTermYears: 1 }} />);
    expect(container.textContent).toMatch(/Expires.*1.*year\(s\)/i);
  });

  it("shows 'Continues until terminated' text for 'until_terminated' term type in cover page", () => {
    render(<NdaPreview data={{ ...filledData, mndaTermType: "until_terminated" }} />);
    expect(
      screen.getAllByText(/Continues until terminated/i).length
    ).toBeGreaterThan(0);
  });

  it("clause 5 references the correct MNDA term for 'until_terminated'", () => {
    const { container } = render(<NdaPreview data={{ ...filledData, mndaTermType: "until_terminated" }} />);
    expect(container.textContent).toMatch(/until terminated in accordance with the terms of the MNDA/i);
  });

  it("clause 5 references the correct MNDA term for 'expires'", () => {
    const { container } = render(<NdaPreview data={{ ...filledData, mndaTermType: "expires", mndaTermYears: 3 }} />);
    expect(container.textContent).toMatch(/3 year\(s\) from the Effective Date/);
  });
});

describe("NdaPreview – confidentiality term type variants", () => {
  it("shows year count for 'years' confidentiality term in cover page", () => {
    const { container } = render(<NdaPreview data={{ ...filledData, confidentialityTermType: "years", confidentialityTermYears: 5 }} />);
    expect(container.textContent).toMatch(/5.*year\(s\).*Effective Date/i);
  });

  it("shows 'In perpetuity' for 'perpetual' confidentiality term in cover page", () => {
    render(<NdaPreview data={{ ...filledData, confidentialityTermType: "perpetual" }} />);
    expect(screen.getByText("In perpetuity.")).toBeInTheDocument();
  });

  it("clause 5 shows 'in perpetuity' for perpetual confidentiality term", () => {
    const { container } = render(<NdaPreview data={{ ...filledData, confidentialityTermType: "perpetual" }} />);
    expect(container.textContent).toMatch(/in perpetuity/i);
  });

  it("clause 5 shows years and trade-secret caveat for 'years' confidentiality term", () => {
    const { container } = render(<NdaPreview data={{ ...filledData, confidentialityTermType: "years", confidentialityTermYears: 2 }} />);
    expect(container.textContent).toMatch(/trade secrets/i);
  });
});

describe("NdaPreview – print behaviour", () => {
  it("calls window.print() when the Download PDF button is clicked", () => {
    render(<NdaPreview data={filledData} />);
    fireEvent.click(screen.getByRole("button", { name: /download pdf/i }));
    expect(window.print).toHaveBeenCalledTimes(1);
  });
});
