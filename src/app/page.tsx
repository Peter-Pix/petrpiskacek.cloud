import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AppGrid from "@/components/AppGrid";
import LiveStatus from "@/components/LiveStatus";
import { Footer } from "@piskacek/ui";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />

      {/* To podstatné. + Definice laťky. — pár */}
      <section className="section-apple">
        <div className="container-apple">
          <div className="mx-auto max-w-2xl text-center">
            <div className="scroll-fade-pair space-y-2">
              <p
                className="text-5xl font-light tracking-tight md:text-6xl lg:text-7xl"
                style={{ color: "var(--text-primary)" }}
              >
                To podstatné.
              </p>
              <p
                className="text-xl font-light tracking-wider md:text-2xl lg:text-3xl italic"
                style={{ color: "var(--text-muted)", transform: "translateX(9%)" }}
              >
                Definice laťky.
              </p>
            </div>
            <div className="mx-auto mt-8 h-px max-w-xs" style={{ backgroundColor: "var(--border)" }} />
          </div>
        </div>
      </section>

      {/* Jádro — nástroje, které nastavují laťku */}
      <AppGrid ids={["karel", "4rap", "docbot"]} />

      {/* Rychle s duší. + Vyšší úroveň. — pár */}
      <section className="section-apple">
        <div className="container-apple">
          <div className="mx-auto max-w-2xl text-center">
            <div className="scroll-fade-pair space-y-2">
              <p
                className="text-5xl font-light tracking-tight md:text-6xl lg:text-7xl"
                style={{ color: "var(--text-primary)" }}
              >
                Rychle s duší.
              </p>
              <p
                className="text-xl font-light tracking-wider md:text-2xl lg:text-3xl italic"
                style={{ color: "var(--text-muted)", transform: "translateX(9%)" }}
              >
                Vyšší úroveň.
              </p>
            </div>
            <div className="mx-auto mt-8 h-px max-w-xs" style={{ backgroundColor: "var(--border)" }} />
          </div>
        </div>
      </section>

      {/* Rychlost a duše — kreativní a agilní nástroje */}
      <AppGrid ids={["sparring", "flash-ui", "terminall"]} />

      <LiveStatus />

      <Footer />
    </main>
  );
}
