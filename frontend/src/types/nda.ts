export type MndaTermType = "expires" | "until_terminated";
export type ConfidentialityTermType = "years" | "perpetual";

export interface PartyDetails {
  name: string;
  title: string;
  company: string;
  noticeAddress: string;
}

export interface NdaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermType: MndaTermType;
  mndaTermYears: number;
  confidentialityTermType: ConfidentialityTermType;
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: PartyDetails;
  party2: PartyDetails;
}

export const defaultNdaFormData: NdaFormData = {
  purpose: "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTermType: "expires",
  mndaTermYears: 1,
  confidentialityTermType: "years",
  confidentialityTermYears: 1,
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: { name: "", title: "", company: "", noticeAddress: "" },
  party2: { name: "", title: "", company: "", noticeAddress: "" },
};
