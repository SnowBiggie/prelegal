import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NdaForm from "@/components/NdaForm";
import { defaultNdaFormData, NdaFormData } from "@/types/nda";

function renderForm(overrides?: Partial<NdaFormData>, onChange = jest.fn()) {
  const data: NdaFormData = { ...defaultNdaFormData, ...overrides };
  render(<NdaForm data={data} onChange={onChange} />);
  return { data, onChange };
}

describe("NdaForm – rendering", () => {
  it("renders the Purpose textarea", () => {
    renderForm();
    expect(screen.getByLabelText(/purpose/i)).toBeInTheDocument();
  });

  it("renders the Effective Date input", () => {
    renderForm();
    expect(screen.getByLabelText("Effective Date")).toBeInTheDocument();
  });

  it("renders the MNDA Term radio options", () => {
    renderForm();
    expect(screen.getByText("Expires")).toBeInTheDocument();
    expect(screen.getByText("Continues until terminated")).toBeInTheDocument();
  });

  it("renders the Term of Confidentiality radio options", () => {
    renderForm();
    expect(screen.getAllByText(/year\(s\) from Effective Date/).length).toBeGreaterThan(0);
    expect(screen.getByText("In perpetuity")).toBeInTheDocument();
  });

  it("renders Governing Law input", () => {
    renderForm();
    expect(screen.getByLabelText(/governing law/i)).toBeInTheDocument();
  });

  it("renders Jurisdiction input", () => {
    renderForm();
    expect(screen.getByLabelText(/jurisdiction/i)).toBeInTheDocument();
  });

  it("renders MNDA Modifications textarea", () => {
    renderForm();
    expect(screen.getByLabelText(/mnda modifications/i)).toBeInTheDocument();
  });

  it("renders Party 1 and Party 2 section headings", () => {
    renderForm();
    expect(screen.getByText("Party 1")).toBeInTheDocument();
    expect(screen.getByText("Party 2")).toBeInTheDocument();
  });

  it("renders four fields for each party section", () => {
    renderForm();
    const nameInputs = screen.getAllByPlaceholderText("Jane Smith");
    expect(nameInputs).toHaveLength(2);
    const titleInputs = screen.getAllByPlaceholderText("CEO");
    expect(titleInputs).toHaveLength(2);
    const companyInputs = screen.getAllByPlaceholderText("Acme Inc.");
    expect(companyInputs).toHaveLength(2);
  });
});

describe("NdaForm – purpose field", () => {
  it("shows the current purpose value", () => {
    renderForm({ purpose: "Testing purposes" });
    expect(screen.getByLabelText(/purpose/i)).toHaveValue("Testing purposes");
  });

  it("calls onChange with the full updated purpose string on change", () => {
    const onChange = jest.fn();
    render(<NdaForm data={{ ...defaultNdaFormData, purpose: "" }} onChange={onChange} />);
    // fireEvent.change sends the full value in one event, matching real controlled-input behaviour
    fireEvent.change(screen.getByLabelText(/purpose/i), { target: { value: "New purpose" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ purpose: "New purpose" })
    );
  });
});

describe("NdaForm – effective date field", () => {
  it("shows the current effectiveDate value", () => {
    renderForm({ effectiveDate: "2026-06-01" });
    expect(screen.getByLabelText("Effective Date")).toHaveValue("2026-06-01");
  });

  it("calls onChange when date changes", () => {
    const onChange = jest.fn();
    renderForm({ effectiveDate: "2026-01-01" }, onChange);
    fireEvent.change(screen.getByLabelText("Effective Date"), {
      target: { value: "2026-06-15" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ effectiveDate: "2026-06-15" })
    );
  });
});

describe("NdaForm – MNDA Term", () => {
  it("selects the 'expires' radio by default", () => {
    renderForm();
    expect(screen.getByRole("radio", { name: /expires/i })).toBeChecked();
  });

  it("MNDA term year input is enabled when 'expires' is selected", () => {
    renderForm({ mndaTermType: "expires" });
    // spinbutton[0] = MNDA term years, spinbutton[1] = confidentiality term years
    const yearInputs = screen.getAllByRole("spinbutton");
    expect(yearInputs[0]).not.toBeDisabled();
  });

  it("MNDA term year input is disabled when 'until_terminated' is selected", () => {
    renderForm({ mndaTermType: "until_terminated" });
    const yearInputs = screen.getAllByRole("spinbutton");
    expect(yearInputs[0]).toBeDisabled();
  });

  it("calls onChange with mndaTermType 'until_terminated' when that radio is clicked", () => {
    const onChange = jest.fn();
    renderForm({ mndaTermType: "expires" }, onChange);
    fireEvent.click(screen.getByRole("radio", { name: /continues until terminated/i }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermType: "until_terminated" })
    );
  });

  it("calls onChange with mndaTermType 'expires' when that radio is clicked", () => {
    const onChange = jest.fn();
    renderForm({ mndaTermType: "until_terminated" }, onChange);
    fireEvent.click(screen.getByRole("radio", { name: /expires/i }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermType: "expires" })
    );
  });

  it("clamps mndaTermYears to minimum 1 when 0 is entered", () => {
    const onChange = jest.fn();
    renderForm({ mndaTermType: "expires", mndaTermYears: 2 }, onChange);
    const yearInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(yearInputs[0], { target: { value: "0" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermYears: 1 })
    );
  });

  it("accepts valid positive year values", () => {
    const onChange = jest.fn();
    renderForm({ mndaTermType: "expires", mndaTermYears: 1 }, onChange);
    const yearInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(yearInputs[0], { target: { value: "5" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermYears: 5 })
    );
  });
});

describe("NdaForm – Term of Confidentiality", () => {
  it("confidentiality year input is enabled when 'years' is selected", () => {
    renderForm({ confidentialityTermType: "years" });
    // spinbutton[0] = MNDA term years, spinbutton[1] = confidentiality term years
    const yearInputs = screen.getAllByRole("spinbutton");
    expect(yearInputs[1]).not.toBeDisabled();
  });

  it("confidentiality year input is disabled when 'perpetual' is selected", () => {
    renderForm({ confidentialityTermType: "perpetual" });
    const yearInputs = screen.getAllByRole("spinbutton");
    expect(yearInputs[1]).toBeDisabled();
  });

  it("calls onChange with confidentialityTermType 'perpetual' when that radio is clicked", () => {
    const onChange = jest.fn();
    renderForm({ confidentialityTermType: "years" }, onChange);
    fireEvent.click(screen.getByRole("radio", { name: /in perpetuity/i }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ confidentialityTermType: "perpetual" })
    );
  });

  it("clamps confidentialityTermYears to minimum 1 when 0 is entered", () => {
    const onChange = jest.fn();
    renderForm({ confidentialityTermType: "years", confidentialityTermYears: 3 }, onChange);
    const yearInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(yearInputs[1], { target: { value: "0" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ confidentialityTermYears: 1 })
    );
  });
});

describe("NdaForm – Governing Law and Jurisdiction", () => {
  it("calls onChange with updated governingLaw", () => {
    const onChange = jest.fn();
    renderForm({ governingLaw: "" }, onChange);
    fireEvent.change(screen.getByLabelText(/governing law/i), {
      target: { value: "California" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ governingLaw: "California" })
    );
  });

  it("calls onChange with updated jurisdiction", () => {
    const onChange = jest.fn();
    renderForm({ jurisdiction: "" }, onChange);
    fireEvent.change(screen.getByLabelText(/jurisdiction/i), {
      target: { value: "San Francisco, CA" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ jurisdiction: "San Francisco, CA" })
    );
  });
});

describe("NdaForm – Modifications", () => {
  it("shows existing modifications value", () => {
    renderForm({ modifications: "Existing mod" });
    expect(screen.getByLabelText(/mnda modifications/i)).toHaveValue("Existing mod");
  });

  it("calls onChange with updated modifications", () => {
    const onChange = jest.fn();
    renderForm({ modifications: "" }, onChange);
    fireEvent.change(screen.getByLabelText(/mnda modifications/i), {
      target: { value: "Add indemnity clause." },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ modifications: "Add indemnity clause." })
    );
  });
});

describe("NdaForm – Party fields", () => {
  it("shows party1 name value", () => {
    renderForm({ party1: { name: "Alice", title: "CEO", company: "Acme", noticeAddress: "" } });
    // getAllByLabelText finds both "Print Name" inputs; [0] = party1, [1] = party2
    expect(screen.getAllByLabelText("Print Name")[0]).toHaveValue("Alice");
  });

  it("calls onChange with updated party1 name", () => {
    const onChange = jest.fn();
    renderForm(
      { party1: { name: "", title: "", company: "", noticeAddress: "" } },
      onChange
    );
    fireEvent.change(screen.getAllByLabelText("Print Name")[0], { target: { value: "Carol" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        party1: expect.objectContaining({ name: "Carol" }),
      })
    );
  });

  it("calls onChange with updated party2 company without affecting party1", () => {
    const onChange = jest.fn();
    const data: NdaFormData = {
      ...defaultNdaFormData,
      party1: { name: "Alice", title: "CEO", company: "Acme", noticeAddress: "" },
      party2: { name: "Bob", title: "CTO", company: "", noticeAddress: "" },
    };
    render(<NdaForm data={data} onChange={onChange} />);
    // getAllByLabelText finds both "Company" inputs; [0] = party1, [1] = party2
    fireEvent.change(screen.getAllByLabelText("Company")[1], { target: { value: "Beta LLC" } });
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.party2.company).toBe("Beta LLC");
    expect(lastCall.party1.company).toBe("Acme");
  });
});
