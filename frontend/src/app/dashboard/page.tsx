"use client";

import { useEffect, useState } from "react";
import { isAuthenticated, getUser, logout } from "@/lib/auth";
import { fetchCatalog } from "@/lib/api";
import DocumentCard from "@/components/DocumentCard";
import type { CatalogTemplate } from "@/types/catalog";

export default function DashboardPage() {
  const [templates, setTemplates] = useState<CatalogTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace("/login/");
      return;
    }
    fetchCatalog()
      .then((data) => setTemplates(data.templates))
      .catch(() => setError("Could not load document catalog."))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    window.location.replace("/login/");
  }

  const user = getUser();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-brand-navy px-6 py-3 flex items-center justify-between">
        <span className="text-brand-yellow font-bold text-lg tracking-tight">
          Prelegal
        </span>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-white/60 text-sm hidden sm:block">
              {user.username}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-brand-navy mb-2">
          Document Templates
        </h1>
        <p className="text-brand-gray text-sm mb-8">
          Select a template to begin drafting your legal agreement.
        </p>

        {loading && <p className="text-brand-gray">Loading templates…</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((t) => (
            <DocumentCard key={t.filename} template={t} />
          ))}
        </div>
      </main>
    </div>
  );
}
