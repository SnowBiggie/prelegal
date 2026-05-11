"use client";

import { NdaFormData, PartyDetails } from "@/types/nda";

interface Props {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

function PartySection({
  label,
  party,
  onChange,
}: {
  label: string;
  party: PartyDetails;
  onChange: (p: PartyDetails) => void;
}) {
  const field = (name: keyof PartyDetails, display: string, placeholder?: string) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{display}</label>
      <input
        type="text"
        value={party[name]}
        placeholder={placeholder}
        onChange={(e) => onChange({ ...party, [name]: e.target.value })}
        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{label}</h3>
      {field("name", "Print Name", "Jane Smith")}
      {field("title", "Title", "CEO")}
      {field("company", "Company", "Acme Inc.")}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Notice Address</label>
        <textarea
          value={party.noticeAddress}
          placeholder="jane@acme.com or 123 Main St, City, ST 00000"
          onChange={(e) => onChange({ ...party, noticeAddress: e.target.value })}
          rows={2}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      </div>
    </div>
  );
}

export default function NdaForm({ data, onChange }: Props) {
  const set = <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5 text-sm">
      {/* Purpose */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Purpose <span className="text-gray-400">(how confidential information may be used)</span>
        </label>
        <textarea
          value={data.purpose}
          onChange={(e) => set("purpose", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      </div>

      {/* Effective Date */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Effective Date</label>
        <input
          type="date"
          value={data.effectiveDate}
          onChange={(e) => set("effectiveDate", e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* MNDA Term */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-600">MNDA Term</label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={data.mndaTermType === "expires"}
            onChange={() => set("mndaTermType", "expires")}
          />
          <span>Expires</span>
          <input
            type="number"
            min={1}
            value={data.mndaTermYears}
            disabled={data.mndaTermType !== "expires"}
            onChange={(e) => set("mndaTermYears", Math.max(1, Number(e.target.value)))}
            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <span>year(s) from Effective Date</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={data.mndaTermType === "until_terminated"}
            onChange={() => set("mndaTermType", "until_terminated")}
          />
          <span>Continues until terminated</span>
        </label>
      </div>

      {/* Term of Confidentiality */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-600">Term of Confidentiality</label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={data.confidentialityTermType === "years"}
            onChange={() => set("confidentialityTermType", "years")}
          />
          <input
            type="number"
            min={1}
            value={data.confidentialityTermYears}
            disabled={data.confidentialityTermType !== "years"}
            onChange={(e) => set("confidentialityTermYears", Math.max(1, Number(e.target.value)))}
            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <span>year(s) from Effective Date</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={data.confidentialityTermType === "perpetual"}
            onChange={() => set("confidentialityTermType", "perpetual")}
          />
          <span>In perpetuity</span>
        </label>
      </div>

      {/* Governing Law */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Governing Law (State)</label>
        <input
          type="text"
          value={data.governingLaw}
          placeholder="e.g. Delaware"
          onChange={(e) => set("governingLaw", e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Jurisdiction */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Jurisdiction</label>
        <input
          type="text"
          value={data.jurisdiction}
          placeholder="e.g. courts located in New Castle, DE"
          onChange={(e) => set("jurisdiction", e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Modifications */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          MNDA Modifications <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          value={data.modifications}
          placeholder="List any modifications to the standard terms, or leave blank"
          onChange={(e) => set("modifications", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      </div>

      <hr className="border-gray-200" />

      {/* Party 1 */}
      <PartySection
        label="Party 1"
        party={data.party1}
        onChange={(p) => set("party1", p)}
      />

      <hr className="border-gray-200" />

      {/* Party 2 */}
      <PartySection
        label="Party 2"
        party={data.party2}
        onChange={(p) => set("party2", p)}
      />
    </div>
  );
}
