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
    name: "LLM API",
    icon: <SparklesIcon size={18} />,
    status: "online",
    latency: "200 ms",
    description: "OpenRouter — LLM inference",
  },
  {
    id: "image",
    name: "Generování obrázků",
    icon: <ImageIcon size={18} />,
    status: "online",
    latency: "1,2 s",
    description: "Pipeline pro generování AI obrázků",
  },
  {
    id: "speech",
    name: "Rozpoznávání řeči",
    icon: <MicIcon size={18} />,
    status: "online",
    latency: "300 ms",
    description: "Přepis řeči na text v reálném čase",
  },
  {
    id: "ocr",
    name: "OCR",
    icon: <ScanIcon size={18} />,
    status: "online",
    latency: "800 ms",
    description: "Extrakce textu z dokumentů",
  },
  {
    id: "workflow",
    name: "Workflow Engine",
    icon: <WorkflowIcon size={18} />,
    status: "online",
    latency: "—",
    description: "Automatizované orchestrace workflow",
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

        <div className="mt-12 text-center">
          <a href="/challenge" className="btn-apple btn-apple-primary">
            Otestuj mě
          </a>
        </div>
      </div>
    </section>
  );
}
