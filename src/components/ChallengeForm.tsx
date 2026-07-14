"use client";

import { useState, useRef, useEffect } from "react";
import { SparklesIcon, CpuIcon } from "./icons";

interface Section {
  title: string;
  content: string;
}

export default function ChallengeForm() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sections, currentSection]);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setSections([]);
    setCurrentSection("");
    setDone(false);
    setError("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Generation failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse sections from buffer
        const sectionRegex = /## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g;
        const newSections: Section[] = [];
        let match;

        while ((match = sectionRegex.exec(buffer)) !== null) {
          newSections.push({
            title: match[1].trim(),
            content: match[2].trim(),
          });
        }

        if (newSections.length > 0) {
          setSections(newSections);
        }

        // Show remaining buffer as current section
        const lastSectionEnd = buffer.lastIndexOf("## ");
        const remaining = lastSectionEnd >= 0 ? buffer.slice(lastSectionEnd) : buffer;
        setCurrentSection(remaining);
      }

      setDone(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
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

  return (
    <section className="section-apple">
      <div className="container-narrow">
        <p className="eyebrow mb-3 text-center">Otestuj mě</p>
        <h2 className="headline-lg mb-4 text-center">
          Zadej mi úkol.
        </h2>
        <p className="subhead mx-auto mb-10 max-w-xl text-center">
          Napiš problém. Do 30 sekund uvidíš architekturu, cenu, roadmapu a technologie.
        </p>

        {/* Input */}
        <div
          className="mb-8 overflow-hidden rounded-2xl border"
          style={{ borderColor: "var(--border)" }}
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Navrhni mi AI řešení pro logistickou firmu..."
            rows={4}
            className="w-full resize-none bg-transparent px-5 py-4 text-sm outline-none"
            style={{
              color: "var(--input-text)",
              caretColor: "var(--gold)",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleGenerate();
              }
            }}
          />
          <div
            className="flex items-center justify-between border-t px-5 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {prompt.length > 0 ? `${prompt.length} znaků` : "Napiš zadání..."}
            </span>
            <div className="flex gap-2">
              {loading ? (
                <button
                  onClick={handleStop}
                  className="btn-apple"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    color: "#ef4444",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="btn-apple btn-apple-primary"
                >
                  <SparklesIcon size={16} />
                  Generovat
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 rounded-xl border p-4 text-sm"
            style={{
              borderColor: "rgba(239, 68, 68, 0.3)",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && sections.length === 0 && !currentSection && (
          <div className="flex items-center justify-center gap-3 py-12">
            <CpuIcon size={24} className="animate-pulse-slow" />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Generuji řešení...
            </span>
          </div>
        )}

        {/* Sections */}
        {sections.length > 0 && (
          <div className="space-y-6">
            {sections.map((section, i) => (
              <div
                key={i}
                className="glass-card p-5 md:p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--gold)" }}>
                  {section.title}
                </h3>
                <div
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--text-secondary)" }}
                  dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
                />
              </div>
            ))}

            {/* Streaming current section */}
            {currentSection && !done && (
              <div className="glass-card p-5 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-gold animate-pulse-slow" />
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Generuje se...
                  </span>
                </div>
                <div
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {currentSection.replace(/^## /, "")}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Done footer */}
        {done && (
          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Generováno živě pomocí Petr&apos;s AI stacku.
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}

function formatContent(text: string): string {
  // Convert markdown-like syntax to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, "<code style='background:var(--tag-bg);padding:1px 4px;border-radius:3px;font-size:0.9em'>$1</code>")
    .replace(/\n/g, "<br/>");
}
