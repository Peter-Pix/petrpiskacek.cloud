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

export default function AppGrid() {
  return (
    <section id="apps" className="section-apple">
      <div className="container-apple">
        {/* Jedna appka na řádek — na mobilu i desktopu. Velké rozestupy. */}
        <div className="space-y-24 md:space-y-40">
          {apps.map((app, idx) => (
            <AppRow key={app.id} app={app} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppRow({ app, index }: { app: App; index: number }) {
  const story = STORIES[app.id] || { hook: app.tagline, body: app.description };
  const status = statusLabels[app.status];
  const buttonLabel = app.external ? "Otevřít aplikaci" : "Spustit";
  const hasShot = app.href && app.href !== "#";
  // Střídavé zarovnání na desktopu — text vlevo / vpravo, ať to má rytmus.
  const reverse = index % 2 === 1;

  return (
    <article className="group">
      <div
        className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-16 ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Screenshot — nahoře na mobilu, střídavě vlevo/vpravo na desktopu */}
        {hasShot && (
          <div className="md:w-[58%] shrink-0">
            <div className="card-hover overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
              <img
                src={`/screenshots/${app.id}.jpg`}
                alt={`Screenshot aplikace ${app.name}`}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          </div>
        )}

        {/* Text */}
        <div className="flex flex-1 flex-col gap-3 md:max-w-sm">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold md:text-2xl">{app.name}</h3>
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
            className="text-2xl font-light leading-tight tracking-tight md:text-3xl"
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
            <div className="pt-2">
              <AppLink
                href={app.href}
                external={app.external}
                label={buttonLabel}
              />
            </div>
          )}
        </div>
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
