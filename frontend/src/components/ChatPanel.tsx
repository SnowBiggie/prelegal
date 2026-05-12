"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/document";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (text: string) => void;
  placeholder?: string;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 bg-brand-gray rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatPanel({
  messages,
  loading,
  onSend,
  placeholder = "Ask me about this document…",
}: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    onSend(trimmed);
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-5 py-4 border-b border-gray-100 shrink-0">
        <h2 className="text-sm font-semibold text-brand-navy">Chat with AI</h2>
        <p className="text-xs text-brand-gray mt-0.5">
          Describe what you need — I&apos;ll fill in the fields
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-brand-blue text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-100 px-4 py-3 flex gap-2 shrink-0"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent);
            }
          }}
          placeholder={placeholder}
          rows={2}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-brand-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40 self-end transition-opacity"
        >
          Send
        </button>
      </form>
    </div>
  );
}
