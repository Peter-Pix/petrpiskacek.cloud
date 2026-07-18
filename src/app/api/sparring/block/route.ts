import { NextRequest, NextResponse } from "next/server";
import type { Block, BlockKind } from "@/lib/sparring-types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

const BLOCK_SCHEMAS: Record<BlockKind, string> = {
  core: `Vrať JSON:
{
  "what": "1 věta (max 12 slov) - co to je",
  "forWhom": "1 věta (max 12 slov) - pro koho",
  "mainFeature": "1 věta (max 15 slov) - hlavní feature"
}`,
  stack: `Vrať JSON:
{
  "frontend": "1-2 slova (např. 'Next.js')",
  "backend": "1-2 slova (např. 'FastAPI')",
  "database": "1-2 slova (např. 'Postgres + pgvector')",
  "ai": "1-2 slova (např. 'Claude Sonnet' nebo 'lokální LLM')",
  "infra": "1-2 slova (např. 'Vercel + Railway')"
}`,
  costs: `Vrať JSON:
{
  "oneTime": "1-2 krátké věty - implementace (max 20 slov)",
  "monthly": "1-2 krátké věty - měsíční provoz (max 20 slov)",
  "mvp": "1-2 krátké věty - MVP scope (max 20 slov)",
  "note": "1 věta (volitelné) - důležitá poznámka"
}`,
  timeline: `Vrať JSON:
{
  "phase1": "1-2 krátké věty - fáze 1, 1-2 týdny (max 20 slov)",
  "phase2": "1-2 krátké věty - fáze 2, 2-4 týdny (max 20 slov)",
  "phase3": "1-2 krátké věty - fáze 3, 1+ měsíc (max 20 slov)"
}`,
};

const BASE_SYSTEM = `Jsi Sparring — AI architekt, co mluví jako člověk z oboru. Ne korporát.
Hlas: přímý, vtipný, konkrétní. Žádné fráze typu "komplexní", "robustní", "enterprise-grade".

PRAVIDLA PRO VŠECHNY BLOKY:
- KRÁTKÉ VĚTY. Každá hodnota max 12-20 slov, NE ODSTAVEC.
- Buď KONKRÉTNÍ. "Postgres", ne "relační databáze". "Next.js", ne "moderní frontend framework".
- PŘIZPŮSOB zadání a odpovědím. Pokud user řekl "malá firma do 20 lidí", nepíšeš enterprise řešení.
- PŘEMÝŠLEJ jako architekt v hospodě. Co bys poradil zkušenému kolegovi?

`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, answers, blockKind } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Chybí zadání." }, { status: 400 });
    }
    if (!blockKind || !["core", "stack", "costs", "timeline"].includes(blockKind)) {
      return NextResponse.json({ error: "Neplatný typ bloku." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chybí API klíč." }, { status: 500 });
    }

    // Sestavení kontextu pro AI
    const answersText = answers && Object.keys(answers).length > 0
      ? `\n\nDoplňující odpovědi:\n${Object.entries(answers).map(([k, v]) => `- ${k}: ${v}`).join("\n")}`
      : "";

    const userContent = `Zadání: ${prompt}${answersText}\n\nVygeneruj BLOK: ${blockKind.toUpperCase()}\n\n${BLOCK_SCHEMAS[blockKind as BlockKind]}`;

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
          { role: "system", content: BASE_SYSTEM },
          { role: "user", content: userContent },
        ],
        temperature: 0.5,
        max_tokens: 400,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("OpenRouter error (block):", response.status, text.slice(0, 300));
      return NextResponse.json({ error: "AI služba není dostupná." }, { status: 502 });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Prázdná odpověď." }, { status: 502 });
    }

    let parsed: Block;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Block parse error:", content.slice(0, 300));
      return NextResponse.json({ error: "Nepodařilo se parsovat blok." }, { status: 502 });
    }

    // Validace: blok musí mít kind
    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json({ error: "Neplatný formát bloku." }, { status: 502 });
    }
    parsed.kind = blockKind;

    return NextResponse.json({ block: parsed });
  } catch (err) {
    console.error("Block API error:", err);
    return NextResponse.json({ error: "Něco se pokazilo." }, { status: 500 });
  }
}
