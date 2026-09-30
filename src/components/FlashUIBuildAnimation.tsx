"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * FlashUIBuildAnimation
 *
 * 25s "AI staví komponentu" scéna, která běží během generování HTML
 * (flash-ui endpoint trvá ~20-25s). Místo spinneru ukazuje postupnou
 * stavbu UI: kostra → layout → styl → detaily → kompletace.
 *
 * 5 stage × 5s = 25s. Pokud by API doběhlo dřív, `progress` prop
 * (skutečný % z parenta) animaci jen vizuálně dotlačí.
 *
 * Respektuje `prefers-reduced-motion` → rychlé (0.8s/stage), bez dekorací.
 */

const STAGE_DURATION = 5000; // 5 × 5s = 25s
const REDUCED_STAGE_DURATION = 800;

interface Stage {
  eyebrow: string;
  title: string;
  description: string;
  lines: string[];
}

const STAGES: Stage[] = [
  {
    eyebrow: "Kostra",
    title: "Kreslím obrys komponenty",
    description: "Rozvrhuji, co kde bude — bloky, tlačítka, prostor.",
    lines: [
      "› Skenuji zadání…",
      "✓ Rozpoznán typ komponenty",
      "› Zakládám wireframe",
    ],
  },
  {
    eyebrow: "Layout",
    title: "Skládám rozvržení",
    description: "Řadím prvky do gridu, ladím rozestupy a zarovnání.",
    lines: [
      "› Rozvrhuji grid a sekce",
      "✓ Hierarchie usazena",
      "› Kontroluji rozestupy",
    ],
  },
  {
    eyebrow: "Styl",
    title: "Vlévám barvy a tvary",
    description: "Zaoblení, stíny, paleta. Z kostry se stává design.",
    lines: [
      "› Nanáším paletu",
      "✓ Zaoblení a stíny hotové",
      "› Ladím kontrast",
    ],
  },
  {
    eyebrow: "Detaily",
    title: "Dolaďuji detaily",
    description: "Texty, ikony, hover stavy a drobné nuance.",
    lines: [
      "› Sázím typografii",
      "✓ Ikony a stavy připraveny",
      "› Dolazuji poslední pixely",
    ],
  },
  {
    eyebrow: "Kompletace",
    title: "Finalizuji komponentu",
    description: "Poslední lesk. Za okamžik se objeví náhled.",
    lines: [
      "› Čistím markup",
      "✓ Validuji HTML",
      "✓ Připraveno k vykreslení",
    ],
  },
];

// Particles — memoizované, aby se drift nerestartoval každý render
function useParticles(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        duration: 7 + Math.random() * 6,
        delay: Math.random() * 8,
        drift: (Math.random() - 0.5) * 60,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [count],
  );
}

function Particles({ count }: { count: number }) {
  const particles = useParticles(count);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full animate-flash-particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: "var(--gold)",
            ["--p-duration" as string]: `${p.duration}s`,
            ["--p-delay" as string]: `${p.delay}s`,
            ["--p-drift" as string]: `${p.drift}px`,
            ["--p-opacity" as string]: `${p.opacity}`,
          }}
        />
      ))}
    </div>
  );
}

// Kostra komponenty, která se staví podle fáze
function BuildingWireframe({ stage }: { stage: number }) {
  const block = "rounded-lg border";
  const bord = { borderColor: "rgba(200, 150, 46, 0.25)" };
  const fill = { backgroundColor: "rgba(200, 150, 46, 0.06)" };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className={`${block} p-4 space-y-3`} style={bord}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className={`h-8 w-8 rounded-full ${stage >= 1 ? "" : "animate-flash-skeleton"}`}
            style={stage >= 2 ? { background: "linear-gradient(135deg, var(--gold), var(--gold-light))" } : fill}
          />
          <div className="flex-1 space-y-1.5">
            <div
              className={`h-2.5 rounded-full ${stage >= 1 ? "" : "animate-flash-skeleton"}`}
              style={{ width: "60%", ...(stage >= 3 ? { backgroundColor: "rgba(244,244,245,0.5)" } : fill) }}
            />
            <div
              className="h-2 rounded-full"
              style={{ width: "40%", ...fill }}
            />
          </div>
        </div>

        {/* Body rows */}
        <div className="space-y-2 pt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full ${stage >= 1 ? "" : "animate-flash-skeleton"}`}
              style={{
                width: `${90 - i * 12}%`,
                opacity: stage >= 3 ? 0.55 : 1,
                ...fill,
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div
            className="h-8 flex-1 rounded-lg"
            style={
              stage >= 3
                ? { background: "linear-gradient(135deg, var(--gold), var(--gold-light))" }
                : fill
            }
          />
          <div className="h-8 w-20 rounded-lg" style={fill} />
        </div>
      </div>

      {/* Scan beam přes kostru */}
      <div
        className="absolute top-0 bottom-0 w-16 -ml-8 animate-flash-scan pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(200,150,46,0.35), transparent)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}

export default function FlashUIBuildAnimation() {
  const [reduced, setReduced] = useState(false);
  const [stage, setStage] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Stage progression: 5 × 5s = 25s
  useEffect(() => {
    const dur = reduced ? REDUCED_STAGE_DURATION : STAGE_DURATION;
    const timer = window.setInterval(() => {
      setStage((s) => (s < STAGES.length - 1 ? s + 1 : s));
    }, dur);
    return () => window.clearInterval(timer);
  }, [reduced]);

  // Terminal readout lines per stage
  useEffect(() => {
    setVisibleLines(0);
    const current = STAGES[stage];
    const timers = current.lines.map((_, i) =>
      window.setTimeout(() => {
        setVisibleLines((n) => Math.max(n, i + 1));
      }, 350 + i * (reduced ? 120 : 700)),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [stage, reduced]);

  const current = STAGES[stage];
  const isFinal = stage === STAGES.length - 1;
  const stageIndex = stage + 1;

  return (
    <section
      className="relative py-16 px-5"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Ambient breathing glow */}
      <div
        className="absolute inset-0 pointer-events-none animate-flash-ambient"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(200,150,46,0.12), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <Particles count={18} />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg mx-auto">
        {/* Fáze / krok */}
        <div className="flex items-center gap-3" aria-hidden="true">
          {STAGES.map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full text-[10px] font-mono transition-all duration-500"
                style={{
                  width: i === stage ? 26 : 20,
                  height: i === stage ? 26 : 20,
                  backgroundColor:
                    i < stage
                      ? "rgba(200,150,46,0.9)"
                      : i === stage
                        ? "rgba(200,150,46,0.25)"
                        : "var(--tag-bg)",
                  color: i < stage ? "var(--text-inverse)" : "var(--text-muted)",
                  border:
                    i === stage ? "1px solid var(--gold)" : "1px solid transparent",
                }}
              >
                {i < stage ? "✓" : i + 1}
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className="h-px w-6 transition-all duration-500"
                  style={{
                    backgroundColor:
                      i < stage ? "rgba(200,150,46,0.7)" : "var(--border)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Wireframe, který se staví */}
        <div key={`wf-${stage}`} className="w-full animate-flash-stage-in">
          <BuildingWireframe stage={stage} />
        </div>

        {/* Popis fáze (blur transition) */}
        <div key={`txt-${stage}`} className="text-center animate-flash-stage-in space-y-1.5">
          <p
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--gold)" }}
          >
            {current.eyebrow}
          </p>
          <h3 className="text-base font-medium" style={{ color: "var(--text)" }}>
            {current.title}
          </h3>
          <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
            {current.description}
          </p>
        </div>

        {/* Terminal readout */}
        <div
          className="w-full max-w-xs rounded-xl border p-3 font-mono text-[11px] space-y-1"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
        >
          {current.lines.slice(0, visibleLines).map((line, i) => (
            <div
              key={`${stage}-${i}`}
              className="animate-flash-line"
              style={{
                color: line.startsWith("✓")
                  ? "var(--gold)"
                  : "var(--text-muted)",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Progress ring + procenta */}
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <div
              className="absolute inset-0 rounded-full animate-flash-ring"
              aria-hidden="true"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(200,150,46,0.9), rgba(200,150,46,0.15) 70%, transparent)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-mono" style={{ color: "var(--gold)" }}>
                {stageIndex}/{STAGES.length}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {isFinal ? "Finalizuji…" : `Fáze ${stageIndex} z ${STAGES.length}`}
          </span>
        </div>
      </div>
    </section>
  );
}
