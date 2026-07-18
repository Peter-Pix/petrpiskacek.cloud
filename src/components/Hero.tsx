"use client";

import { useEffect, useRef, useState } from "react";

const terminalLines = [
  { text: "$ whoami", delay: 300 },
  { text: "> Petr Piskáček", delay: 600 },
  { text: "> I build AI systems", delay: 400 },
  { text: "> Stavím AI systémy, které něco dělají.", delay: 500 },
  { text: "", delay: 200 },
  { text: "$ ./status", delay: 400 },
  { text: "> AI Lab · 5 služeb online", delay: 500 },
  { text: "> Uptime: 99.7 %", delay: 400 },
  { text: "> Poslední deploy: dnes", delay: 400 },
];

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [typing, setTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const currentLineRef = useRef(0);
  const charIndexRef = useRef(0);

  useEffect(() => {
    if (visibleLines >= terminalLines.length) {
      const t = setTimeout(() => setShowCursor(false), 0);
      return () => clearTimeout(t);
    }

    const line = terminalLines[visibleLines];
    if (!line.text) {
      // Empty line — just advance
      const t = setTimeout(() => {
        setVisibleLines((v) => v + 1);
      }, line.delay);
      return () => clearTimeout(t);
    }

    setTyping(true);
    const text = line.text;
    charIndexRef.current = 0;
    setTypedText("");

    const typeChar = () => {
      if (charIndexRef.current < text.length) {
        setTypedText(text.slice(0, charIndexRef.current + 1));
        charIndexRef.current++;
        const delay = text[charIndexRef.current - 1] === " " ? 30 : Math.random() * 40 + 20;
        setTimeout(typeChar, delay);
      } else {
        setTyping(false);
        setTimeout(() => {
          setVisibleLines((v) => v + 1);
          setTypedText("");
        }, terminalLines[visibleLines].delay);
      }
    };

    const startDelay = setTimeout(typeChar, 200);
    return () => clearTimeout(startDelay);
  }, [visibleLines]);

  return (
    <section className="hero-bg relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 text-center">
      <div className="hero-grid" aria-hidden="true" />

      <div className="container-narrow relative z-10">
        <p className="eyebrow mb-4 animate-fade-in-up" style={{ color: "var(--gold)" }}>
          AI infrastruktura &amp; experimenty
        </p>

        {/* Terminal */}
        <div
          className="mx-auto mb-10 max-w-xl rounded-2xl border p-5 text-left font-mono text-sm md:p-6"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Terminal header */}
          <div className="mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/60" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <span className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
              petrpiskacek.cloud — bash
            </span>
          </div>

          {/* Terminal lines */}
          <div className="space-y-1 text-left">
            {Array.from({ length: visibleLines }).map((_, i) => {
              const line = terminalLines[i];
              if (!line.text) return <div key={i} className="h-4" />;
              const isCommand = line.text.startsWith("$");
              const isOutput = line.text.startsWith(">");
              return (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  {isCommand && (
                    <span>
                      <span style={{ color: "var(--gold)" }}>$</span>{" "}
                      <span>{line.text.slice(2)}</span>
                    </span>
                  )}
                  {isOutput && (
                    <span style={{ color: "var(--text-secondary)" }}>
                      {line.text}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Currently typing line */}
            {visibleLines < terminalLines.length && (
              <div>
                <span style={{ color: "var(--gold)" }}>$</span>{" "}
                <span>{typedText}</span>
                {showCursor && <span className="terminal-cursor" />}
              </div>
            )}
          </div>
        </div>

        {/* Tagline */}
        <p
          className="subhead mx-auto mb-6 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          Aktuálně experimentuju s:
        </p>

        <div
          className="mb-10 flex flex-wrap justify-center gap-2 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          {["AI Agenti", "Knowledge Graphy", "MCP", "Docker", "LLM", "SEO Automatizace"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 text-xs font-medium"
                style={{
                  borderColor: "var(--tag-border)",
                  backgroundColor: "var(--tag-bg)",
                  color: "var(--tag-text)",
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>

        {/* Live projects grid */}
        <div
          className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 animate-fade-in-up"
          style={{ animationDelay: "0.45s" }}
        >
          <a
            href="https://4rap.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="mb-1 text-lg">🎵</div>
            <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              4rap.cz
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              Databáze českého rapu
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--gold)" }}>
              <span>1248 entit</span>
              <span className="text-zinc-600">·</span>
              <span>5896 vazeb</span>
            </div>
          </a>
          <a
            href="https://karel.petrpiskacek.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="mb-1 text-lg">🤖</div>
            <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Karel Robot
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              AI e-mailový admin
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--gold)" }}>
              <span>Vyzkoušet →</span>
            </div>
          </a>
          <a
            href="/timeline"
            className="group rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="mb-1 text-lg">🧠</div>
            <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              AI Lab
            </div>
            <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              Běžící AI služby
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--gold)" }}>
              <span>5 služeb online</span>
            </div>
          </a>
        </div>

        <div
          className="flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <a href="#live-status" className="btn-apple btn-apple-primary w-full sm:w-auto">
            Živý přehled
          </a>
          <a href="/challenge" className="btn-apple btn-apple-secondary w-full sm:w-auto">
            Otestuj mě
          </a>
        </div>
      </div>
    </section>
  );
}
