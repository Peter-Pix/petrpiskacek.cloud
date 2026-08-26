import Nav from "@/components/Nav";
import TrackedCta from "@/components/TrackedCta";
import RoiCalculator from "@/components/RoiCalculator";
import { Footer } from "@piskacek/ui";

export const metadata = {
  title: "Autonomní AI pracovník — Petr Pískaček",
  description: "Autonomní AI pracovník pro české firmy. Najde úspory, automatizuje rutinu, dokumentuje výsledky. Reálné case studies, ne sliby.",
};

export default function AiWorkerPage() {
  return (
    <main className="relative">
      <Nav />

      {/* HERO */}
      <section className="section-apple">
        <div className="container-apple">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Autonomní AI pracovník</p>
            <h1 className="headline-xl mt-4 font-light tracking-tight" style={{ color: "var(--text-primary)" }}>
              Váš tým nepotřebuje víc lidí.
              <br />
              <span className="text-gradient-gold">Potřebuje AI pracovníka.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Nasazuju autonomní AI agenty, kteří převezmou repetitivní práci — data, reporting, emaily, obsah.
              Ne prodávání slibů: ukážu reálné výsledky, které systém už vyprodukoval.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <TrackedCta
                href="mailto:petr@piskacek.cz?subject=AI%20Worker%20—%20demo"
                eventName="click_cta"
                params={{ cta: "ai_worker_demo", location: "hero" }}
              >
                Domluvit 20minutové demo
              </TrackedCta>
              <TrackedCta
                href="#roi"
                eventName="click_cta"
                params={{ cta: "ai_worker_roi", location: "hero" }}
                variant="secondary"
              >
                Spočítat si úsporu
              </TrackedCta>
            </div>
          </div>
        </div>
      </section>

      {/* DŮKAZ — case studies */}
      <section className="section-apple" style={{ paddingTop: "4rem" }}>
        <div className="container-apple">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Reálné výsledky</p>
            <h2 className="text-4xl font-light tracking-tight md:text-5xl" style={{ color: "var(--text-primary)" }}>
              Ne sliby. Vyzkoušené.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Case study 1 — Sovereign OS */}
            <div className="bento-item">
              <p className="eyebrow">Autonomní AI tým</p>
              <h3 className="mt-2 text-2xl font-light">50 firem v 13 sektorech</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Sovereign OS — tým AI agentů (Scout, Strategist, Spine) reálně běžel a vygeneroval
                50 kvalifikovaných B2B leadů napříč 13 sektory, každý se strukturovanou analýzou bolesti.
              </p>
              <div className="mt-4 flex gap-3 text-sm">
                <span className="rounded-full px-3 py-1" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>50 firem</span>
                <span className="rounded-full px-3 py-1" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>13 sektorů</span>
              </div>
            </div>

            {/* Case study 2 — 4rap */}
            <div className="bento-item">
              <p className="eyebrow">Datová platforma</p>
              <h3 className="mt-2 text-2xl">1 699 entit, 9 294 graf uzlů</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Postavil jsem 4rap.cz — propojenou databázi české rapové scény. Knowledge graph,
                automatizovaný pipeline, reálný organický provoz z Google. Ukázka schopnosti stavět datové produkty.
              </p>
              <div className="mt-4 flex gap-3 text-sm">
                <span className="rounded-full px-3 py-1" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>280 rapperů</span>
                <span className="rounded-full px-3 py-1" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>604 alb</span>
                <span className="rounded-full px-3 py-1" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>organic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JAK TO FUNGUJE */}
      <section className="section-apple" style={{ paddingTop: "4rem" }}>
        <div className="container-apple">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Proces</p>
            <h2 className="text-4xl font-light tracking-tight md:text-5xl" style={{ color: "var(--text-primary)" }}>
              Od analýzy k běhu za 4 týdny
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Analýza", "Identifikuju repetitivní proces, který žere hodiny."],
              ["02", "Nasazení", "AI worker se naučí vaše data a workflow."],
              ["03", "Běh", "Agent běží na pozadí, reportuje výsledky."],
              ["04", "Škálování", "Automatizace se rozšíří na další procesy."],
            ].map(([num, title, desc]) => (
              <div key={num} className="bento-item">
                <div className="text-3xl font-light text-gradient-gold">{num}</div>
                <h3 className="mt-2 text-xl">{title}</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI KALKULAČKA */}
      <section id="roi" className="section-apple" style={{ paddingTop: "4rem" }}>
        <div className="container-apple">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Kalkulačka úspory</p>
            <h2 className="text-4xl font-light tracking-tight md:text-5xl" style={{ color: "var(--text-primary)" }}>
              Kolik vaše firma ztrácí na rutině?
            </h2>
            <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
              Vyplňte svá čísla a zjistíte, kolik AI Worker ušetří. Žádný závazek.
            </p>
          </div>
          <div className="mt-10">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* CENÍK */}
      <section id="cenik" className="section-apple" style={{ paddingTop: "4rem" }}>
        <div className="container-apple">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Ceník</p>
            <h2 className="text-4xl font-light tracking-tight md:text-5xl" style={{ color: "var(--text-primary)" }}>
              Jedna cena. Žádné rozpětí.
            </h2>
            <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
              Prodávám výsledek, ne hodiny. Fixní cena za outcome — jedno číslo, co se dá říct nahlas.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Pilot",
                price: "20 000 Kč",
                unit: "1 měsíc",
                desc: "Ověřovací nasazení na 1 use-case. Zjistíte, co AI Worker umí na vašich datech.",
                highlight: false,
              },
              {
                name: "Full setup",
                price: "80 000 Kč",
                unit: "jednorázově",
                desc: "Kompletní nasazení AI Workera na vašich datech a workflow.",
                highlight: true,
              },
              {
                name: "Měsíční provoz",
                price: "20 000 Kč",
                unit: "měsíčně",
                desc: "Retainer — agent běží, reportuje, škáluje se.",
                highlight: false,
              },
              {
                name: "Extra use-case",
                price: "+15 000 Kč",
                unit: "za proces",
                desc: "Rozšíření na další automatizovaný proces nad rámec základu.",
                highlight: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className="bento-item flex flex-col"
                style={tier.highlight ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : undefined}
              >
                <p className="eyebrow">{tier.name}</p>
                <div className="mt-3 text-3xl font-light" style={{ color: tier.highlight ? "var(--accent)" : "var(--text-primary)" }}>
                  {tier.price}
                </div>
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>{tier.unit}</div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{tier.desc}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Návratnost: setup 80 000 Kč se typicky vrátí za 1 měsíc provozu. Kalkulačka výše to spočítá na vašich číslech.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-apple" style={{ paddingTop: "4rem" }}>
        <div className="container-apple">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-light leading-tight tracking-tight md:text-6xl" style={{ color: "var(--text-primary)" }}>
              Ukažte mi svůj proces.
              <br />
              <span className="text-gradient-gold">Já zjistím, co se dá automatizovat.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
              20 minut. Žádný závazek. Ukážu konkrétní úsporu na vašich číslech.
            </p>
            <div className="mt-8">
              <TrackedCta
                href="mailto:petr@piskacek.dev?subject=AI%20Worker%20—%20demo"
                eventName="click_cta"
                params={{ cta: "ai_worker_demo", location: "closing" }}
              >
                Domluvit demo
              </TrackedCta>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
