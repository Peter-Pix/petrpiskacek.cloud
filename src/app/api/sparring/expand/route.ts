import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

const SYSTEM_PROMPT = `Jsi Sparring — AI architekt, co mluví jako člověk z oboru.

User chce ROZŠÍŘIT konkrétní blok plánu. Tvůj úkol je přidat 2-3 VĚTY KONKRÉTNÍCH DETAILŮ, ne obecné fráze.

PRAVIDLA:
- Přidej max 2-3 věty, ne odstavec.
- Přidej KONKRÉTNÍ DETAIL: čísla, názvy, postupy, rozhodnutí.
- Neopakuj to, co už je v bloku.
- Příklad dobrého rozšíření stacku: "Frontend doporučuju Next.js 15 s App Routerem, Server Actions pro formuláře. Backend na FastAPI, protože potřebuješ async I/O pro LLM volání. Postgres 16, pgvector pro embedding search."
- Příklad špatného rozšíření: "Tato architektura zahrnuje moderní technologie a poskytuje robustní základ pro škálovatelné AI řešení s ohledem na best practices..."

Vrať JSON:
{ "expansion": "2-3 krátké věty, max 50 slov celkem" }`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, answers, blockKind, currentBlock } = body;

    if (!prompt || !blockKind || !currentBlock) {
      return NextResponse.json({ error: "Chybí parametry." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chybí API klíč." }, { status: 500 });
    }

    const userContent = `Zadání: ${prompt}\n\nAktuální blok (${blockKind}):\n${JSON.stringify(currentBlock, null, 2)}\n\nRozšiř tento blok o 2-3 konkrétní věty navíc.`;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://petrpiskacek.cloud",
        "X-Title": "petrpiskacek.cloud Sparring",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.5,
        max_tokens: 200,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("OpenRouter error (expand):", response.status, text.slice(0, 300));
      return NextResponse.json({ error: "AI služba není dostupná." }, { status: 502 });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Prázdná odpověď." }, { status: 502 });
    }

    let parsed: { expansion?: string };
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Nepodařilo se parsovat." }, { status: 502 });
    }

    if (!parsed.expansion) {
      return NextResponse.json({ error: "AI nevrátilo rozšíření." }, { status: 502 });
    }

    return NextResponse.json({ expansion: parsed.expansion });
  } catch (err) {
    console.error("Expand API error:", err);
    return NextResponse.json({ error: "Něco se pokazilo." }, { status: 500 });
  }
}
