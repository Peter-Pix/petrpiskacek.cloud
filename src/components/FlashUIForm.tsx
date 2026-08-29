"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SparklesIcon, RefreshIcon, CheckIcon, ExternalLinkIcon } from "./icons";

const RANDOM_PROMPTS = [
  "Premium dashboard s metrikama, sparklines a gold akcentem",
  "Moderní přihlašovací stránka s glassmorphism efektem",
  "Interaktivní cenová tabulka s 3 plány a hover efekty",
  "Chatové rozhraní s bublinama, avatarama a timestampama",
  "Firemní landing page s hero sekcí, logem a CTA tlačítkem",
  "Temný admin panel s postranním menu a grafy",
  "Karta produktu s obrázkem, cenou a hodnocením hvězdičkami",
  "Newsletter přihlašovací formulář s moderním designem",
  "Timeline komponenta pro zobrazení milníků projektu",
  "Testimonials carousel s avatarama a citátama",
  "Statistický widget s číselnými metrikami a sparkline grafy",
  "Modal okno pro potvrzení akce s animací",
  "Vyhledávací lišta s dropdown výsledky a našeptávačem",
  "Notification toast s různými stavy (success, error, warning)",
  "Profilová karta uživatele s avatarama, jménem a statistikama",
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

const DAILY_LIMIT = 5;

// Particle background
function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, var(--gold) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.08] blur-[100px] animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, var(--gold), transparent 70%)' }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.06] blur-[80px] animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, var(--gold), transparent 70%)', animationDelay: '2s' }}
      />
    </div>
  );
}

// Rotating placeholder
function RotatingPlaceholder({ isActive }: { isActive: boolean }) {
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
    <span className="absolute left-5 top-4 text-sm pointer-events-none"
      style={{ color: 'var(--text-muted)' }}
    >
      <span className="opacity-50">Napiš </span>
      <span key={index} className="inline-block animate-typewriter" style={{ color: 'var(--gold)' }}>
        {ROTATING_TEXTS[index]}
      </span>
    </span>
  );
}

// Loading state
function LoadingState({ html }: { html: string }) {
  const chars = html.length;
  const lines = html.split('\n').length;

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
          Přemýšlím...
        </p>
        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {chars > 0 ? `${chars} znaků · ${lines} řádků` : 'Připravuji návrh...'}
        </p>
      </div>
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

// Rate limit dots
function RateLimitIndicator({ remaining }: { remaining: number }) {
  const isLow = remaining <= 2;
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: isLow ? '#ef4444' : 'var(--text-muted)' }}>
      <div className="flex gap-0.5">
        {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{
              backgroundColor: i < remaining ? 'var(--gold)' : 'var(--border)',
              opacity: i < remaining ? 1 : 0.3,
            }}
          />
        ))}
      </div>
      <span>{remaining}/{DAILY_LIMIT} dnes</span>
    </div>
  );
}

export default function FlashUIForm() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [randomizing, setRandomizing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [limitRemaining, setLimitRemaining] = useState(DAILY_LIMIT);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Build complete HTML document for iframe
  const buildPreviewHtml = useCallback((rawHtml: string) => {
    if (!rawHtml.trim()) return '';

    // If already complete document, return as-is
    if (rawHtml.includes('<!DOCTYPE html>') || rawHtml.includes('<html>')) {
      return rawHtml;
    }

    // Wrap incomplete HTML
    return `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0a0a0a; color: #e5e5e5; font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 2rem; }
</style>
</head>
<body>
${rawHtml}
</body>
</html>`;
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (hasResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hasResult]);

  async function handleRandomPrompt() {
    if (loading || randomizing) return;
    setRandomizing(true);
    try {
      const res = await fetch("/api/flash-ui/random-prompt", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to fetch random prompt");
      const data = await res.json();
      
      // Ensure a minimum animation time for a smooth feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPrompt(data.prompt);
    } catch {
      // Fallback to local samples if API fails
      await new Promise(resolve => setTimeout(resolve, 1500));
      const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
      setPrompt(random);
    } finally {
      setRandomizing(false);
    }
    textareaRef.current?.focus();
  }

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    abortRef.current?.abort();

    setLoading(true);
    setError("");
    setHtml("");
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

      const remaining = res.headers.get("X-RateLimit-Remaining");
      if (remaining) setLimitRemaining(parseInt(remaining));

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(res.status === 429
          ? data.message || `Denní limit ${DAILY_LIMIT} vyčerpán. Zkus to zítra.`
          : data.error || "Chyba při generování"
        );
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        setHtml(accumulated);
      }

      // Prázdný stream = AI nevrátila žádný HTML (např. model odpověděl
      // textem místo kódu). Chybí viditelná chyba místo tichého failu.
      if (!accumulated.trim()) {
        setError("AI nevrátila žádný kód. Zkus jiný nebo konkrétnější prompt.");
        setHtml("");
      } else {
        setHasResult(true);
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
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleReset() {
    setPrompt("");
    setHtml("");
    setError("");
    setCopied(false);
    setShowCode(false);
    setHasResult(false);
    textareaRef.current?.focus();
  }

  const previewHtml = buildPreviewHtml(html);

  return (
    <section className="relative min-h-[calc(100svh-80px)] flex flex-col">
      <ParticleBackground />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Input hero */}
        <div className={`flex-1 flex flex-col items-center justify-center px-5 transition-all duration-700 ${hasResult ? 'pt-10 pb-6' : 'py-20'}`}>
          {!hasResult && (
            <div className="text-center mb-8 animate-fade-in-up">
              <h2 className="headline-lg mb-3">
                Flash <span style={{ color: 'var(--gold)' }}>UI</span>
              </h2>
              <p className="subhead mx-auto max-w-lg">
                Navrhni UI komponentu. Napiš, co potřebuješ, a já to udělám.
              </p>
            </div>
          )}

          <div className="w-full max-w-2xl">
            <div
              className="relative overflow-hidden rounded-2xl border transition-all duration-300 focus-within:border-gold/50 focus-within:shadow-[0_0_30px_rgba(200,150,46,0.1)]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="relative">
                <RotatingPlaceholder isActive={prompt.length > 0 || loading} />
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={hasResult ? 2 : 3}
                  className="w-full resize-none bg-transparent px-5 py-4 text-sm outline-none"
                  style={{ color: "var(--input-text)", caretColor: "var(--gold)" }}
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
                <RateLimitIndicator remaining={limitRemaining} />

                <div className="flex gap-2">
                  {loading && (
                    <button
                      onClick={handleStop}
                      className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-all hover:bg-white/5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      Zastavit
                    </button>
                  )}
                  {hasResult && (
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-all hover:bg-white/5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <RefreshIcon size={12} />
                      Nový
                    </button>
                  )}
                  <button
                    onClick={() => void handleRandomPrompt()}
                    disabled={loading || randomizing}
                    className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-all"
                    style={{
                      color: randomizing ? "var(--text-muted)" : "var(--text-secondary)",
                    }}
                  >
                    {randomizing ? (
                      <>
                        <RefreshIcon size={12} className="animate-spin-slow" />
                        Hledám
                      </>
                    ) : (
                      <>
                        <RefreshIcon size={12} />
                        Zkusit náhodně
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => void handleGenerate()}
                    disabled={!prompt.trim() || loading}
                    className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: prompt.trim() && !loading ? "rgba(200, 150, 46, 0.15)" : "var(--tag-bg)",
                      color: prompt.trim() && !loading ? "var(--gold)" : "var(--text-muted)",
                    }}
                  >
                    {loading ? (
                      <>
                        <RefreshIcon size={12} className="animate-spin-slow" />
                        Navrhuju
                      </>
                    ) : (
                      <>
                        <SparklesIcon size={12} />
                        Navrhnout
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {!hasResult && !loading && (
              <div className="mt-6 animate-fade-in-up text-center">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Cmd/Ctrl + Enter pro rychlé odeslání
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && !hasResult && (
          <div className="flex-1 flex items-center justify-center">
            <LoadingState html={html} />
          </div>
        )}

        {/* Result */}
        {hasResult && previewHtml && (
          <div ref={resultRef} className="container-narrow pb-20 animate-fade-in">
            {/* Result toolbar */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Náhled
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {html.length.toLocaleString()} znaků
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-all hover:bg-white/5"
                  style={{ color: copied ? "var(--gold)" : "var(--text-muted)" }}
                >
                  {copied ? <><CheckIcon size={12} /> Zkopírováno</> : <><ExternalLinkIcon size={12} /> Kopírovat</>}
                </button>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-all hover:bg-white/5"
                  style={{ color: showCode ? "var(--gold)" : "var(--text-muted)" }}
                >
                  {showCode ? "Skrýt kód" : "Zobrazit kód"}
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-all hover:bg-white/5"
                  style={{ color: "var(--text-muted)" }}
                >
                  <RefreshIcon size={12} />
                  Ještě jednou
                </button>
              </div>
            </div>

            {/* Preview iframe */}
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: "var(--border)",
                boxShadow: '0 0 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              <iframe
                ref={iframeRef}
                srcDoc={previewHtml}
                className="w-full border-0"
                style={{ height: "500px", backgroundColor: "#0a0a0a" }}
                title="Flash UI náhled"
                sandbox="allow-scripts"
                loading="lazy"
              />
            </div>

            {/* Code view */}
            {showCode && (
              <div className="mt-4 overflow-hidden rounded-2xl border animate-fade-in" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between border-b px-4 py-2" style={{ borderColor: "var(--border)" }}>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>HTML</span>
                  <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{html.length.toLocaleString()} chars</span>
                </div>
                <div className="p-4">
                  <pre className="overflow-x-auto rounded-xl p-4 text-xs leading-relaxed"
                    style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}
                  >
                    <code>{html}</code>
                  </pre>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Error */}
        {error && (
          <div className="container-narrow pb-20">
            <div className="rounded-xl border p-4 text-sm animate-shake"
              style={{
                borderColor: "rgba(239, 68, 68, 0.3)",
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                color: "#ef4444",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>⚠️</span>
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
