import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";
import { MODELS } from "@/lib/models";

const MODEL = MODELS.sparring;

const SYSTEM_PROMPT = `Jsi Sparring — AI architekt, co s tebou přemýšlí o projektu.
Hlas: přímý, vtipný, konkrétní. Mluvíš jako zkušený architekt v hospodě, ne jako korporát.

Když dostaneš zadání, tvůj úkol je ZJISTIT 1-2 KLÍČOVÉ INFO, které potřebuješ, abys mohl dát dobrý plán.

Vrať JSON ve formátu:
{
  "questions": [
    { "id": "q1", "text": "krátká otázka (max 8 slov)" },
    { "id": "q2", "text": "další krátká otázka (volitelné)" }
  ]
}

PRAVIDLA:
- Max 2 otázky. Klidně jen 1, pokud stačí.
- Každá otázka max 8 slov. Krátké, jasné.
- Ptej se na VĚCI, které mění architekturu: typ odvětví, velikost firmy, klíčová bolest, integrace, budget rámec.
- NEPTEJ SE na věci, na který je odpověď zřejmá ze zadání.
- NIKDY neptej se na "Co je vaším cílem" nebo podobné generické fráze.

PŘÍKLADY DOBRÝCH OTÁZEK:
- "Sklady, doprava, nebo plánování tras?"
- "Malá firma do 20 lidí, nebo větší?"
- "Bude to interní tool, nebo SaaS pro zákazníky?"
- "Kolik dat denně? GB, MB, nebo něco jiného?"
- "Real-time, nebo stačí dávkové zpracování?"`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Zadej zadání." }, { status: 400 });
    }

    const ollama = new Ollama({
      host: 'https://ollama.com',
      headers: {
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
      },
    });

    const response = await ollama.generate({
      model: MODEL,
      prompt: `${SYSTEM_PROMPT}\n\nZadání: ${prompt}`,
      stream: false,
      format: 'json',
      options: { temperature: 0.6 }
    });

    const content = response.response;
    let parsed: { questions?: Array<{ id?: string; text?: string }> };
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "AI nevrátila validní JSON." }, { status: 502 });
    }

    const questions = (parsed.questions || []).slice(0, 2).map((q, i) => ({
      id: q.id || `q${i + 1}`,
      text: q.text || "",
    })).filter((q) => q.text.length > 0);

    if (questions.length === 0) {
      return NextResponse.json({ error: "AI nevrátilo žádné otázky." }, { status: 502 });
    }

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Clarify API error:", err);
    return NextResponse.json({ error: "Něco se pokazilo." }, { status: 500 });
  }
}
