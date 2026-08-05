"use client";

import { useRef, useEffect, useState } from "react";
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
        <div className="space-y-24">
          {apps.map((app, idx) => (
            <AppFeature key={app.id} app={app} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppFeature({ app, index }: { app: App; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const story = STORIES[app.id] || { hook: app.tagline, body: app.description };
  const status = statusLabels[app.status];
  const isEven = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const buttonLabel = app.external ? "Otevřít aplikaci" : "Spustit";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div
        className={`flex flex-col gap-8 md:gap-12 ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        <div className="flex-1 space-y-4 md:space-y-6">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-semibold md:text-xl">{app.name}</h3>
              <span
                className="inline-flex items-center gap-1.5 text-xs"
                style={{ color: status.color }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                {status.label}
              </span>
            </div>
          </div>

          <p
            className="text-2xl font-light leading-tight tracking-tight md:text-3xl lg:text-4xl"
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

          {app.href && app.href !== "#" && (
            <AppLink
              href={app.href}
              external={app.external}
              label={buttonLabel}
            />
          )}
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}

/**
 * AppLink — vybere správný typ odkazu.
 * Interní appky → next/link (client-side routing, prefetch).
 * Externí appky → <a target="_blank"> (no opener, no referrer).
 * Žádný href → nic.
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
