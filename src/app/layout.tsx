import type { Metadata } from "next";
import "./globals.css";

const defaultUrl = "https://petrpiskacek.cloud";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "petrpiskacek.cloud — AI Infrastructure & Experiments",
  description:
    "Live AI Lab. Běžící AI služby, architektury, experimenty a ukázky infrastruktury. Stavím AI systémy, které něco dělají.",
  keywords: [
    "Petr Piskáček",
    "AI Infrastructure",
    "AI Lab",
    "LLM API",
    "AI Agents",
    "Knowledge Graphs",
    "MCP",
    "Docker",
    "automation",
  ],
  authors: [{ name: "Petr Piskáček" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "petrpiskacek.cloud — AI Infrastructure & Experiments",
    description: "Live AI Lab. Běžící AI služby, architektury, experimenty.",
    type: "website",
    locale: "cs_CZ",
    url: defaultUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "petrpiskacek.cloud — AI Infrastructure & Experiments",
    description: "Live AI Lab. Běžící AI služby, architektury, experimenty.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-gold/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
