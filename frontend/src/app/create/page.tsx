"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { isAuthenticated, getUser, logout } from "@/lib/auth";
import { postCreateChat } from "@/lib/api";
import type { ChatMessage } from "@/types/document";
import catalogData from "../../../../catalog.json";

function deriveSlugFromFilename(filename: string): string {
  return filename.replace("templates/", "").replace(".md", "").toLowerCase();
}

function slugToName(slug: string): string {
  return (
    catalogData.templates.find(
      (t) => deriveSlugFromFilename(t.filename) === slug
    )?.name ?? slug
  );
}

export default function CreatePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help you draft a legal agreement. Describe what you need and I'll point you to the right document.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedSlug, setSuggestedSlug] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace("/login/");
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text: string) {
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setSuggestedSlug(null);
    try {
      const res = await postCreateChat({ history: messages, message: text });
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
      if (res.suggested_slug) {
        setSuggestedSlug(res.suggested_slug);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    handleSend(trimmed);
  }

  function handleLogout() {
    logout();
    window.location.replace("/login/");
  }

  const user = getUser();
  const suggestedName = suggestedSlug ? slugToName(suggestedSlug) : null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-brand-navy px-6 py-3 flex items-center justify-between">
        <span className="text-brand-yellow font-bold text-lg tracking-tight">Prelegal</span>
        <div className="flex items-center gap-4">
          <a
            href="/dashboard/"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Browse templates
          </a>
          {user && (
            <span className="text-white/40 text-sm hidden sm:block">{user.username}</span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-navy mb-1">Draft a Legal Document</h1>
        <p className="text-brand-gray text-sm mb-6">
          Describe what you&apos;re trying to accomplish and I&apos;ll recommend the right agreement.
        </p>

        <div className="bg-white rounded-2xl shadow-sm flex flex-col">
          {/* Message list */}
          <div className="overflow-y-auto px-4 py-4 space-y-3 max-h-[400px]">
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
            {loading && (
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
            )}
            <div ref={bottomRef} />
          </div>

          {/* CTA when suggestion is available */}
          {suggestedSlug && suggestedName && (
            <div className="border-t border-gray-100 px-4 py-3 bg-blue-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-brand-gray mb-0.5">Recommended document:</p>
                <p className="text-sm font-semibold text-brand-navy">{suggestedName}</p>
              </div>
              <a
                href={`/document/${suggestedSlug}/`}
                className="bg-brand-purple text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Draft this document →
              </a>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-100 px-4 py-3 flex gap-2"
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
              placeholder="e.g. I need a contract for sharing confidential information…"
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
      </main>
    </div>
  );
}
