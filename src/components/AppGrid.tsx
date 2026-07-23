"use client";

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

export default function AppGrid() {
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

        {/* Filtrování podle kategorie — jednoduchý tagy */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const count = apps.filter((a) => a.category === key).length;
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                style={{
                  borderColor: "var(--tag-border)",
                  backgroundColor: "var(--tag-bg)",
                  color: "var(--tag-text)",
                }}
              >
                {label}
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {count}
                </span>
              </span>
            );
          })}
        </div>

        {/* App grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppCard({ app }: { app: App }) {
  const status = statusLabels[app.status];
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
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{app.emoji}</span>
          <div>
            <h3 className="text-base font-semibold">{app.name}</h3>
            <p className="text-xs" style={{ color: "var(--gold)" }}>
              {app.tagline}
            </p>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{
            backgroundColor: app.status === "online"
              ? "rgba(16, 185, 129, 0.1)"
              : app.status === "beta"
                ? "rgba(200, 150, 46, 0.1)"
                : "rgba(113, 113, 122, 0.1)",
            color: status.color,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: status.color }}
          />
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="flex-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {app.description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className="text-[10px] uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {categoryLabels[app.category]}
        </span>
        {app.href && app.href !== "#" && (
          <span
            className="inline-flex items-center gap-1 text-xs font-medium transition-opacity group-hover:opacity-70"
            style={{ color: "var(--gold)" }}
          >
            {app.external ? "Otevřít →" : "Spustit →"}
          </span>
        )}
        {(!app.href || app.href === "#") && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Příprava
          </span>
        )}
      </div>
    </CardTag>
  );
}
