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
            <p className="eyebrow">Skvělý nápad</p>

            <h2
              className="text-4xl font-light leading-tight tracking-tight md:text-6xl"
              style={{ color: "var(--text-primary)" }}
            >
              Nápad, co stojí za to,
              <br />
              <span className="text-gradient-gold">navržený za pár vteřin.</span>
            </h2>

            <p
              className="mx-auto max-w-xl text-base leading-relaxed md:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Napište cokoliv. Pomocník se doptá, vytvoří návrh, cenu a plán.
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
