import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Home from "@/app/nda/page";

beforeEach(() => {
  window.print = jest.fn();
});

describe("Home page – initial render", () => {
  it("renders the Prelegal brand name", () => {
    render(<Home />);
    expect(screen.getByText("Prelegal")).toBeInTheDocument();
  });

  it("renders the Mutual NDA Creator label", () => {
    render(<Home />);
    expect(screen.getByText(/Mutual NDA Creator/i)).toBeInTheDocument();
  });

  it("renders the form panel with the 'Fill in the details' heading", () => {
    render(<Home />);
    expect(screen.getByText("Fill in the details")).toBeInTheDocument();
  });

  it("renders the preview document title", () => {
    render(<Home />);
    expect(
      screen.getByText("Mutual Non-Disclosure Agreement")
    ).toBeInTheDocument();
  });

  it("renders the form and the preview side by side", () => {
    render(<Home />);
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});

describe("Home page – live preview updates", () => {
  it("updating the governing law field reflects in the preview document", () => {
    render(<Home />);
    const governingLawInput = screen.getByLabelText(/governing law/i);
    fireEvent.change(governingLawInput, { target: { value: "Texas" } });
    const preview = screen.getByRole("main");
    expect(within(preview).getAllByText("Texas").length).toBeGreaterThan(0);
  });

  it("updating the jurisdiction field reflects in the preview document", () => {
    render(<Home />);
    const jurisdictionInput = screen.getByLabelText(/jurisdiction/i);
    fireEvent.change(jurisdictionInput, { target: { value: "Austin, TX" } });
    const preview = screen.getByRole("main");
    expect(within(preview).getAllByText("Austin, TX").length).toBeGreaterThan(0);
  });

  it("updating party 1 company reflects in the preview signature table", () => {
    render(<Home />);
    const companyInputs = screen.getAllByPlaceholderText("Acme Inc.");
    fireEvent.change(companyInputs[0], { target: { value: "FutureCo" } });
    const preview = screen.getByRole("main");
    expect(within(preview).getAllByText("FutureCo").length).toBeGreaterThan(0);
  });

  it("updating party 2 company reflects in the preview signature table", () => {
    render(<Home />);
    const companyInputs = screen.getAllByPlaceholderText("Acme Inc.");
    fireEvent.change(companyInputs[1], { target: { value: "OtherCo" } });
    const preview = screen.getByRole("main");
    expect(within(preview).getAllByText("OtherCo").length).toBeGreaterThan(0);
  });

  it("entering modifications text displays it in the preview cover page", () => {
    render(<Home />);
    fireEvent.change(screen.getByLabelText(/mnda modifications/i), {
      target: { value: "Custom clause added." },
    });
    const preview = screen.getByRole("main");
    expect(
      within(preview).getByText("Custom clause added.")
    ).toBeInTheDocument();
  });

  it("switching MNDA term to 'until_terminated' updates the preview clause 5 text", () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("radio", { name: /continues until terminated/i }));
    const preview = screen.getByRole("main");
    expect(
      within(preview).getAllByText(
        /until terminated in accordance with the terms of the MNDA/i
      ).length
    ).toBeGreaterThan(0);
  });

  it("switching confidentiality term to 'perpetual' updates preview clause 5 text", () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("radio", { name: /in perpetuity/i }));
    const preview = screen.getByRole("main");
    expect(within(preview).getAllByText(/in perpetuity/i).length).toBeGreaterThan(0);
  });

  it("clearing governing law shows [Governing Law] placeholder in preview", () => {
    render(<Home />);
    const governingLawInput = screen.getByLabelText(/governing law/i);
    fireEvent.change(governingLawInput, { target: { value: "Delaware" } });
    fireEvent.change(governingLawInput, { target: { value: "" } });
    const preview = screen.getByRole("main");
    expect(
      within(preview).getAllByText("[Governing Law]").length
    ).toBeGreaterThan(0);
  });
});

describe("Home page – Download PDF", () => {
  it("clicking Download PDF calls window.print()", () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: /download pdf/i }));
    expect(window.print).toHaveBeenCalledTimes(1);
  });
});
