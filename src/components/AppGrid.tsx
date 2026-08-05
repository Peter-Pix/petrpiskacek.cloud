"use client";

import Link from "next/link";
import { apps, type App } from "@/lib/apps";

const statusLabels: Record<string, { label: string; color: string }> = {
  online: { label: "Běží", color: "var(--status-online)" },
  beta: { label: "Beta", color: "var(--gold)" },
  offline: { label: "Nedostupné", color: "var(--status-offline)" },
  soon: { label: "Brzy", color: "var(--text-muted)" },
};

const STORIES: Record<string, { hook: string; body: string }> = {
  karel: {
    hook: "Přijde e-mail, Karel se stará.",
    body: "Rozpozná to důležité. Postará se o vše, co není. Odpoví na jednoduché rutinní věci. Práce bez výmluv.",
  },
  sparring: {
    hook: "Víc hlav víc ví.",
    body: "Stačí nápad a klik. Návrh aplikace se vytvoří během pár vteřin.",
  },
  "flash-ui": {
    hook: "Design na dotek.",
    body: "Design pro váš web. Přidejte nový formulář, chat, ceník. Cokoliv jen chcete.",
  },
  "4rap": {
    hook: "Za hranicí hudby.",
    body: "Vědomostní graf české rapové scény. Chaos dostal řád. Přesvědčte se sami.",
  },
  docbot: {
    hook: "Šikovný úředník.",
    body: "Žádné ruční vyplňování. Smlouvy snadno a rychle. Dělejte to jednoduše.",
  },
  terminall: {
    hook: "Vítej v Matrixu.",
    body: "Naučte se terminál jinak. Učitel opravuje chyby a napovídá. Lekce s příběhem.",
  },
};

/** Aplikace, které v Bento gridu zabírají 2 sloupce (featured). */
const FEATURED = new Set(["karel", "4rap"]);

export default function AppGrid() {
  return (
    <section id="apps" className="section-apple">
      <div className="container-apple">
        <div className="bento-grid">
          {apps.map((app, idx) => (
            <AppCard key={app.id} app={app} featured={FEATURED.has(app.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppCard({
  app,
  featured,
}: {
  app: App;
  featured: boolean;
}) {
  const story = STORIES[app.id] || { hook: app.tagline, body: app.description };
  const status = statusLabels[app.status];
  const buttonLabel = app.external ? "Otevřít aplikaci" : "Spustit";
  const hasShot = app.href && app.href !== "#";

  return (
    <article
      className={`group bento-item card-hover flex flex-col overflow-hidden ${
        featured ? "bento-item-large" : ""
      }`}
    >
      {/* Screenshot — nahoře na mobilu, dlaždice na desktopu */}
      <div className="mb-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <img
          src={`/screenshots/${app.id}.jpg`}
          alt={`Screenshot aplikace ${app.name}`}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold md:text-xl">{app.name}</h3>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 text-xs"
            style={{ color: status.color }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            {status.label}
          </span>
        </div>

        <p
          className="text-xl font-light leading-tight tracking-tight md:text-2xl"
          style={{ color: "var(--text-primary)" }}
        >
          {story.hook}
        </p>

        <p
          className="text-sm leading-relaxed md:text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          {story.body}
        </p>

        {hasShot && (
          <div className="mt-auto pt-4">
            <AppLink
              href={app.href}
              external={app.external}
              label={buttonLabel}
            />
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * AppLink — vybere správný typ odkazu.
 * Interní appky → next/link (client-side routing, prefetch).
 * Externí appky → <a target="_blank"> (no opener, no referrer).
 */
function AppLink({
  href,
  external,
  label,
}: {
  href: string;
  external: boolean;
  label: string;
}) {
  const className =
    "group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all";
  const style = {
    backgroundColor: "rgba(200, 150, 46, 0.12)",
    color: "var(--gold)",
  };
  const arrow = (
    <span className="transition-transform duration-200 group-hover:translate-x-1">
      →
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        <span>{label}</span>
        {arrow}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      <span>{label}</span>
      {arrow}
    </Link>
  );
}
