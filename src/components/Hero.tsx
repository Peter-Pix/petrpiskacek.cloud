"use client";

import { useEffect, useRef, useState } from "react";

// Rotující výroky — typewriter efekt jako na ostatních stránkách
const ROTATING_QUOTES = [
  "Sny jsou kód.",
  "Minimalismus.",
  "Vyšší úroveň.",
  "To podstatné.",
];

export default function Hero() {
  const [quoteText, setQuoteText] = useState("");
  const [quoteVisible, setQuoteVisible] = useState(true);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quoteIdxRef = useRef(0);
  const quoteCharRef = useRef(0);
  const cancelledRef = useRef(false);

  // Typewriter pro rotující výroky — lokální efekt, žádná rekurze v render fázi
  useEffect(() => {
    cancelledRef.current = false;

    const startQuoteTyping = () => {
      if (cancelledRef.current) return;
      const text = ROTATING_QUOTES[quoteIdxRef.current];
      quoteCharRef.current = 0;
      setQuoteText("");
      setQuoteVisible(true);

      const typeChar = () => {
        if (cancelledRef.current) return;
        if (quoteCharRef.current < text.length) {
          setQuoteText(text.slice(0, quoteCharRef.current + 1));
          quoteCharRef.current++;
          const delay = text[quoteCharRef.current - 1] === " " ? 100 : 80;
          timeoutRef.current = setTimeout(typeChar, delay);
        } else {
          // Pauza po dopsání
          timeoutRef.current = setTimeout(doBlink, 2500);
        }
      };

      timeoutRef.current = setTimeout(typeChar, 400);
    };

    const doBlink = () => {
      if (cancelledRef.current) return;
      let blinkCount = 0;
      const blink = () => {
        if (cancelledRef.current) return;
        if (blinkCount >= 4) {
          // Blur fade-out
          setQuoteVisible(false);
          timeoutRef.current = setTimeout(() => {
            if (cancelledRef.current) return;
            quoteIdxRef.current = (quoteIdxRef.current + 1) % ROTATING_QUOTES.length;
            timeoutRef.current = setTimeout(startQuoteTyping, 800);
          }, 1000);
          return;
        }
        setQuoteVisible((v) => !v);
        blinkCount++;
        timeoutRef.current = setTimeout(blink, 300);
      };
      blink();
    };

    timeoutRef.current = setTimeout(startQuoteTyping, 400);

    return () => {
      cancelledRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <section className="hero-bg relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 text-center">
        <div className="hero-grid" aria-hidden="true" />

        <div className="container-narrow relative z-10">
          <p className="eyebrow mb-4 animate-fade-in-up" style={{ color: "var(--gold)" }}>
            AI Playground
          </p>

          <h1
            className="headline-xl mb-4"
            style={{
              minHeight: "1.4em",
              transition: "opacity 1s ease, filter 1s ease",
              opacity: quoteVisible ? 1 : 0,
              filter: quoteVisible ? "blur(0)" : "blur(8px)",
            }}
          >
            <span>{quoteText}</span>
            {quoteVisible && <span className="terminal-cursor" />}
          </h1>

          <p
            className="subhead mx-auto mb-10 max-w-xl animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Vytváření nástrojů, posouvání hranice.
          </p>

          <div
            className="flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a href="#apps" className="btn-apple w-full sm:w-auto text-white border-transparent bg-transparent">
              Chci to vidět
            </a>
            <a href="/challenge" className="btn-apple btn-apple-secondary w-full sm:w-auto">
              Vyzkoušej to
            </a>
          </div>
        </div>
      </section>

      {/* Terminal — samostatná sekce, ~70% viewport */}
      <section className="relative flex min-h-[70vh] items-center justify-center px-5">
        <div
          className="w-full max-w-2xl rounded-2xl border p-6 text-left font-mono text-sm md:p-8 md:text-base animate-glitch"
          style={{
            height: "min(70vh, 500px)",
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
              petrpiskacek.cloud — ~/projects/ai-lab
            </span>
          </div>

          <div className="h-[calc(100%-40px)] space-y-1.5 overflow-y-auto text-left scrollbar-none">
            <div>
              <span style={{ color: "var(--gold)" }}>$</span>{" "}
              <span className="terminal-cursor" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
