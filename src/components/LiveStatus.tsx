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
}

const defaultServices: Service[] = [
  { id: "llm", name: "AI asistent", icon: <SparklesIcon size={16} />, status: "online", latency: "200 ms" },
  { id: "image", name: "Generování obrázků", icon: <ImageIcon size={16} />, status: "online", latency: "1,2 s" },
  { id: "speech", name: "Hlas na text", icon: <MicIcon size={16} />, status: "online", latency: "300 ms" },
  { id: "ocr", name: "Čtení z fotek", icon: <ScanIcon size={16} />, status: "online", latency: "800 ms" },
  { id: "workflow", name: "Automaty", icon: <WorkflowIcon size={16} />, status: "online", latency: "—" },
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
      } catch { /* keep defaults */ }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const online = services.filter((s) => s.status === "online").length;

  return (
    <section id="system-status" className="section-apple">
      <div className="container-apple">
        <div className="mx-auto max-w-3xl">
          <div className="glass-card p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-1">System Status</p>
                <h2 className="headline-md">Infrastruktura</h2>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono tabular-nums" style={{ color: "var(--gold)" }}>
                  {online}/{services.length}
                </div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Služeb online
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-3 rounded-xl p-3"
                  style={{ backgroundColor: "var(--bg-primary)" }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ color: "var(--gold)" }}>
                      {service.icon}
                    </div>
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {service.latency && service.latency !== "—" && (
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        {service.latency}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            service.status === "online"
                              ? "var(--status-online)"
                              : service.status === "degraded"
                                ? "var(--status-degraded)"
                                : "var(--status-offline)",
                        }}
                      />
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
                        {service.status === "online" ? "Běží" : service.status === "degraded" ? "Omezeně" : "Nedostupné"}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
