"use client";

import { useState, useRef, useEffect } from "react";
import { SparklesIcon, RefreshIcon } from "./icons";

const SAMPLE_PROMPTS = [
  "Přihlašovací formulář s tmavým motivem",
  "Dashboard s 4 kartami metrik",
  "Responsivní navigační menu s hamburgerem",
  "Cenová tabulka se 3 sloupci",
  "Karta produktu s obrázkem a tlačítkem",
  "Chat rozhraní s bublinami zpráv",
];

export default function FlashUIForm() {
  const [prompt, setPrompt] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    // Abort previous request
    abortRef.current?.abort();

    setLoading(true);
    setError("");
    setGeneratedHtml("");
    setCopied(false);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/flash-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Nepodařilo se spojit s AI");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let html = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        html += decoder.decode(value, { stream: true });
        setGeneratedHtml(html);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Něco se pokazilo");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setLoading(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedHtml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleReset() {
    setPrompt("");
    setGeneratedHtml("");
    setError("");
    setCopied(false);
  }

  return (
    <section className="section-apple">
      <div className="container-narrow">
        <p className="eyebrow mb-3 text-center">Flash UI</p>
        <h2 className="headline-lg mb-4 text-center">
          Generuj UI z promptu
        </h2>
        <p className="subhead mx-auto mb-10 max-w-xl text-center">
          Napiš, co chceš — tlačítko, formulář, dashboard. AI to nakreslí v reálném čase.
        </p>

        {/* Input */}
        <div
          className="mb-4 overflow-hidden rounded-2xl border"
          style={{ borderColor: "var(--border)" }}
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Např. Přihlašovací formulář s tmavým motivem..."
            rows={3}
            className="w-full resize-none bg-transparent px-5 py-4 text-sm outline-none"
            style={{
              color: "var(--input-text)",
              caretColor: "var(--gold)",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                void handleGenerate();
              }
            }}
          />
          <div
            className="flex items-center justify-between border-t px-5 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              ⌘ + Enter pro generování
            </span>
            <div className="flex gap-2">
              {loading && (
                <button
                  onClick={handleStop}
                  className="btn-apple btn-apple-secondary text-xs"
                >
                  Zastavit
                </button>
              )}
              <button
                onClick={() => void handleGenerate()}
                disabled={!prompt.trim() || loading}
                className="btn-apple btn-apple-primary"
              >
                {loading ? (
                  <>
                    <RefreshIcon size={14} className="animate-spin-slow" />
                    Generuju...
                  </>
                ) : (
                  <>
                    <SparklesIcon size={14} />
                    Generovat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sample prompty */}
        <div className="mb-8">
          <p
            className="mb-2 text-xs uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Nebo zkus:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="rounded-full border px-3 py-1.5 text-xs transition-colors hover:border-gold"
                style={{
                  borderColor: "var(--tag-border)",
                  backgroundColor: "var(--tag-bg)",
                  color: "var(--tag-text)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Výstup */}
        {generatedHtml && (
          <div className="animate-fade-in space-y-4">
            {/* Náhled */}
            <div
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="flex items-center justify-between border-b px-4 py-2"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Náhled
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="text-xs transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {copied ? "✓ Zkopírováno" : "Kopírovat HTML"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-xs transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Nový prompt
                  </button>
                </div>
              </div>
              <iframe
                ref={iframeRef}
                srcDoc={generatedHtml}
                className="w-full border-0"
                style={{
                  height: "500px",
                  backgroundColor: "#0a0a0a",
                }}
                title="Flash UI náhled"
                sandbox="allow-scripts"
              />
            </div>

            {/* Kód */}
            <details
              className="rounded-2xl border"
              style={{ borderColor: "var(--border)" }}
            >
              <summary
                className="cursor-pointer px-4 py-2 text-xs uppercase tracking-wider select-none"
                style={{ color: "var(--text-muted)" }}
              >
                Zobrazit HTML kód
              </summary>
              <div
                className="border-t p-4"
                style={{ borderColor: "var(--border)" }}
              >
                <pre
                  className="overflow-x-auto rounded-xl p-4 text-xs leading-relaxed"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <code>{generatedHtml}</code>
                </pre>
              </div>
            </details>
          </div>
        )}

        {error && (
          <div
            className="mt-6 rounded-xl border p-4 text-sm"
            style={{
              borderColor: "rgba(239, 68, 68, 0.3)",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
