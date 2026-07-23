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
    tagline: "AI e-mailovej administrátor",
    description:
      "Pošli mu e-mail a on ho analyzuje, roztřídí a napíše odpověď. Umí rozpoznat urgentní zprávy, faktury, newslettery a osobní poštu. Běží na Ollama cloudu, frontend ve Vite + React.",
    status: "online",
    href: "https://karel.petrpiskacek.cloud",
    external: true,
    category: "ai",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    emoji: "📊",
    tagline: "Live monitoring AI infrastruktury",
    description:
      "Streamlit dashboard s实时nými metrikami všech běžících AI služeb. Latence, vytížení, stav modelů. Postavený na Python + Streamlit, data z API endpointů.",
    status: "online",
    href: "https://dashboard.petrpiskacek.cloud",
    external: true,
    category: "tool",
  },
  {
    id: "sparring",
    name: "Sparring",
    emoji: "🥊",
    tagline: "AI konzultant na projekty",
    description:
      "Napíšeš nápad, AI se doptá na detaily, pak ti nacení, navrhne technologickej stack a časovej plán. 4 bloky: jádro, stack, náklady, postup. Každej blok jde rozvést.",
    status: "online",
    href: "/challenge",
    external: false,
    category: "ai",
  },
  {
    id: "flash-ui",
    name: "Flash UI",
    emoji: "⚡",
    tagline: "Generuj UI komponenty z promptu",
    description:
      "Napiš, co chceš za UI komponentu, a DeepSeek V4 Flash ji nakreslí v reálném čase. Tlačítka, formuláře, karty, dashboardy — cokoliv. Postavený na Next.js API route + OpenRouter.",
    status: "beta",
    href: "/flash-ui",
    external: false,
    category: "tool",
  },
  {
    id: "4rap",
    name: "4rap.cz",
    emoji: "🎵",
    tagline: "Znalostní databáze českýho rapu",
    description:
      "1699 entit, 9281 vazeb. Interaktivní D3 graf, full-text search, Schema.org SEO. Každej interpret, album, label a jejich propojení. Next.js + MDX, buildí 1200+ stránek.",
    status: "online",
    href: "https://4rap.cz",
    external: true,
    category: "data",
  },
  {
    id: "scrollo",
    name: "Scrollo",
    emoji: "🛠️",
    tagline: "Užitečný nástroje bez reklam",
    description:
      "Kolekce client-side nástrojů — převodníky, generátory, analyzátory. Všechno běží v prohlížeči, žádný data se neukládají na server. PWA, offline-ready, zero tracking.",
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
    description:
      "Můj vlastní hlas klonovanej do AI. Sedmá generace — k nerozeznání od originálu. Model umí zpívat i rapovat. WebRTC demo připravujeme.",
    status: "soon",
    href: "#",
    external: false,
    category: "demo",
  },
];
