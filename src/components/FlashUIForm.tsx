"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SparklesIcon, RefreshIcon, CheckIcon, ArrowRightIcon } from "./icons";

const SAMPLE_PROMPTS = [
  "Přihlašovací formulář s tmavým motivem",
  "Dashboard s 4 kartami metrik",
  "Responsivní navigační menu s hamburgerem",
  "Cenová tabulka se 3 sloupci",
  "Karta produktu s obrázkem a tlačítkem",
  "Chat rozhraní s bublinami zpráv",
];

const ROTATING_TEXTS = [
  "tlačítko",
  "formulář",
  "dashboard",
  "kartu",
  "menu",
  "tabulku",
  "chat",
  "landing page",
];

// Particle background component
function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Grid dots */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, var(--gold) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.08] blur-[100px] animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, var(--gold), transparent 70%)' }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.06] blur-[80px] animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, var(--gold), transparent 70%)', animationDelay: '2s' }}
      />
    </div>
  );
}

// Rotating text effect
function RotatingPlaceholder({ currentPrompt, isActive }: { currentPrompt: string; isActive: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isActive) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isActive]);

  if (isActive) return null;

  return (
    <span className="absolute left-5 top-4 text-sm pointer-events-none transition-all duration-500"
      style={{ color: 'var(--text-muted)' }}
    >
      <span className="opacity-50">Napiš{"&#160;"}</span>
      <span
        key={index}
        className="inline-block animate-typewriter"
        style={{ color: 'var(--gold)' }}
      >
        {ROTATING_TEXTS[index]}
      </span>
    </span>
  );
}

// Loading animation with progress dots
function LoadingAnimation({ html }: { html: string }) {
  const lines = html.split('\n').length;
  const chars = html.length;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-gold/20 animate-spin"
          style={{ borderTopColor: 'var(--gold)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <SparklesIcon size={20} className="text-gold animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-sm animate-pulse" style={{ color: 'var(--gold)' }}>
          DeepSeek V4 Flash tvoří...
        </p>
        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {chars > 0 ? `${chars} znaků · ${lines} řádků` : 'Připravuji návrh...'}
        </p>
      </div>
      {/* Progress bar */}
      <div className="w-48 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300 animate-progress-shimmer"
          style={{
            width: `${Math.min((chars / 2000) * 100, 95)}%`,
            background: 'linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold))',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </div>
  );
}

export default function FlashUIForm() {
  const [prompt, setPrompt] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Scroll to result when ready
  useEffect(() => {
    if (hasResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hasResult]);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    abortRef.current?.abort();

    setLoading(true);
    setError("");
    setGeneratedHtml("");
    setCopied(false);
    setShowCode(false);
    setHasResult(false);

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

      setHasResult(true);
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
    setShowCode(false);
    setHasResult(false);
    textareaRef.current?.focus();
  }

  const handlePromptClick = useCallback((text: string) => {
    setPrompt(text);
    textareaRef.current?.focus();
  }, []);

  return (
    <section className="relative min-h-[calc(100svh-80px)] flex flex-col">
      <ParticleBackground />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Hero input area */}
        <div className={`flex-1 flex flex-col items-center justify-center px-5 transition-all duration-700 ${hasResult ? 'pt-10 pb-6' : 'py-20'}`}>
          {!hasResult && (
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(200, 150, 46, 0.2), rgba(200, 150, 46, 0.05))',
                  border: '1px solid rgba(200, 150, 46, 0.3)',
                  boxShadow: '0 0 40px rgba(200, 150, 46, 0.15)',
                }}
              >
                <SparklesIcon size={28} className="text-gold" />
              </div>
              <h2 className="headline-lg mb-3">
                Flash <span style={{ color: 'var(--gold)' }}>UI</span>
              </h2>
              <p className="subhead mx-auto max-w-lg">
                Generuj UI komponenty pomocí AI. Napiš prompt a sleduj, jak DeepSeek V4 Flash tvoří.
              </p>
            </div>
          )}

          {/* Input */}
          <div className="w-full max-w-2xl">
            <div
              className="relative overflow-hidden rounded-2xl border transition-all duration-300 focus-within:border-gold/50 focus-within:shadow-[0_0_30px_rgba(200,150,46,0.1)]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="relative">
                <RotatingPlaceholder currentPrompt={prompt} isActive={prompt.length > 0 || loading} />
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={prompt.length === 0 ? "" : "Např. Přihlašovací formulář s tmavým motivem..."}
                  rows={hasResult ? 2 : 3}
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
              </div>

              <div
                className="flex items-center justify-between border-t px-5 py-3"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {loading ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                        </span>
                        Generování...
                      </span>
                    ) : (
                      "⌘ + Enter"
                    )}
                  </span>
                </div>

                <div className="flex gap-2">
                  {loading && (
                    <button
                      onClick={handleStop}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-white/5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      Zastavit
                    </button>
                  )}
                  <button
                    onClick={() => void handleGenerate()}
                    disabled={!prompt.trim() || loading}
                    className="btn-apple btn-apple-primary inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshIcon size={14} className="animate-spin-slow" />
                        Generuju
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
            {!hasResult && !loading && (
              <div className="mt-6 animate-fade-in-up">
                <p
                  className="mb-3 text-xs uppercase tracking-wider text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  Nebo zkus:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SAMPLE_PROMPTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handlePromptClick(s)}
                      className="group relative overflow-hidden rounded-full border px-4 py-2 text-xs transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_20px_rgba(200,150,46,0.1)]"
                      style={{
                        borderColor: "var(--tag-border)",
                        backgroundColor: "var(--tag-bg)",
                        color: "var(--tag-text)",
                      }}
                    >
                      <span className="relative z-10">{s}</span>
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(200, 150, 46, 0.1), transparent)',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && !hasResult && (
          <div className="flex-1 flex items-center justify-center">
            <LoadingAnimation html={generatedHtml} />
          </div>
        )}

        {/* Result */}
        {hasResult && generatedHtml && (
          <div ref={resultRef} className="container-narrow pb-20 animate-fade-in">
            {/* Result header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Výsledek
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {generatedHtml.length.toLocaleString()} znaků
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-white/5"
                  style={{ color: copied ? "var(--gold)" : "var(--text-muted)" }}
                >
                  {copied ? (
                    <>
                      <CheckIcon size={12} />
                      Zkopírováno
                    </>
                  ) : (
                    <>
                      <SparklesIcon size={12} />
                      Kopírovat HTML
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-white/5"
                  style={{ color: showCode ? "var(--gold)" : "var(--text-muted)" }}
                >
                  <SparklesIcon size={12} />
                  {showCode ? "Skrýt kód" : "Zobrazit kód"}
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-white/5"
                  style={{ color: "var(--text-muted)" }}
                >
                  <ArrowRightIcon size={12} className="rotate-[-135deg]" />
                  Nový
                </button>
              </div>
            </div>

            {/* Preview */}
            <div
              className="overflow-hidden rounded-2xl border shadow-2xl"
              style={{
                borderColor: "var(--border)",
                boxShadow: '0 0 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(200, 150, 46, 0.2)',
              }}
            >
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

            {/* Code view */}
            {showCode && (
              <div
                className="mt-4 overflow-hidden rounded-2xl border animate-fade-in"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="flex items-center justify-between border-b px-4 py-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    HTML
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                    {generatedHtml.length.toLocaleString()} chars
                  </span>
                </div>
                <div className="p-4">
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
              </div>
            )}

            {/* Quick actions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={handleReset}
                className="btn-apple btn-apple-secondary"
              >
                <SparklesIcon size={14} />
                Generovat něco jiného
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="container-narrow pb-20">
            <div
              className="rounded-xl border p-4 text-sm animate-shake"
              style={{
                borderColor: "rgba(239, 68, 68, 0.3)",
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                color: "#ef4444",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">Chyba</span>
              </div>
              {error}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
