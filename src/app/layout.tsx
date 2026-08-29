import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import JsonLd from "@/components/JsonLd";

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
  title: "petrpiskacek.cloud — AI infrastruktura a experimenty",
  description:
    "Live AI Lab. Běžící AI služby, architektury, experimenty a ukázky infrastruktury. Stavím AI systémy, které něco dělají.",
  keywords: [
    "Petr Piskáček",
    "AI infrastruktura",
    "AI Lab",
    "LLM API",
    "AI agenti",
    "Knowledge Graph",
    "MCP",
    "Docker",
    "automatizace",
  ],
  authors: [{ name: "Petr Piskáček" }],
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-64.png", type: "image/png", sizes: "64x64" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "petrpiskacek.cloud — AI infrastruktura a experimenty",
    description: "Live AI Lab. Běžící AI služby, architektury, experimenty.",
    type: "website",
    locale: "cs_CZ",
    url: defaultUrl,
    images: [{ url: `${defaultUrl}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "petrpiskacek.cloud — AI infrastruktura a experimenty",
    description: "Live AI Lab. Běžící AI služby, architektury, experimenty.",
    images: [`${defaultUrl}/og-image.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-gold/30 selection:text-white">
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
