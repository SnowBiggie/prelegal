"use client";

import { useState } from "react";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import { defaultNdaFormData, NdaFormData } from "@/types/nda";

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultNdaFormData);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 print:hidden shrink-0">
        <span className="text-indigo-600 font-bold text-lg tracking-tight">Prelegal</span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-600 text-sm font-medium">Mutual NDA Creator</span>
      </header>

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Form */}
        <aside
          id="form-panel"
          className="w-96 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h1 className="text-sm font-semibold text-gray-800">Fill in the details</h1>
            <p className="text-xs text-gray-400 mt-0.5">The document updates live as you type</p>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <NdaForm data={formData} onChange={setFormData} />
          </div>
        </aside>

        {/* Right — Preview */}
        <main
          id="preview-panel"
          className="flex-1 overflow-hidden flex flex-col p-6"
        >
          <NdaPreview data={formData} />
        </main>
      </div>
    </div>
  );
}
