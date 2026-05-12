import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/app/login/page";

beforeEach(() => {
  localStorage.clear();
});

describe("LoginPage", () => {
  it("renders the Prelegal heading", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /prelegal/i })).toBeInTheDocument();
  });

  it("renders username and password fields", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders a Sign In button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows error message when submitting with empty fields", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });

  it("stores auth in localStorage on valid submit", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "alice" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(localStorage.getItem("prelegal_auth")).not.toBeNull();
  });
});
