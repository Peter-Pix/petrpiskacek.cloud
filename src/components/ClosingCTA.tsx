import Link from "next/link";

/**
 * ClosingCTA — závěrečný konverzní blok před footerem.
 * Nahrazuje mrtvý LiveStatus (infra detaily, které nikoho nezajímají)
 * výzvou k akci, která posílá na Sparring — hlavní konverzní nástroj.
 */
export default function ClosingCTA() {
  return (
    <section id="start" className="section-apple">
      <div className="container-apple">
        <div className="mx-auto max-w-3xl text-center">
          <div className="scroll-fade-pair space-y-6">
            <p className="eyebrow">Máš nápad?</p>

            <h2
              className="text-4xl font-light leading-tight tracking-tight md:text-6xl"
              style={{ color: "var(--text-primary)" }}
            >
              Nápad, který stojí za to,
              <br />
              <span className="text-gradient-gold">postavíš za pár vteřin.</span>
            </h2>

            <p
              className="mx-auto max-w-xl text-base leading-relaxed md:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Napiš, co chceš. AI se doptá, navrhne stack, cenu a plán.
              Žádné vágní rady — konkrétní výsledek, který jde rovnou do akce.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
              <Link href="/challenge" className="btn-apple btn-apple-primary">
                Otestuj AI konzultanta →
              </Link>
              <a href="#apps" className="btn-apple btn-apple-secondary">
                Prohlédnout aplikace
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
