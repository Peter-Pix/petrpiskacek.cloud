export type AppStatus = "online" | "beta" | "offline" | "soon";

export interface App {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  status: AppStatus;
  href: string;
  external: boolean;
  category: "ai" | "tool" | "demo" | "data";
}

export const apps: App[] = [
  {
    id: "karel",
    name: "Karel Robot",
    emoji: "🤖",
    tagline: "AI e-mailovej admin",
    description: "Analyze, třídí a odpovídá na emaily. Vite + React + Ollama cloud.",
    status: "online",
    href: "https://karel.petrpiskacek.cloud",
    external: true,
    category: "ai",
  },
  {
    id: "sparring",
    name: "Sparring",
    emoji: "🥊",
    tagline: "AI konzultant na projekty",
    description: "Napíšeš nápad, AI se doptá, nacení, navrhne stack a časovej plán.",
    status: "online",
    href: "/challenge",
    external: false,
    category: "ai",
  },
  {
    id: "flash-ui",
    name: "Flash UI",
    emoji: "⚡",
    tagline: "Generuj UI z promptu",
    description: "Napiš co chceš, DeepSeek V4 Flash nakreslí komponentu.",
    status: "beta",
    href: "/flash-ui",
    external: false,
    category: "tool",
  },
  {
    id: "4rap",
    name: "4rap.cz",
    emoji: "🎵",
    tagline: "Znalostní databáze rapu",
    description: "1699 entit, 9281 vazeb. Největší DB český rapový scény.",
    status: "online",
    href: "https://4rap.cz",
    external: true,
    category: "data",
  },
  {
    id: "scrollo",
    name: "Scrollo",
    emoji: "🛠️",
    tagline: "Nástroje bez reklam",
    description: "Client-side nástroje, PWA, bez trackingu, bez reklam.",
    status: "online",
    href: "https://scrollo.cz",
    external: true,
    category: "tool",
  },
  {
    id: "voice-demo",
    name: "Voice Clone",
    emoji: "🎤",
    tagline: "7. generace hlasovýho klonu",
    description: "Můj vlastní hlas klonovanej do AI. K nerozeznání od originálu.",
    status: "soon",
    href: "#",
    external: false,
    category: "demo",
  },
];
