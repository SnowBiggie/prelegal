import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatPanel from "@/components/ChatPanel";
import type { ChatMessage } from "@/types/document";

const messages: ChatMessage[] = [
  { role: "assistant", content: "Hello! How can I help?" },
  { role: "user", content: "I need an NDA." },
];

describe("ChatPanel – rendering", () => {
  it("renders assistant and user messages", () => {
    render(<ChatPanel messages={messages} loading={false} onSend={jest.fn()} />);
    expect(screen.getByText("Hello! How can I help?")).toBeInTheDocument();
    expect(screen.getByText("I need an NDA.")).toBeInTheDocument();
  });

  it("renders the Send button", () => {
    render(<ChatPanel messages={[]} loading={false} onSend={jest.fn()} />);
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("disables Send when input is empty", () => {
    render(<ChatPanel messages={[]} loading={false} onSend={jest.fn()} />);
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("enables Send when input has text", () => {
    render(<ChatPanel messages={[]} loading={false} onSend={jest.fn()} />);
    const textarea = screen.getByPlaceholderText(/ask me/i);
    fireEvent.change(textarea, { target: { value: "hello" } });
    expect(screen.getByRole("button", { name: /send/i })).not.toBeDisabled();
  });

  it("calls onSend with trimmed input on form submit", () => {
    const onSend = jest.fn();
    render(<ChatPanel messages={[]} loading={false} onSend={onSend} />);
    const textarea = screen.getByPlaceholderText(/ask me/i);
    fireEvent.change(textarea, { target: { value: "  test message  " } });
    fireEvent.submit(textarea.closest("form")!);
    expect(onSend).toHaveBeenCalledWith("test message");
  });

  it("disables Send while loading", () => {
    render(<ChatPanel messages={[]} loading={true} onSend={jest.fn()} />);
    const textarea = screen.getByPlaceholderText(/ask me/i);
    fireEvent.change(textarea, { target: { value: "hello" } });
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("uses custom placeholder when provided", () => {
    render(
      <ChatPanel
        messages={[]}
        loading={false}
        onSend={jest.fn()}
        placeholder="What do you need?"
      />
    );
    expect(screen.getByPlaceholderText("What do you need?")).toBeInTheDocument();
  });
});
