"use client";

import { useState } from "react";
import { apps, type App } from "@/lib/apps";

const statusLabels: Record<string, { label: string; color: string }> = {
  online: { label: "Běží", color: "var(--status-online)" },
  beta: { label: "Beta", color: "var(--gold)" },
  offline: { label: "Nedostupné", color: "var(--status-offline)" },
  soon: { label: "Brzy", color: "var(--text-muted)" },
};

const categoryLabels: Record<string, string> = {
  ai: "AI",
  tool: "Nástroj",
  demo: "Demo",
  data: "Data",
};

const stackLabels: Record<string, string> = {
  karel: "Vite · React · Ollama",
  dashboard: "Python · Streamlit",
  sparring: "Next.js · Ollama",
  "flash-ui": "Next.js · DeepSeek V4",
  "4rap": "Next.js · MDX · D3",
  scrollo: "Vanilla JS · PWA",
  "voice-demo": "—",
};

export default function AppGrid() {
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? apps.filter((a) => a.category === filter)
    : apps;

  const onlineApps = filtered.filter((a) => a.status !== "soon");
  const soonApps = filtered.filter((a) => a.status === "soon");

  return (
    <section id="apps" className="section-apple">
      <div className="container-apple">
        <p className="eyebrow mb-3 text-center">AI Playground</p>
        <h2 className="headline-lg mb-4 text-center">
          Aplikace
        </h2>
        <p className="subhead mx-auto mb-12 max-w-xl text-center">
          Každá appka běží naostro. Klikni a vyzkoušej.
        </p>

        {/* Kategorie filtry — App Store styl */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilter(null)}
            className="rounded-full border px-4 py-1.5 text-xs font-medium transition-all"
            style={{
              borderColor: !filter ? "var(--gold)" : "var(--tag-border)",
              backgroundColor: !filter ? "rgba(200, 150, 46, 0.1)" : "var(--tag-bg)",
              color: !filter ? "var(--gold)" : "var(--tag-text)",
            }}
          >
            Všechny
            <span className="ml-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
              {apps.length}
            </span>
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => {
            const count = apps.filter((a) => a.category === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="rounded-full border px-4 py-1.5 text-xs font-medium transition-all"
                style={{
                  borderColor: filter === key ? "var(--gold)" : "var(--tag-border)",
                  backgroundColor: filter === key ? "rgba(200, 150, 46, 0.1)" : "var(--tag-bg)",
                  color: filter === key ? "var(--gold)" : "var(--tag-text)",
                }}
              >
                {label}
                <span className="ml-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Online / Beta appky */}
        {onlineApps.length > 0 && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <h3 className="text-sm font-semibold">Dostupné</h3>
              <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
            </div>
            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {onlineApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </>
        )}

        {/* Brzy appky */}
        {soonApps.length > 0 && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                Chystá se
              </h3>
              <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {soonApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function AppCard({ app }: { app: App }) {
  const status = statusLabels[app.status];
  const stack = stackLabels[app.id] || "";

  const CardTag = app.href && app.href !== "#" ? "a" : "div";
  const cardProps = app.href && app.href !== "#"
    ? {
        href: app.href,
        ...(app.external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      }
    : {};

  return (
    <CardTag
      {...cardProps}
      className="group glass-card flex flex-col p-5 transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Header s emoji + status badge */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
            style={{ backgroundColor: "var(--tag-bg)" }}
          >
            {app.emoji}
          </span>
          <div>
            <h3 className="text-sm font-semibold">{app.name}</h3>
            <p className="text-xs" style={{ color: "var(--gold)" }}>
              {app.tagline}
            </p>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
          style={{
            backgroundColor: app.status === "online"
              ? "rgba(16, 185, 129, 0.1)"
              : app.status === "beta"
                ? "rgba(200, 150, 46, 0.1)"
                : "rgba(113, 113, 122, 0.1)",
            color: status.color,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} />
          {status.label}
        </span>
      </div>

      {/* Description — delší, App Store styl */}
      <p className="flex-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {app.description}
      </p>

      {/* Metadata row — stack + kategorie */}
      <div className="mt-4 flex items-center gap-2">
        {stack && (
          <span className="rounded-md px-2 py-0.5 text-[10px] font-mono"
            style={{ backgroundColor: "var(--tag-bg)", color: "var(--text-muted)" }}
          >
            {stack}
          </span>
        )}
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {categoryLabels[app.category]}
        </span>
      </div>

      {/* CTA — App Store "Get" button styl */}
      <div className="mt-4">
        {app.href && app.href !== "#" ? (
          <span
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style={{
              backgroundColor: "rgba(200, 150, 46, 0.15)",
              color: "var(--gold)",
            }}
          >
            {app.external ? "Otevřít" : "Spustit"}
          </span>
        ) : (
          <span
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
            style={{
              backgroundColor: "var(--tag-bg)",
              color: "var(--text-muted)",
            }}
          >
            Příprava
          </span>
        )}
      </div>
    </CardTag>
  );
}
