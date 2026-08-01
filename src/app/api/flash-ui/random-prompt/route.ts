import { NextResponse } from "next/server";
import { Ollama } from "ollama";
import { MODELS } from "@/lib/models";

export async function POST() {
  try {
    const timestamp = new Date().toISOString();
    const randomSeed = Math.random().toString(36).substring(7);
    
    const ollama = new Ollama({
      host: 'https://ollama.com',
      headers: {
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
      },
    });

    const response = await ollama.generate({
      model: MODELS.randomPrompt,
      prompt: `Jsi kreativní UI/UX designer. Vygeneruj jeden unikátní, krátký a konkrétní požadavek na UI komponentu nebo malou webovou stránku v češtině.
SOUBORY A KONTEXT: Aktuální čas ${timestamp}, náhodný kód ${randomSeed}. Použij tyto hodnoty k zajištění maximální variability odpovědi.

Kritéria:
- Piš z pohledu klienta, který neví nic o kódu, ale ví, co chce (např. "Potřebuji moderní ceníkovou tabulku pro tři tarify...").
- ABSOLUTNĚ nepoužívej slova "AI", "chatbot", "asistent". Popisuj pouze vizuální a funkční potřebu.
- Délka: max 160 znaků.
- Obsah: Různé typy (dashboardy, landing pages, kalkulačky, formuláře, interaktivní grafy, profily).
- Formát: Jen čistý text promptu, bez úvodů, uvozek, teček na konci nebo vysvětlení.
- ZAKÁZÁNO: Opakovat se.

Příklady stylu:
- "Potřebuji elegantní přihlašovací stránku s možností přihlášení přes Google a Apple."
- "Hledám moderní dashboard pro sledování prodejů s velkými čísly a barevnými grafy."
- "Chci interaktivní kalkulačku hypotéky s posuvníky pro úrokovou sazbu a dobu splátky."`,
      stream: false,
      options: {
        temperature: 0.9,
        top_p: 0.95,
        top_k: 40
      }
    });

    const result = response.response.trim();
    const cleanedResult = result.replace(/^["'«]|^["'«\s]+|["'»\s]+$/g, '');

    return NextResponse.json({ prompt: cleanedResult });
  } catch (error) {
    console.error('Flash UI random prompt error:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
  }
}
