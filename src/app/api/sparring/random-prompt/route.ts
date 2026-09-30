import { NextResponse } from "next/server";
import { MODELS } from "@/lib/models";
import { chatCompletion } from "@/lib/ollama";

const SYSTEM_PROMPT = `Jsi majitel malé nebo střední firmy v Česku. Popiš krátce jeden konkrétní problém nebo přání, které máš ve svém podnikání.

Pravidla:
- Piš první osobou ("Potřebuji...", "Hledám...", "Chci...").
- Popisuj konkrétní situaci, ne obecný pojem.
- Max 160 znaků, jedna věta, bez tečky na konci, bez uvozovek.
- Nepoužívej cizí slova ("AI", "software", "automatizace", "chatbot", "systém").

Příklady:
- Potřebuji ulehčit práci s fakturami, snazší nahrávání dokumentů a lepší přehled o tom, kdo už zaplatil
- Hledám způsob, jak efektivněji komunikovat se zákazníky a rychleji odpovídat na dotazy v e-mailech`;

export async function POST() {
  try {
    const { content: result } = await chatCompletion({
      model: MODELS.randomPrompt,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "Vygeneruj náhodnou business potřebu." },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const cleanedResult = result.trim().replace(/^["'«\s]+|["'»\s]+$/g, "");

    return NextResponse.json({ prompt: cleanedResult });
  } catch (error) {
    console.error("Random prompt generation error:", error);
    return NextResponse.json(
      { error: "Nepodařilo se vygenerovat prompt — zkus to za chvilku." },
      { status: 500 }
    );
  }
}
