import { NextResponse } from "next/server";
import { MODELS } from "@/lib/models";
import { chatCompletion } from "@/lib/ollama";

const SYSTEM_PROMPT = `Jsi kreativní UI/UX designer pro české klienty. Vygeneruj jeden konkrétní, krátký požadavek na UI komponentu nebo malou webovou stránku v češtině.

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
- "Chci interaktivní kalkulačku hypotéky s posuvníky pro úrokovou sazbu a dobu splátky"`;

export async function POST() {
  try {
    const { content: result } = await chatCompletion({
      model: MODELS.randomPrompt,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "Dej mi náhodný nápad na UI." },
      ],
      temperature: 0.9,
      max_tokens: 200,
    });

    const cleanedResult = result.trim().replace(/^["'«\s]+|["'»\s]+$/g, "");

    return NextResponse.json({ prompt: cleanedResult });
  } catch (error) {
    console.error("Flash UI random prompt error:", error);
    return NextResponse.json(
      { error: "Náš AI designer má plné ruce — zkus to za chvilku." },
      { status: 500 }
    );
  }
}
