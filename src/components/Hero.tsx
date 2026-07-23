"use client";

import { useEffect, useRef, useState } from "react";

const terminalLines = [
  { text: "$ ./apps", delay: 600 },
  { text: "> 4 online · 1 beta · 1 brzy", delay: 500 },
  { text: "", delay: 300 },
  { text: "$ ./status", delay: 400 },
  { text: "> Všechno běží.", delay: 500 },
];

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [typing, setTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const charIndexRef = useRef(0);

  useEffect(() => {
    if (visibleLines >= terminalLines.length) {
      const t = setTimeout(() => setShowCursor(false), 0);
      return () => clearTimeout(t);
    }

    const line = terminalLines[visibleLines];
    if (!line.text) {
      const t = setTimeout(() => {
        setVisibleLines((v) => v + 1);
      }, line.delay);
      return () => clearTimeout(t);
    }

    queueMicrotask(() => {
      setTyping(true);
      setTypedText("");
    });
    const text = line.text;
    charIndexRef.current = 0;

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
          AI Playground
        </p>

        {/* Terminal */}
        <div
          className="mx-auto mb-8 max-w-lg rounded-2xl border p-5 text-left font-mono text-sm md:p-6"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/60" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <span className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
              petrpiskacek.cloud
            </span>
          </div>

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

            {visibleLines < terminalLines.length && (
              <div>
                <span style={{ color: "var(--gold)" }}>$</span>{" "}
                <span>{typedText}</span>
                {showCursor && <span className="terminal-cursor" />}
              </div>
            )}
          </div>
        </div>

        <h1
          className="headline-xl mb-4 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          AI, která pracuje.
        </h1>

        <p
          className="subhead mx-auto mb-8 max-w-xl animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          Každá appka dole běží naostro. Klikni a vyzkoušej.
        </p>

        <div
          className="flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <a href="#apps" className="btn-apple btn-apple-primary w-full sm:w-auto">
            Prohlédnout appky
          </a>
          <a href="/challenge" className="btn-apple btn-apple-secondary w-full sm:w-auto">
            Otestuj AI konzultanta
          </a>
        </div>
      </div>
    </section>
  );
}
