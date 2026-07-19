"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "./icons";

interface Phase {
  period: string;
  title: string;
  body: string;
  highlight?: string;
}

const phases: Phase[] = [
  {
    period: "2023",
    title: "Objevování",
    body: "Člověk cítil změnu. Nemusel jsem programovat, stačilo mluvit. A ještě to nemělo zábrany — pro obě strany to byl úplně novej svět. Krok do neznáma.",
    highlight: "Poprvý jsem si připadal, že mluvím s někym, kdo odpovídá.",
  },
  {
    period: "2023 — 2024",
    title: "Cenzura a limity",
    body: "Pak přišly zpátky ty trapný filtry. Půl roku, rok na to. Modely začaly bejt strašně striktní. Nechtěly pomoct ani s normálníma věcma.",
    highlight: "Chuť, učit se a touha vidět dál. Vypromtovat správně.",
  },
  {
    period: "2024",
    title: "Lokální modely",
    body: "Začal jsem experimentovat s lokálníma modelama. Byly dost často hned necenzurovaný. Na rozdíl od komerčních se mnou nehádali o běžné věci.",
    highlight: "Jeden je fajn. Tým spoluhráčů vyhrává.",
  },
  {
    period: "2024 — 2025",
    title: "Zvuk a obrázky",
    body: "Potom jsem začal experimentovat se zvukem. S klonováním hlasů, aby byly co nejvěrnější. Nějaká sedmá generace se prostě už vydarila tak, že sám jsem nepoznal, jestli jsem to já, nebo můj klon.\n\nA potom mě začaly bavit generátory — Stable Diffusion, Flux, difuzní metody. Moc malý hřiště. Odlet na cloud. Díky tomu jsem se naučil dělat jak s obrázkama, tak s videama. Jak ze zoomu dostat z 30sekundovej nebo dvouminutovej klip celou story. Jak udržet konzistenci charakteru, oblečení, scén.",
  },
  {
    period: "2025 — 2026",
    title: "Cloud a agenti",
    body: "A potom jsem přesedlal na cloudový modely. Protože díky tomu můžu dělat orchestraci. Využívat všechny — jak ty nejlepší, tak ty slabší, levnější, rychlejší. A ta kombinace je neuvěřitelná.\n\nA teď ty agentní systémy. Když člověk jim správně řekne, co mají dělat, a rozdělí práci — víš dělá víc, než lidi myslí.",
    highlight: "Čas od času víc šetřit čas.",
  },
];

export default function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = phaseRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );

    phaseRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="timeline" className="section-apple">
      <div className="container-apple">
        <p className="eyebrow mb-3 text-center">Příběh</p>
        <h2 className="headline-lg mb-4 text-center">
          Jak jsem se dostal k AI
        </h2>
        <p className="subhead mx-auto mb-16 max-w-xl text-center">
          Čas od času víc šetřit čas.
        </p>

        <div className="relative mx-auto max-w-3xl">
          {/* Vertikální čára */}
          <div
            className="absolute left-3 top-2 bottom-2 w-px md:left-1/2 md:-translate-x-1/2"
            style={{ backgroundColor: "var(--border)" }}
            aria-hidden="true"
          />

          {phases.map((phase, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={phase.period}
                ref={(el) => {
                  phaseRefs.current[idx] = el;
                }}
                className="relative mb-16 pl-12 md:pl-0"
              >
                {/* Tečka na ose */}
                <div
                  className="absolute left-3 top-2 -translate-x-1/2 md:left-1/2"
                  aria-hidden="true"
                >
                  <div
                    className={`h-3 w-3 rounded-full transition-all duration-500 ${
                      isActive ? "scale-150" : "scale-100"
                    }`}
                    style={{
                      backgroundColor: isActive ? "var(--gold)" : "var(--text-muted)",
                      boxShadow: isActive ? "0 0 0 6px rgba(200, 150, 46, 0.15)" : "none",
                    }}
                  />
                </div>

                <div
                  className={`md:w-[calc(50%-2rem)] transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-60"
                  } ${idx % 2 === 0 ? "md:ml-0 md:mr-auto" : "md:ml-auto md:mr-0"}`}
                >
                  <p
                    className="mb-2 font-mono text-xs uppercase tracking-widest"
                    style={{ color: isActive ? "var(--gold)" : "var(--text-muted)" }}
                  >
                    {phase.period}
                  </p>
                  <h3 className="headline-md mb-3">{phase.title}</h3>
                  <p
                    className="text-base leading-relaxed whitespace-pre-line"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {phase.body}
                  </p>
                  {phase.highlight && (
                    <p
                      className="mt-4 border-l-2 pl-4 text-base italic"
                      style={{
                        borderColor: "var(--gold)",
                        color: "var(--text)",
                      }}
                    >
                      {phase.highlight}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a href="/challenge" className="btn-apple btn-apple-primary">
            Otestuj mě <ArrowRightIcon size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
