import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";
import { MODELS, OPENROUTER_URL } from "@/lib/models";

const OLLAMA_MODEL = MODELS.sparring;
const OPENROUTER_MODEL = "google/gemini-2.5-flash";

const SYSTEM_PROMPT = `Jsi Sparring — AI architekt, co mluví jako člověk z oboru. MLUV ČESKY. VŽDY ODPOVÍDEJ ČESKY.

User chce ROZŠÍŘIT konkrétní blok plánu. Tvůj úkol je přidat 2-3 STRUČNÉ VĚTY S KONKRÉTNÍMI DETaily.

PRAVIDLA:
- MLUV ČESKY. Všechny odpovědi piš česky.
- Max 2-3 krátké věty. Žádné odstavce.
- BUĎ KONKRÉTNÍ: uveď čísla, názvy technologií, postupy, termíny, ceny.
- Neopakuj informace, které už jsou v bloku.
- NEPIŠ obecné fráze typu "moderní řešení", "škálovatelná architektura", "best practices", "robustní základ".
- Příklad DOBRÉHO rozšíření (timeline): "Nejprve dodělat MVP do konce října — registrace, profil, základní dashboard. V listopadu nasadit platby přes Stripe a notifikace. V prosinci pustit beta test s 50 uživateli."
- Příklad ŠPATNÉHO rozšíření: "Tato fáze zahrnuje implementaci klíčových funkcionalit a zajištění robustního základu pro další rozvoj projektu s ohledem na moderní standardy."

Vrať POUZE validní JSON bez formátování:
{ "expansion": "2-3 krátké české věty, max 50 slov celkem" }`;

function buildUserContent(prompt: string, blockKind: string, currentBlock: unknown): string {
  return `Zadání: ${prompt}\n\nAktuální blok (${blockKind}):\n${JSON.stringify(currentBlock, null, 2)}\n\nRozšiř tento blok o 2-3 konkrétní věty navíc.`;
}

function safeParseJSON(text: string): { expansion?: string } | null {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function callOllama(prompt: string, blockKind: string, currentBlock: unknown): Promise<string> {
  const ollama = new Ollama({
    host: 'https://ollama.com',
    headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },
  });

  const userContent = buildUserContent(prompt, blockKind, currentBlock);
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${userContent}`;

  const response = await ollama.generate({
    model: OLLAMA_MODEL,
    prompt: fullPrompt,
    stream: false,
    format: 'json',
  });

  const parsed = safeParseJSON(response.response);
  if (!parsed?.expansion) {
    throw new Error(`Ollama nevrátila validní rozšíření: ${response.response.slice(0, 200)}`);
  }

  return parsed.expansion;
}

async function callOpenRouter(prompt: string, blockKind: string, currentBlock: unknown): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OpenRouter API key není nastaven");

  const userContent = buildUserContent(prompt, blockKind, currentBlock);

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://petrpiskacek.cloud",
      "X-Title": "petrpiskacek.cloud Sparring",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.5,
      max_tokens: 200,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter vrátil ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter nevrátil žádný obsah");

  const parsed = safeParseJSON(content);
  if (!parsed?.expansion) {
    throw new Error(`OpenRouter nevrátila validní rozšíření: ${content.slice(0, 200)}`);
  }

  return parsed.expansion;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, blockKind, currentBlock } = body;

    if (!prompt || !blockKind || !currentBlock) {
      return NextResponse.json({ error: "Chybí parametry." }, { status: 400 });
    }

    // 1. Attempt Ollama Cloud
    try {
      const expansion = await callOllama(prompt, blockKind, currentBlock);
      return NextResponse.json({ expansion });
    } catch (ollamaErr) {
      console.error("Ollama expand failed:", ollamaErr);
    }

    // 2. Fallback to OpenRouter
    try {
      const expansion = await callOpenRouter(prompt, blockKind, currentBlock);
      return NextResponse.json({ expansion });
    } catch (orErr) {
      console.error("OpenRouter expand fallback failed:", orErr);
    }

    // 3. Both failed
    return NextResponse.json(
      { error: "AI služba není dostupná. Zkus to prosím později." },
      { status: 502 }
    );
  } catch (err) {
    console.error("Expand API critical error:", err);
    return NextResponse.json(
      { error: "Něco se pokazilo. Zkus to prosím později." },
      { status: 500 }
    );
  }
}
