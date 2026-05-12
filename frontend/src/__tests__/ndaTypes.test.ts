import { defaultNdaFormData } from "@/types/nda";

describe("defaultNdaFormData", () => {
  it("sets today's date as the default effectiveDate in YYYY-MM-DD format", () => {
    expect(defaultNdaFormData.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // Parsed as UTC; allow ±48 h to survive midnight-boundary runs in any timezone
    const diffMs = Math.abs(Date.now() - new Date(defaultNdaFormData.effectiveDate).getTime());
    expect(diffMs).toBeLessThan(48 * 60 * 60 * 1000);
  });

  it("defaults mndaTermType to 'expires'", () => {
    expect(defaultNdaFormData.mndaTermType).toBe("expires");
  });

  it("defaults mndaTermYears to 1", () => {
    expect(defaultNdaFormData.mndaTermYears).toBe(1);
  });

  it("defaults confidentialityTermType to 'years'", () => {
    expect(defaultNdaFormData.confidentialityTermType).toBe("years");
  });

  it("defaults confidentialityTermYears to 1", () => {
    expect(defaultNdaFormData.confidentialityTermYears).toBe(1);
  });

  it("has a non-empty default purpose", () => {
    expect(defaultNdaFormData.purpose.trim().length).toBeGreaterThan(0);
  });

  it("initialises both parties with empty string fields", () => {
    const empty = { name: "", title: "", company: "", noticeAddress: "" };
    expect(defaultNdaFormData.party1).toEqual(empty);
    expect(defaultNdaFormData.party2).toEqual(empty);
  });

  it("initialises modifications as an empty string", () => {
    expect(defaultNdaFormData.modifications).toBe("");
  });

  it("initialises governingLaw and jurisdiction as empty strings", () => {
    expect(defaultNdaFormData.governingLaw).toBe("");
    expect(defaultNdaFormData.jurisdiction).toBe("");
  });
});
