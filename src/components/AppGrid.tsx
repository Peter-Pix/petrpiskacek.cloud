"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { apps, type App } from "@/lib/apps";
import { trackEvent } from "@/lib/track";

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

export default function AppGrid({ ids }: { ids?: string[] }) {
  const visibleApps = ids ? apps.filter((a) => ids.includes(a.id)) : apps;

  return (
    <section id="apps" className="section-apple">
      <div className="container-apple">
        {/* Jedna appka na řádek — na mobilu i desktopu. Velké rozestupy. */}
        <div className="space-y-40 md:space-y-64">
          {visibleApps.map((app) => (
            <AppRow key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppRow({ app }: { app: App }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const story = STORIES[app.id] || { hook: app.tagline, body: app.description };
  const status = statusLabels[app.status];
  const buttonLabel = app.external ? "Otevřít aplikaci" : "Spustit";
  const hasShot = app.href && app.href !== "#";

  return (
    <article
      ref={ref}
      className={`group transition-all duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
    >
      {/* Název + status — nahoře */}
      <div className="flex flex-col items-start mb-6 md:mb-10">
        <div className="flex items-center gap-3">
          <h3 className="text-3xl font-semibold md:text-5xl">{app.name}</h3>
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
      </div>

      {/* Screenshot — pod názvem */}
      {hasShot && (
        <div className="mb-6 md:mb-10">
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

      {/* Velký hák — vlevo, tlačítko vpravo (jen velké obrazovky) */}
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <p
          className="text-3xl font-light leading-tight tracking-tight md:text-5xl"
          style={{ color: "#71717a" }}
        >
          {story.hook}
        </p>

        {hasShot && (
          <div className="shrink-0">
            <AppLink
              href={app.href}
              external={app.external}
              label={buttonLabel}
              appId={app.id}
              appName={app.name}
            />
          </div>
        )}
      </div>

      {/* Popis — text vlevo */}
      <div className="mt-5 max-w-[800px] 2xl:max-w-[1000px]">
        <p
          className="text-base font-medium leading-relaxed md:text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          {story.body}
        </p>
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
  appId,
  appName,
}: {
  href: string;
  external: boolean;
  label: string;
  appId: string;
  appName: string;
}) {
  const className =
    "group btn-app-ghost inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all duration-500 max-w-[60vw] md:max-w-none";
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
        onClick={() => trackEvent("click_app", { app: appId, name: appName })}
      >
        <span>{label}</span>
        {arrow}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent("click_app", { app: appId, name: appName })}
    >
      <span>{label}</span>
      {arrow}
    </Link>
  );
}
