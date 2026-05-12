"use client";

import { useEffect, useState } from "react";
import { isAuthenticated, getUser, logout } from "@/lib/auth";
import { fetchTemplate, postDocumentChat } from "@/lib/api";
import ChatPanel from "@/components/ChatPanel";
import DocumentPreview from "@/components/DocumentPreview";
import type { ChatMessage, TemplateResponse } from "@/types/document";
import catalogData from "../../../../../catalog.json";

interface Props {
  slug: string;
}

export default function DocumentPageClient({ slug }: Props) {
  const documentName =
    catalogData.templates.find(
      (t) =>
        t.filename.replace("templates/", "").replace(".md", "").toLowerCase() === slug
    )?.name ?? slug;

  const [template, setTemplate] = useState<TemplateResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace("/login/");
      return;
    }
    fetchTemplate(slug)
      .then((data) => {
        setTemplate(data);
        const empty: Record<string, string> = {};
        data.fields.forEach((f) => {
          empty[f] = "";
        });
        setFields(empty);
        setMessages([
          {
            role: "assistant",
            content: `I'll help you draft your ${data.name}. What would you like to start with?`,
          },
        ]);
      })
      .catch(() => setError("Could not load template."))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSend(text: string) {
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setChatLoading(true);
    try {
      const res = await postDocumentChat(slug, {
        history: messages,
        message: text,
        fields,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
      setFields(res.fields);
      if (res.redirect_slug && res.redirect_slug !== slug) {
        window.location.href = `/document/${res.redirect_slug}/`;
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleLogout() {
    logout();
    window.location.replace("/login/");
  }

  const user = getUser();

  return (
    <div className="flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible">
      <header className="bg-brand-navy px-6 py-3 flex items-center justify-between print:hidden shrink-0">
        <div className="flex items-center gap-3">
          <a href="/dashboard/" className="text-brand-yellow font-bold text-lg tracking-tight">
            Prelegal
          </a>
          <span className="text-white/40">/</span>
          <span className="text-white/80 text-sm font-medium">{documentName}</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-white/60 text-sm hidden sm:block">{user.username}</span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-brand-gray">Loading template…</p>
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-1 overflow-hidden print:block print:overflow-visible">
          <aside className="w-96 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden print:hidden">
            <ChatPanel
              messages={messages}
              loading={chatLoading}
              onSend={handleSend}
            />
          </aside>
          <main className="flex-1 overflow-hidden flex flex-col p-6 print:overflow-visible print:p-0">
            {template && (
              <DocumentPreview
                templateContent={template.template_content}
                fields={fields}
                documentName={documentName}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
