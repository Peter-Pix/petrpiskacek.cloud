import Nav from "@/components/Nav";
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
              <a href="mailto:petr@piskacek.cz?subject=AI%20Worker%20—%20demo" className="btn-apple btn-apple-primary">
                Domluvit 20minutové demo
              </a>
              <a href="#roi" className="btn-apple btn-apple-secondary">
                Spočítat si úsporu
              </a>
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
              <h3 className="mt-2 text-2xl font-light">36 firem v 9 sektorech</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Sovereign OS — tým AI agentů (Scout, Strategist, Spine) reálně běžel a vygeneroval
                36 kvalifikovaných B2B leadů napříč 9 sektory, každý se strukturovanou analýzou bolesti.
              </p>
              <div className="mt-4 flex gap-3 text-sm">
                <span className="rounded-full px-3 py-1" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>36 firem</span>
                <span className="rounded-full px-3 py-1" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>9 sektorů</span>
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
              <a href="mailto:petr@piskacek.dev?subject=AI%20Worker%20—%20demo" className="btn-apple btn-apple-primary">
                Domluvit demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
