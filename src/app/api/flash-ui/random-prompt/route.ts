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
      prompt: `Jsi kreativní UI/UX designer pro české klienty. Vygeneruj jeden konkrétní, krátký požadavek na UI komponentu nebo malou webovou stránku v češtině.

Kontext pro tebe (NEUVÁDĚJ v odpovědi): čas ${timestamp}, seed ${randomSeed}.

Kritéria:
- Piš z pohledu klienta, který neumí kódovat, ale ví, co chce vizuálně a funkčně.
- ABSOLUTNĚ nepoužívej slova "AI", "chatbot", "asistent".
- NEUVÁDĚJ žádné technické detaily, časové značky, náhodné kódy, hashe ani metadata.
- NEUVÁDĚJ konkrétní hodnoty jako "čas 17:41" nebo "odznak 4a8d7" — to jsou interní data, ne obsah UI.
- Délka: max 160 znaků.
- Formát: jen čistý text promptu, bez uvozovek, bez tečky na konci, bez úvodu nebo vysvětlení.
- Obsah: různé typy (dashboardy, landing pages, kalkulačky, formuláře, interaktivní grafy, profily, timeline, ceníky, karusely).
- ZAKÁZÁNO: opakovat se, generovat abstraktní pojmy, používat cizí slova bez potřeby.

Příklady stylu:
- "Potřebuji elegantní přihlašovací stránku s možností přihlášení přes Google a Apple"
- "Hledám moderní dashboard pro sledování prodejů s velkými čísly a barevnými grafy"
- "Chci interaktivní kalkulačku hypotéky s posuvníky pro úrokovou sazbu a dobu splátky"`,
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
