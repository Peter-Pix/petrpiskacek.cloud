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

    // Primární model gemma4:31b (kvalitnější čeština a konkrétnost, A/B test 23.8.2026)
    const response = await ollama.generate({
      model: MODELS.randomPrompt,
      prompt: `Jsi expert na business analýzu a design thinking. Tvým úkolem je vygenerovat JEDEN krátký, autentický popis business potřeby majitele firmy.

SOUBORY A KONTEXT (pro variabilitu):
Čas: ${timestamp}
Kód: ${randomSeed}

KRITICKÁ PRAVIDLA (Kritéria):
1. PERSPEKTIVA: Piš striktně jako majitel firmy. Používej první osobu ("Potřebuji...", "Hledám způsob...").
2. ZÁKAZ TECHNOLOGIÍ: ABSOLUTNĚ nepoužívej slova jako "AI", "chatbot", "model", "asistent", "automatizace", "software" nebo "systém". Popiš pouze PROBLÉM a žádaný STAV, ne nástroj.
3. STRUKTURA: Pouze jeden souvislý odstavec. Bez úvodů, bez uvozovek, bez teček na konci.
4. DÉLKA: Max 160 znaků.
5. OBSAH: Vyber náhodný obor (stavebnictví, logistika, právo, beauty, gastro, e-commerce, výroba, zdravotnictví).
6. VARIANCY: Prompt musí znít jako skutečná lidská stížnost nebo přání, ne jako marketingový text.

PŘÍKLADY PRO SPRÁVNÝ TÓN:
- Potřebuji ulehčit práci s fakturami, snazší nahrávání dokumentů a lepší přehled o tom, kdo už zaplatil
- Hledám způsob, jak efektivněji komunikovat se zákazníky a rychleji odpovídat na dotazy v e-mailech
- Chci pomoci s psaním nabídek a popisů produktů, aby vypadaly profesionálněji a přilákaly více klientů

GENERUJ NYNÍ:`,
      stream: false,
      options: {
        temperature: 0.8, // Slightly lower for more consistency in following constraints
        top_p: 0.9,
        top_k: 40
      }
    });

    const result = response.response.trim();
    
    // Cleanup potential quotes if AI fails to follow instructions
    const cleanedResult = result.replace(/^["'«]|^["'«\s]+|["'»\s]+$/g, '');

    return NextResponse.json({ prompt: cleanedResult });
  } catch (error) {
    console.error('Random prompt generation error:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
  }
}
