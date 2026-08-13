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
    emoji: "",
    tagline: "AI e-mailovej administrátor",
    description:
      "Rozpozná to důležité. Postará se o vše, co není. Odpoví na jednoduché rutinní věci. Práce bez výmluv.",
    status: "online",
    href: "https://karel.petrpiskacek.cloud",
    external: true,
    category: "ai",
  },
  {
    id: "sparring",
    name: "Sparring",
    emoji: "",
    tagline: "AI konzultant na projekty",
    description:
      "Stačí nápad a klik. Návrh aplikace se vytvoří během pár vteřin.",
    status: "online",
    href: "/challenge",
    external: false,
    category: "ai",
  },
  {
    id: "flash-ui",
    name: "Flash UI",
    emoji: "",
    tagline: "Generuj UI komponenty z promptu",
    description:
      "Design pro váš web. Přidejte nový formulář, chat, ceník. Cokoliv jen chcete.",
    status: "online",
    href: "/flash-ui",
    external: false,
    category: "tool",
  },
  {
    id: "4rap",
    name: "4rap.cz",
    emoji: "",
    tagline: "Znalostní databáze českýho rapu",
    description:
      "Vědomostní graf české rapové scény. Chaos dostal řád. Přesvěčte se sami.",
    status: "online",
    href: "https://4rap.cz",
    external: true,
    category: "data",
  },
  {
    id: "docbot",
    name: "DocBot",
    emoji: "",
    tagline: "AI právník na český smlouvy",
    description:
      "Žádné ruční vyplňování. Smlouvy snadno a rychle. Dělejte to jednoduše.",
    status: "online",
    href: "https://docbot.petrpiskacek.cloud",
    external: true,
    category: "ai",
  },
  {
    id: "terminall",
    name: "Terminall",
    emoji: "",
    tagline: "Trénink příkazovýho řádku",
    description:
      "Naučte se terminál jinak. Učitel opravuje chyby a napovídá. Lekce s příběhem.",
    status: "online",
    href: "https://terminall.petrpiskacek.cloud",
    external: true,
    category: "tool",
  },
];
