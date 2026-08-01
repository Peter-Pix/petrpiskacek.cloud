"use client";

import { useState } from "react";
import { SparklesIcon, ArrowRightIcon, RefreshIcon } from "./icons";
import type { Block, BlockKind, BlockWithMeta, ClarifyQuestion } from "@/lib/sparring-types";

const DAILY_LIMIT = 5;

const RATE_LIMIT_MESSAGES = [
  "Dneska už stačilo.",
  "Zítra je taky den.",
  "Šetři tokeny, člověče.",
  "Brzdi! Nádech, výdech.",
  "Klikáš to jak kliťák. Relax, tygře.",
  "Nestačí? Petr ti spíchne lepší hračku.",
  "Kámo, to není automat.",
  "Nezvonil někdo? Běž otevřít.",
  "Jindy, dneska už stačilo.",
  "Nemáš nic lepšího na práci?",
];

type Phase = "input" | "clarify" | "blocks" | "done";

const BLOCK_ORDER: BlockKind[] = ["core", "stack", "costs", "timeline"];

const BLOCK_LABELS: Record<BlockKind, string> = {
  core: "Jádro",
  stack: "Stack",
  costs: "Náklady",
  timeline: "Postup",
};

const SAMPLE_PROMPTS = [
  "AI asistent pro malou logistickou firmu, 10 řidičů",
  "Chatbot pro e-shop, co odpoví na dotazy o velikostech",
  "Interní nástroj na shrnutí meetingů, tým 30 lidí",
  "AI na analýzu smluv pro právní firmu",
  "Služba pro automatickou transkripci lékařských zpráv",
  "Systém pro generování personalizovaných pohádek pro děti",
  "AI agent pro monitoring konkurence v e-commerce",
  "Nástroj na automatickou analýzu sentimentu recenzí hotelů",
  "AI průvodce pro začínající investory v kryptoměnách",
  "Aplikace pro inteligentní plánování stravovacího režimu",
];

export default function SparringForm() {
  const [phase, setPhase] = useState<Phase>("input");
  const [prompt, setPrompt] = useState("");
  const [randomizing, setRandomizing] = useState(false);
  const [questions, setQuestions] = useState<ClarifyQuestion[]>([]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [blocks, setBlocks] = useState<Partial<Record<BlockKind, BlockWithMeta>>>({});
  const [currentBlockIdx, setCurrentBlockIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitRemaining, setLimitRemaining] = useState(DAILY_LIMIT);

  async function handleRandomPrompt() {
    if (loading) return;
    setRandomizing(true);
    try {
      const res = await fetch("/api/sparring/random-prompt", {
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
      const randomSample = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
      setPrompt(randomSample);
    } finally {
      setRandomizing(false);
    }
  }

  async function handleStart() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sparring/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const remaining = res.headers.get("X-RateLimit-Remaining");
      if (remaining) setLimitRemaining(parseInt(remaining, 10));

      if (res.status === 429) {
        const msg = RATE_LIMIT_MESSAGES[Math.floor(Math.random() * RATE_LIMIT_MESSAGES.length)];
        throw new Error(msg);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Nepodařilo se spojit s AI");
      }
      const data = await res.json();
      setQuestions(data.questions || []);
      // Inicializovat answers
      const initialAnswers: Record<string, string> = {};
      for (const q of data.questions || []) {
        initialAnswers[q.id] = "";
      }
      setAnswers(initialAnswers);
      setPhase("clarify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Něco se pokazilo");
    } finally {
      setLoading(false);
    }
  }

  async function generateBlock(kind: BlockKind, finalAnswers: Record<string, string>) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sparring/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          answers: finalAnswers,
          blockKind: kind,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Nepodařilo se vygenerovat blok");
      }
      const data = await res.json();
      if (!data.block) {
        throw new Error(data.error || "API nevrátilo platný blok");
      }
      setBlocks((prev) => ({
        ...prev,
        [kind]: { block: data.block, expanded: false },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Něco se pokazilo");
      setPhase("input");
    } finally {
      setLoading(false);
    }
  }

  async function handleNextBlock() {
    const nextIdx = currentBlockIdx + 1;
    if (nextIdx >= BLOCK_ORDER.length) {
      setPhase("done");
      return;
    }
    setCurrentBlockIdx(nextIdx);
    const nextKind = BLOCK_ORDER[nextIdx];
    if (!blocks[nextKind]) {
      await generateBlock(nextKind, answers);
    }
  }

  async function handleExpand(kind: BlockKind) {
    const current = blocks[kind];
    if (!current || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/sparring/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          answers,
          blockKind: kind,
          currentBlock: current.block,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Nepodařilo se rozšířit");
      }
      const data = await res.json();
      setBlocks((prev) => ({
        ...prev,
        [kind]: { block: prev[kind]!.block, expanded: true, expansion: data.expansion },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Něco se pokazilo");
    } finally {
      setLoading(false);
    }
  }

  async function handleClarifySubmit() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      setPhase("blocks");
      setCurrentBlockIdx(0);
      // První blok vygenerujeme hned
      await generateBlock(BLOCK_ORDER[0], answers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Něco se pokazilo");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setPhase("input");
    setPrompt("");
    setQuestions([]);
    setAnswers({});
    setBlocks({});
    setCurrentBlockIdx(0);
    setLoading(false);
    setError("");
  }

  return (
    <section className="section-apple">
      <div className="container-narrow">
        <p className="eyebrow mb-3 text-center">Sparring</p>
        <h2 className="headline-lg mb-4 text-center">
          Promysli to lépe
        </h2>
        <p className="subhead mx-auto mb-10 max-w-xl text-center">
          Vyber téma. Douptám se. Uvidíš sám.
        </p>

        {/* Fáze 0: Input */}
        {phase === "input" && (
          <div className="animate-fade-in mx-auto max-w-2xl">
            <div
              className="mb-6 overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--border)" }}
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Slovní popis tvého nápadu..."
                rows={4}
                className="w-full resize-none bg-transparent px-5 py-4 text-sm outline-none text-center"
                style={{
                  color: "var(--input-text)",
                  opacity: 0.8,
                  caretColor: "var(--gold)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    void handleStart();
                  }
                }}
              />
              <div
                className="flex items-center justify-between border-t px-5 py-3"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Rate limit indikátor */}
                <div className="flex items-center gap-2 text-xs" style={{ color: limitRemaining <= 2 ? '#ef4444' : 'var(--text-muted)' }}>
                  <div className="flex gap-0.5">
                    {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full transition-all"
                        style={{
                          backgroundColor: i < limitRemaining ? 'var(--gold)' : 'var(--border)',
                          opacity: i < limitRemaining ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                  <span>{limitRemaining}/{DAILY_LIMIT} dnes</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => void handleRandomPrompt()}
                  disabled={loading}
                  className="w-full sm:w-48 rounded-full border px-4 py-2 text-xs transition-all hover:bg-white/5 flex items-center justify-center gap-2"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-muted)",
                    backgroundColor: "transparent",
                    minHeight: "36px"
                  }}
                >
                  <SparklesIcon size={14} />
                  {randomizing ? "Přemýšlím..." : "Zkusit náhodně"}
                </button>
                
                <button
                  onClick={() => void handleStart()}
                  disabled={!prompt.trim() || loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all"
                  style={{
                    backgroundColor: prompt.trim() && !loading ? "var(--gold)" : "var(--tag-bg)",
                    color: prompt.trim() && !loading ? "var(--text-inverse)" : "var(--text-muted)",
                  }}
                >
                  {loading ? (
                    "Přemýšlím..."
                  ) : (
                    <>
                      Promyslet
                      <ArrowRightIcon size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
            </div>

            <p
              className="text-center text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              ⌘ + Enter pro start
            </p>
          </div>
        )}

        {/* Fáze 1: Clarify */}
        {phase === "clarify" && (
          <div className="animate-fade-in mx-auto max-w-2xl">
            <div
              className="mb-8 rounded-2xl border p-5 text-center"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Tvoje zadání
              </p>
              <p className="mt-1 text-sm font-medium">{prompt}</p>
            </div>

            <p
              className="mb-6 text-center text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Než začnu, potřebuju vědět:
            </p>

            <div className="mb-8 space-y-5">
              {questions.map((q) => (
                <div key={q.id} className="text-center">
                  <label
                    htmlFor={q.id}
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {q.text}
                  </label>
                  <input
                    id={q.id}
                    type="text"
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="Tvoje odpověď..."
                    className="mx-auto block w-full max-w-md rounded-xl border bg-transparent px-4 py-2.5 text-sm outline-none"
                    style={{
                      borderColor: "var(--input-border)",
                      color: "var(--input-text)",
                      caretColor: "var(--gold)",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // Pokud je to poslední otázka, odešli
                        if (q === questions[questions.length - 1]) {
                          void handleClarifySubmit();
                        }
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor: "var(--tag-bg)",
                  color: "var(--text-secondary)",
                }}
              >
                Zpět
              </button>
              <button
                onClick={() => void handleClarifySubmit()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all"
                style={{
                  backgroundColor: loading ? "var(--tag-bg)" : "var(--gold)",
                  color: loading ? "var(--text-muted)" : "var(--text-inverse)",
                }}
              >
                {loading ? "Přemýšlím..." : "Pokračovat"}
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Fáze 2: Blocks */}
        {phase === "blocks" && (
          <div className="animate-fade-in mx-auto max-w-2xl">
            {/* Progress */}
            <div className="mb-8 text-center">
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Blok {currentBlockIdx + 1} z {BLOCK_ORDER.length} — {BLOCK_LABELS[BLOCK_ORDER[currentBlockIdx]]}
              </p>
              <button
                onClick={handleReset}
                className="mt-2 text-xs underline"
                style={{ color: "var(--text-muted)" }}
              >
                Začít znovu
              </button>
            </div>

            {/* Generované bloky (všechny doposud) */}
            <div className="space-y-5">
              {BLOCK_ORDER.slice(0, currentBlockIdx + 1).map((kind, idx) => {
                const block = blocks[kind];
                if (!block) {
                  // Generuje se
                  return (
                    <div
                      key={kind}
                      className="glass-card flex items-center justify-center gap-3 p-5"
                    >
                      <RefreshIcon size={16} className="animate-spin-slow" />
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Generuju {BLOCK_LABELS[kind].toLowerCase()}...
                      </span>
                    </div>
                  );
                }
                return (
                  <BlockCard
                    key={kind}
                    kind={kind}
                    block={block.block}
                    expansion={block.expansion}
                    isCurrent={idx === currentBlockIdx}
                    onExpand={() => void handleExpand(kind)}
                    expanding={loading && idx === currentBlockIdx}
                  />
                );
              })}
            </div>

            {/* Next button */}
            {currentBlockIdx < BLOCK_ORDER.length - 1 &&
              blocks[BLOCK_ORDER[currentBlockIdx]] && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => void handleNextBlock()}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: loading ? "var(--tag-bg)" : "var(--gold)",
                      color: loading ? "var(--text-muted)" : "var(--text-inverse)",
                    }}
                  >
                    Další blok
                    <ArrowRightIcon size={16} />
                  </button>
                </div>
              )}
          </div>
        )}

        {/* Fáze 3: Done */}
        {phase === "done" && (
          <div className="animate-fade-in mx-auto max-w-2xl">
            <div className="space-y-5">
              {BLOCK_ORDER.map((kind) => {
                const block = blocks[kind];
                if (!block) return null;
                return (
                  <BlockCard
                    key={kind}
                    kind={kind}
                    block={block.block}
                    expansion={block.expansion}
                    isCurrent={false}
                    onExpand={() => void handleExpand(kind)}
                    expanding={false}
                  />
                );
              })}
            </div>

            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Plán je hotový. Můžeš ho rozšířit na jednotlivých blocích, nebo začít znovu.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor: "var(--tag-bg)",
                  color: "var(--text-secondary)",
                }}
              >
                <RefreshIcon size={14} />
                Začít znovu s jiným zadáním
              </button>
            </div>
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

function BlockCard({
  kind,
  block,
  expansion,
  isCurrent,
  onExpand,
  expanding,
}: {
  kind: BlockKind;
  block: Block;
  expansion?: string;
  isCurrent: boolean;
  onExpand: () => void;
  expanding: boolean;
}) {
  return (
    <div
      className="glass-card p-5 md:p-6 animate-fade-in-up"
      style={{
        borderColor: isCurrent ? "var(--gold)" : undefined,
        transition: "border-color 0.5s ease",
      }}
    >
      <div className="mb-4 flex items-center justify-center relative">
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--gold)" }}
        >
          {BLOCK_LABELS[kind]}
        </h3>
        <button
          onClick={onExpand}
          disabled={expanding}
          className="absolute right-0 text-xs transition-opacity disabled:opacity-30"
          style={{ color: "var(--text-muted)" }}
        >
          {expanding ? "Přemýšlím..." : "↻ Rozveď"}
        </button>
      </div>

      <BlockContent block={block} />

      {expansion && (
        <div
          className="mt-3 rounded-xl p-3 text-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            className="mb-1 text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Rozšíření
          </p>
          {expansion}
        </div>
      )}
    </div>
  );
}

function BlockContent({ block }: { block: Block }) {
  if (block.kind === "core") {
    return (
      <div className="space-y-3">
        <div>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Co to je
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {block.what}
          </p>
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Pro koho
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {block.forWhom}
          </p>
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Hlavní feature
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {block.mainFeature}
          </p>
        </div>
      </div>
    );
  }

  if (block.kind === "stack") {
    const items = [
      { label: "Frontend", value: block.frontend },
      { label: "Backend", value: block.backend },
      { label: "Databáze", value: block.database },
      { label: "AI", value: block.ai },
      { label: "Infra", value: block.infra },
    ];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg p-2.5 text-center"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              {item.label}
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === "costs") {
    return (
      <div className="space-y-3">
        <CostRow label="Jednorázově (implementace)" value={block.oneTime} />
        <CostRow label="Měsíčně (provoz)" value={block.monthly} />
        <CostRow label="MVP" value={block.mvp} />
        {block.note && (
          <p
            className="mt-2 text-xs italic"
            style={{ color: "var(--text-muted)" }}
          >
            {block.note}
          </p>
        )}
      </div>
    );
  }

  if (block.kind === "timeline") {
    return (
      <div className="space-y-3">
        <TimelineRow label="Fáze 1 (1-2 týdny)" value={block.prvniFaze} />
        <TimelineRow label="Fáze 2 (2-4 týdny)" value={block.druhaFaze} />
        <TimelineRow label="Fáze 3 (1+ měsíc)" value={block.tretiFaze} />
      </div>
    );
  }

  return null;
}

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {value}
      </p>
    </div>
  );
}

function TimelineRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg p-3"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border)",
      }}
    >
      <p
        className="mb-1 text-[10px] uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {value}
      </p>
    </div>
  );
}
