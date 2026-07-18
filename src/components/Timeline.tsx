"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, ExternalLinkIcon } from "./icons";

interface Project {
  year: number;
  name: string;
  description: string;
  progress: number;
  status: "active" | "done" | "paused";
  tags: string[];
  link?: string;
}

const projects: Project[] = [
  {
    year: 2026,
    name: "AI Portfolio",
    description: "Osobní portfolio s AI chatbotem, pamětí a live AI labem",
    progress: 100,
    status: "done",
    tags: ["Next.js", "OpenRouter", "AI"],
    link: "https://petrpiskacek.cz",
  },
  {
    year: 2026,
    name: "4rap.cz",
    description: "Operační systém pro českou rapovou scénu — 1248 entit, 5896 vazeb",
    progress: 100,
    status: "active",
    tags: ["Next.js", "MDX", "Knowledge Graph"],
    link: "https://4rap.cz",
  },
  {
    year: 2026,
    name: "Knowledge Graph",
    description: "Entity-relation graf pro rap scénu s D3-force vizualizací",
    progress: 100,
    status: "done",
    tags: ["D3.js", "Canvas", "Graf"],
  },
  {
    year: 2026,
    name: "AI Agent",
    description: "Sub-agentní architektura s MCP servery a paměťovými systémy",
    progress: 80,
    status: "active",
    tags: ["OpenClaw", "MCP", "Agenti"],
  },
  {
    year: 2026,
    name: "SEO Automatizace",
    description: "Automatizovaná SEO indexace, generování sitemap a Schema.org markup",
    progress: 90,
    status: "active",
    tags: ["SEO", "JSON-LD", "Automatizace"],
  },
  {
    year: 2026,
    name: "Voice Modely",
    description: "AI voice cloning a pipeline pro rozpoznávání řeči",
    progress: 60,
    status: "active",
    tags: ["TTS", "STT", "Hlas"],
  },
  {
    year: 2026,
    name: "4Rap Studio",
    description: "Kreativní nástroje pro rap writing — 4Bars, 4Flow, LLM gateway",
    progress: 70,
    status: "active",
    tags: ["Next.js", "LLM", "Kreativa"],
  },
  {
    year: 2026,
    name: "Karel Robot",
    description: "AI e-mailový administrátor — analyzuje e-maily, rozhoduje o dalším kroku",
    progress: 90,
    status: "active",
    tags: ["Vite", "React", "Ollama", "AI"],
    link: "https://karel.petrpiskacek.cloud",
  },
  {
    year: 2025,
    name: "VocalBrain",
    description: "AI platforma pro analýzu a přepis hlasu",
    progress: 100,
    status: "done",
    tags: ["Python", "AI", "Audio"],
  },
];

export default function Timeline() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);

  return (
    <section id="timeline" className="section-apple">
      <div className="container-apple">
        <p className="eyebrow mb-3 text-center">Aktivita</p>
        <h2 className="headline-lg mb-4 text-center">
          Časová osa
        </h2>
        <p className="subhead mx-auto mb-12 max-w-xl text-center">
          Náborář vidí aktivitu. Ne papír.
        </p>

        <div className="mx-auto max-w-3xl">
          {years.map((year) => (
            <div key={year} className="mb-10">
              <h3 className="headline-md mb-6" style={{ color: "var(--gold)" }}>
                {year}
              </h3>
              <div className="space-y-4">
                {projects
                  .filter((p) => p.year === year)
                  .map((project) => (
                    <div
                      key={project.name}
                      className="glass-card p-5 md:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-semibold">
                              {project.link ? (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 hover:text-gold transition-colors"
                                >
                                  {project.name}
                                  <ExternalLinkIcon size={12} />
                                </a>
                              ) : (
                                project.name
                              )}
                            </h4>
                            <span
                              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                              style={{
                                backgroundColor:
                                  project.status === "done"
                                    ? "rgba(34, 197, 94, 0.1)"
                                    : project.status === "active"
                                      ? "rgba(200, 150, 46, 0.1)"
                                      : "rgba(113, 113, 122, 0.1)",
                                color:
                                  project.status === "done"
                                    ? "#22c55e"
                                    : project.status === "active"
                                      ? "var(--gold)"
                                      : "var(--text-muted)",
                              }}
                            >
                              {project.status === "done"
                                ? "Hotovo"
                                : project.status === "active"
                                  ? "Aktivní"
                                  : "Pozastaveno"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                            {project.description}
                          </p>
                          <div className="mt-3 flex items-center gap-4">
                            <div className="flex-1">
                              <div className="progress-bar">
                                <div
                                  className="progress-bar-fill"
                                  style={{
                                    width: animated ? `${project.progress}%` : "0%",
                                  }}
                                />
                              </div>
                            </div>
                            <span
                              className="text-xs font-mono tabular-nums"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {project.progress}%
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                style={{
                                  borderColor: "var(--tag-border)",
                                  backgroundColor: "var(--tag-bg)",
                                  color: "var(--tag-text)",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
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
