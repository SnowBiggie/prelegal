"use client";

import { NdaFormData } from "@/types/nda";

interface Props {
  data: NdaFormData;
}

function Blank({ value, fallback }: { value: string; fallback: string }) {
  if (value.trim()) return <span className="font-medium">{value}</span>;
  return (
    <span className="inline-block border-b-2 border-dashed border-indigo-300 text-indigo-300 italic min-w-[6rem] px-1">
      {fallback}
    </span>
  );
}

function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[Number(m) - 1]} ${Number(d)}, ${y}`;
}

function mndaTermLabel(data: NdaFormData) {
  if (data.mndaTermType === "expires") {
    return `${data.mndaTermYears} year(s) from the Effective Date`;
  }
  return "until terminated in accordance with the terms of the MNDA";
}

function confidentialityTermLabel(data: NdaFormData) {
  if (data.confidentialityTermType === "years") {
    return `${data.confidentialityTermYears} year(s) from the Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws`;
  }
  return "in perpetuity";
}

export default function NdaPreview({ data }: Props) {
  const handlePrint = () => window.print();

  const effectiveDateDisplay = data.effectiveDate
    ? formatDate(data.effectiveDate)
    : "";

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <h2 className="text-base font-semibold text-gray-700">Document Preview</h2>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded shadow-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M4 8h16M8 4h8a2 2 0 012 2v2H6V6a2 2 0 012-2z" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Document */}
      <div
        id="nda-document"
        className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm px-10 py-10 text-sm leading-relaxed text-gray-800 print:border-0 print:shadow-none print:px-0 print:py-0 print:overflow-visible"
      >
        <h1 className="text-2xl font-bold text-center mb-1">Mutual Non-Disclosure Agreement</h1>
        <p className="text-center text-gray-500 text-xs mb-8">
          Common Paper Mutual NDA Standard Terms Version 1.0
        </p>

        {/* Cover Page */}
        <section className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h2 className="text-base font-bold mb-5 uppercase tracking-wide text-gray-700">Cover Page</h2>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Purpose</p>
              <p className="italic text-gray-700">
                <Blank value={data.purpose} fallback="[purpose]" />
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Effective Date</p>
              <p>
                <Blank value={effectiveDateDisplay} fallback="[date]" />
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">MNDA Term</p>
              <p>
                {data.mndaTermType === "expires" ? (
                  <>Expires <Blank value={String(data.mndaTermYears)} fallback="1" /> year(s) from Effective Date.</>
                ) : (
                  "Continues until terminated in accordance with the terms of the MNDA."
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Term of Confidentiality</p>
              <p>
                {data.confidentialityTermType === "years" ? (
                  <><Blank value={String(data.confidentialityTermYears)} fallback="1" /> year(s) from Effective Date, but in the case of trade secrets until no longer a trade secret under applicable laws.</>
                ) : (
                  "In perpetuity."
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Governing Law</p>
                <p><Blank value={data.governingLaw} fallback="[state]" /></p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Jurisdiction</p>
                <p><Blank value={data.jurisdiction} fallback="[city/county, state]" /></p>
              </div>
            </div>

            {data.modifications && (
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">MNDA Modifications</p>
                <p className="whitespace-pre-wrap">{data.modifications}</p>
              </div>
            )}
          </div>
        </section>

        {/* Signature Table */}
        <section className="mb-10">
          <p className="mb-3 text-gray-600">
            By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left w-32"></th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-center">
                  <Blank value={data.party1.company} fallback="Party 1" />
                </th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-center">
                  <Blank value={data.party2.company} fallback="Party 2" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Signature", v1: "", v2: "" },
                { label: "Print Name", v1: data.party1.name, v2: data.party2.name },
                { label: "Title", v1: data.party1.title, v2: data.party2.title },
                { label: "Company", v1: data.party1.company, v2: data.party2.company },
                { label: "Notice Address", v1: data.party1.noticeAddress, v2: data.party2.noticeAddress },
              ].map(({ label, v1, v2 }) => (
                <tr key={label}>
                  <td className="border border-gray-300 px-3 py-2 font-medium text-gray-600 text-xs bg-gray-50">
                    {label}
                  </td>
                  <td className="border border-gray-300 px-3 py-3 text-center align-top min-h-[2rem]">
                    {label === "Signature" ? (
                      <span className="text-gray-300 text-xs italic">sign here</span>
                    ) : (
                      <Blank value={v1} fallback={`[${label.toLowerCase()}]`} />
                    )}
                  </td>
                  <td className="border border-gray-300 px-3 py-3 text-center align-top">
                    {label === "Signature" ? (
                      <span className="text-gray-300 text-xs italic">sign here</span>
                    ) : (
                      <Blank value={v2} fallback={`[${label.toLowerCase()}]`} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Standard Terms */}
        <section>
          <h2 className="text-base font-bold mb-5 uppercase tracking-wide text-gray-700 border-t border-gray-200 pt-6">
            Standard Terms
          </h2>

          <ol className="space-y-4 list-none">
            <li>
              <strong>1. Introduction.</strong> This Mutual Non-Disclosure Agreement (which incorporates
              these Standard Terms and the Cover Page) (&ldquo;MNDA&rdquo;) allows each party
              (&ldquo;Disclosing Party&rdquo;) to disclose or make available information in connection
              with the{" "}
              <Blank value={data.purpose} fallback="[Purpose]" />{" "}
              which (1) the Disclosing Party identifies to the receiving party (&ldquo;Receiving
              Party&rdquo;) as &ldquo;confidential&rdquo;, &ldquo;proprietary&rdquo;, or the like or
              (2) should be reasonably understood as confidential or proprietary due to its nature and
              the circumstances of its disclosure (&ldquo;Confidential Information&rdquo;). Each
              party&rsquo;s Confidential Information also includes the existence and status of the
              parties&rsquo; discussions and information on the Cover Page. Confidential Information
              includes technical or business information, product designs or roadmaps, requirements,
              pricing, security and compliance documentation, technology, inventions and know-how. To
              use this MNDA, the parties must complete and sign a cover page incorporating these
              Standard Terms (&ldquo;Cover Page&rdquo;). Each party is identified on the Cover Page
              and capitalized terms have the meanings given herein or on the Cover Page.
            </li>

            <li>
              <strong>2. Use and Protection of Confidential Information.</strong> The Receiving Party
              shall: (a) use Confidential Information solely for the{" "}
              <Blank value={data.purpose} fallback="[Purpose]" />; (b) not disclose Confidential
              Information to third parties without the Disclosing Party&rsquo;s prior written
              approval, except that the Receiving Party may disclose Confidential Information to its
              employees, agents, advisors, contractors and other representatives having a reasonable
              need to know for the{" "}
              <Blank value={data.purpose} fallback="[Purpose]" />, provided these representatives are
              bound by confidentiality obligations no less protective of the Disclosing Party than the
              applicable terms in this MNDA and the Receiving Party remains responsible for their
              compliance with this MNDA; and (c) protect Confidential Information using at least the
              same protections the Receiving Party uses for its own similar information but no less
              than a reasonable standard of care.
            </li>

            <li>
              <strong>3. Exceptions.</strong> The Receiving Party&rsquo;s obligations in this MNDA do
              not apply to information that it can demonstrate: (a) is or becomes publicly available
              through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to
              receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully
              obtained from a third party without confidentiality restrictions; or (d) it independently
              developed without using or referencing the Confidential Information.
            </li>

            <li>
              <strong>4. Disclosures Required by Law.</strong> The Receiving Party may disclose
              Confidential Information to the extent required by law, regulation or regulatory
              authority, subpoena or court order, provided (to the extent legally permitted) it
              provides the Disclosing Party reasonable advance notice of the required disclosure and
              reasonably cooperates, at the Disclosing Party&rsquo;s expense, with the Disclosing
              Party&rsquo;s efforts to obtain confidential treatment for the Confidential Information.
            </li>

            <li>
              <strong>5. Term and Termination.</strong> This MNDA commences on the{" "}
              <Blank value={effectiveDateDisplay} fallback="[Effective Date]" /> and expires at the
              end of the{" "}
              <span className="font-medium">{mndaTermLabel(data)}</span>. Either party may terminate
              this MNDA for any or no reason upon written notice to the other party. The Receiving
              Party&rsquo;s obligations relating to Confidential Information will survive for{" "}
              <span className="font-medium">{confidentialityTermLabel(data)}</span>, despite any
              expiration or termination of this MNDA.
            </li>

            <li>
              <strong>6. Return or Destruction of Confidential Information.</strong> Upon expiration
              or termination of this MNDA or upon the Disclosing Party&rsquo;s earlier request, the
              Receiving Party will: (a) cease using Confidential Information; (b) promptly after the
              Disclosing Party&rsquo;s written request, destroy all Confidential Information in the
              Receiving Party&rsquo;s possession or control or return it to the Disclosing Party; and
              (c) if requested by the Disclosing Party, confirm its compliance with these obligations
              in writing. As an exception to subsection (b), the Receiving Party may retain
              Confidential Information in accordance with its standard backup or record retention
              policies or as required by law, but the terms of this MNDA will continue to apply to the
              retained Confidential Information.
            </li>

            <li>
              <strong>7. Proprietary Rights.</strong> The Disclosing Party retains all of its
              intellectual property and other rights in its Confidential Information and its disclosure
              to the Receiving Party grants no license under such rights.
            </li>

            <li>
              <strong>8. Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS
              IS&rdquo;, WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF
              TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
            </li>

            <li>
              <strong>9. Governing Law and Jurisdiction.</strong> This MNDA and all matters relating
              hereto are governed by, and construed in accordance with, the laws of the State of{" "}
              <Blank value={data.governingLaw} fallback="[Governing Law]" />, without regard to the
              conflict of laws provisions of such{" "}
              <Blank value={data.governingLaw} fallback="[Governing Law]" />. Any legal suit, action,
              or proceeding relating to this MNDA must be instituted in the federal or state courts
              located in <Blank value={data.jurisdiction} fallback="[Jurisdiction]" />. Each party
              irrevocably submits to the exclusive jurisdiction of such{" "}
              <Blank value={data.jurisdiction} fallback="[Jurisdiction]" /> in any such suit, action,
              or proceeding.
            </li>

            <li>
              <strong>10. Equitable Relief.</strong> A breach of this MNDA may cause irreparable harm
              for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the
              Disclosing Party is entitled to seek appropriate equitable relief, including an
              injunction, in addition to its other remedies.
            </li>

            <li>
              <strong>11. General.</strong> Neither party has an obligation under this MNDA to disclose
              Confidential Information to the other or proceed with any proposed transaction. Neither
              party may assign this MNDA without the prior written consent of the other party, except
              that either party may assign this MNDA in connection with a merger, reorganization,
              acquisition or other transfer of all or substantially all its assets or voting securities.
              Any assignment in violation of this Section is null and void. This MNDA will bind and
              inure to the benefit of each party&rsquo;s permitted successors and assigns. Waivers must
              be signed by the waiving party&rsquo;s authorized representative and cannot be implied
              from conduct. If any provision of this MNDA is held unenforceable, it will be limited to
              the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA
              (including the Cover Page) constitutes the entire agreement of the parties with respect
              to its subject matter, and supersedes all prior and contemporaneous understandings,
              agreements, representations, and warranties, whether written or oral, regarding such
              subject matter. This MNDA may only be amended, modified, waived, or supplemented by an
              agreement in writing signed by both parties. Notices, requests and approvals under this
              MNDA must be sent in writing to the email or postal addresses on the Cover Page and are
              deemed delivered on receipt. This MNDA may be executed in counterparts, including
              electronic copies, each of which is deemed an original and which together form the same
              agreement.
            </li>
          </ol>

          <p className="mt-8 text-xs text-gray-400 border-t border-gray-100 pt-4">
            Common Paper Mutual Non-Disclosure Agreement Version 1.0 — free to use under{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline print:no-underline"
            >
              CC BY 4.0
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
