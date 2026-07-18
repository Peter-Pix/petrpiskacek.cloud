"use client";

import { useState, useEffect } from "react";
import {
  CpuIcon,
  ImageIcon,
  MicIcon,
  ScanIcon,
  WorkflowIcon,
  SparklesIcon,
} from "./icons";

interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: "online" | "offline" | "degraded";
  latency?: string;
  description: string;
}

const defaultServices: Service[] = [
  {
    id: "llm",
    name: "AI asistent",
    icon: <SparklesIcon size={18} />,
    status: "online",
    latency: "200 ms",
    description: "Přemýšlí s tebou, ne jen odpovídá.",
  },
  {
    id: "image",
    name: "Obrázky z myšlenek",
    icon: <ImageIcon size={18} />,
    status: "online",
    latency: "1,2 s",
    description: "Řekneš co chceš vidět, ono to nakreslí.",
  },
  {
    id: "speech",
    name: "Hlas na text",
    icon: <MicIcon size={18} />,
    status: "online",
    latency: "300 ms",
    description: "Mluvíš, ono to píše. Jako když ti někdo dělá poznámky.",
  },
  {
    id: "ocr",
    name: "Čtení z fotek",
    icon: <ScanIcon size={18} />,
    status: "online",
    latency: "800 ms",
    description: "Vyfotíš dokument, ono to přečte.",
  },
  {
    id: "workflow",
    name: "Automaty",
    icon: <WorkflowIcon size={18} />,
    status: "online",
    latency: "—",
    description: "Dělaj nudnou práci za tebe. Pořád.",
  },
];

export default function LiveStatus() {
  const [services, setServices] = useState<Service[]>(defaultServices);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          const data = await res.json();
          if (data.services) {
            setServices((prev) =>
              prev.map((s) => ({
                ...s,
                status: data.services[s.id]?.status || s.status,
                latency: data.services[s.id]?.latency || s.latency,
              }))
            );
          }
        }
      } catch {
        // Keep defaults
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="live-status" className="section-apple">
      <div className="container-apple">
        <p className="eyebrow mb-3 text-center">Live AI Lab</p>
        <h2 className="headline-lg mb-4 text-center">
          Služby
        </h2>
        <p className="subhead mx-auto mb-12 max-w-xl text-center">
          Reálně běžící AI služby. Některé na OpenRouter, některé na lokální infrastruktuře.
        </p>

        <div className="mx-auto max-w-3xl">
          <div className="bento-grid">
            {services.map((service) => (
              <div
                key={service.id}
                className="glass-card flex items-start gap-4 p-5 md:p-6"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--tag-bg)", color: "var(--gold)" }}
                >
                  {service.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{service.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-medium">
                      <span className={`status-dot ${service.status}`} />
                      <span
                        style={{
                          color:
                            service.status === "online"
                              ? "var(--status-online)"
                              : service.status === "degraded"
                                ? "var(--status-degraded)"
                                : "var(--status-offline)",
                        }}
                      >
                        {service.status === "online"
                          ? "Běží"
                          : service.status === "degraded"
                            ? "Omezeně"
                            : "Nedostupné"}
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    {service.description}
                  </p>
                  {service.latency && service.latency !== "—" && (
                    <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      Odezva: {service.latency}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <a href="/challenge" className="btn-apple btn-apple-primary">
            Otestuj mě
          </a>
        </div>

        {/* CTA — propojení s online (příběh, proč to dělám) */}
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <p
            className="max-w-md text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Jo, a když tě zajímá spíš <em>proč</em> to celé dělám, co mě žene a kam jdu —
          </p>
          <a
            href="https://petrpiskacek.online"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              borderColor: "var(--gold)",
              color: "var(--gold)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--gold)";
              e.currentTarget.style.color = "var(--text-inverse)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--gold)";
            }}
          >
            Přečti si příběh
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            petrpiskacek.online — člověk za tím vším
          </p>
        </div>
      </div>
    </section>
  );
}
