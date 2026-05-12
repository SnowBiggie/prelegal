# Mutual NDA Creator — Manual Test Checklist

Run against `npm run dev` (localhost:3000). Use Chrome and Firefox for cross-browser coverage.

---

## 1. Initial Page Load

- [ ] Page loads without console errors
- [ ] Header shows "Prelegal | Mutual NDA Creator"
- [ ] Left panel shows form with today's date pre-filled in Effective Date
- [ ] Right panel shows live document preview with all 11 standard clauses visible
- [ ] Default purpose text appears in the preview (in the cover page and in clauses 1 and 2)
- [ ] Dashed placeholder lines appear for empty Governing Law, Jurisdiction, Party fields

---

## 2. Live Preview — Form → Document Binding

- [ ] Typing in **Purpose** updates all three occurrence locations in the preview (cover page, clause 1, clause 2) in real time
- [ ] Changing **Effective Date** updates the cover page and clause 5 date display
- [ ] Setting **MNDA Term** to "Expires 3 years" updates the cover page and clause 5 accordingly
- [ ] Switching **MNDA Term** to "Continues until terminated" disables the year input and updates cover page + clause 5
- [ ] Switching back to "Expires" re-enables the year input
- [ ] Setting **Term of Confidentiality** to a year count updates the cover page and clause 5
- [ ] Switching to "In perpetuity" updates the cover page ("In perpetuity.") and clause 5 ("in perpetuity")
- [ ] Typing in **Governing Law** updates the cover page, clause 9 (appears twice in clause 9)
- [ ] Typing in **Jurisdiction** updates the cover page, clause 9 (appears twice in clause 9)
- [ ] Typing in **MNDA Modifications** shows the text in the cover page Modifications row
- [ ] Clearing **MNDA Modifications** removes the Modifications row from the cover page entirely
- [ ] Typing **Party 1 Company** updates the column header in the signature table
- [ ] Typing **Party 1 Print Name / Title** updates the corresponding rows in the signature table
- [ ] Typing **Party 1 Notice Address** updates the Notice Address row in the signature table
- [ ] Same for all Party 2 fields

---

## 3. Placeholder Behaviour

- [ ] Empty **Purpose** shows `[Purpose]` (dashed italic) in the cover page and clauses 1 and 2
- [ ] Empty **Effective Date** shows `[date]` in the cover page and `[Effective Date]` in clause 5
- [ ] Empty **Governing Law** shows `[state]` in the cover page and `[Governing Law]` (×2) in clause 9
- [ ] Empty **Jurisdiction** shows `[city/county, state]` in the cover page and `[Jurisdiction]` (×2) in clause 9
- [ ] Empty **Party 1 Company** shows "Party 1" as the column header in the signature table
- [ ] Empty **Party 2 Company** shows "Party 2" as the column header in the signature table

---

## 4. Date Formatting

- [ ] Selecting `2026-01-01` displays as "January 1, 2026"
- [ ] Selecting `2026-12-31` displays as "December 31, 2026"
- [ ] Selecting `2026-02-09` displays as "February 9, 2026" (no leading zero on day)

---

## 5. Year Input Clamping

- [ ] Entering `0` in MNDA Term years snaps back to `1`
- [ ] Entering a negative number in MNDA Term years snaps back to `1`
- [ ] Same behaviour for Term of Confidentiality year input

---

## 6. Download PDF (Print)

- [ ] Clicking "Download PDF" opens the browser print dialog
- [ ] In the print preview, the **form panel and header are hidden** (only the document is visible)
- [ ] The **full document** is visible in print preview — all 11 clauses are present, none are cut off
- [ ] Cover page section renders correctly in print preview
- [ ] Signature table renders without overflow in print preview
- [ ] The document fits on standard A4 / Letter paper (check print preview page count is reasonable)
- [ ] Saving as PDF produces a file that contains the complete NDA text
- [ ] Verify both Chrome's "Save as PDF" and Firefox's "Save as PDF" produce complete documents

---

## 7. Scroll and Layout

- [ ] The form panel is independently scrollable (long content scrolls without affecting the preview)
- [ ] The preview panel is independently scrollable
- [ ] Scrolling the preview to the bottom shows the CC BY 4.0 attribution footer
- [ ] The layout does not break at 1280px, 1440px, or 1920px viewport widths

---

## 8. Edge Cases

- [ ] Very long purpose text (500+ characters) renders without overflow in the preview
- [ ] Very long company name renders without breaking the signature table layout
- [ ] Multi-line notice address text wraps correctly in the signature table cell
- [ ] MNDA Modifications with multiple paragraphs (`\n\n`) renders with whitespace preserved
- [ ] Setting mndaTermYears to a large number (e.g. 99) renders correctly in the preview text

---

## 9. Regression — Print Fix Verification

> Verifies the fix for the truncated PDF bug (print CSS constraints).

- [ ] Before printing, scroll the preview to the bottom to confirm clause 11 and the CC BY 4.0 footer are visible
- [ ] Open print dialog — confirm clause 11 "General" appears in the print preview
- [ ] Save as PDF — open the PDF and confirm it contains all text from "1. Introduction" through "11. General" and the CC BY 4.0 footer
