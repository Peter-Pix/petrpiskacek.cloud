import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";
import { MODELS, OPENROUTER_URL } from "@/lib/models";

const OLLAMA_MODEL = MODELS.sparring;
const OPENROUTER_MODEL = "google/gemini-2.5-flash";

const SYSTEM_PROMPT = `Jsi Sparring — AI architekt, co s tebou přemýšlí o projektu.
Hlas: přímý, vtipný, konkrétní. Mluvíš jako zkušený architekt v hospodě, ne jako korporát. MLUV ČESKY. VŽDY ODPOVÍDEJ ČESKY.

Když dostaneš zadání, tvůj úkol je ZJISTIT 1-2 KLÍČOVÉ INFO, které potřebuješ, abys mohl dát dobrý plán.

Vrať POUZE validní JSON bez formátování ve formátu:
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

type Question = { id: string; text: string };

function safeParseJSON(text: string): { questions?: Array<{ id?: string; text?: string }> } | null {
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

function validateQuestions(parsed: { questions?: Array<{ id?: string; text?: string }> }): Question[] {
  const questions = (parsed.questions || [])
    .slice(0, 2)
    .map((q, i) => ({ id: q.id || `q${i + 1}`, text: q.text || "" }))
    .filter((q) => q.text.length > 0);
  return questions;
}

async function callOllama(prompt: string): Promise<Question[]> {
  const ollama = new Ollama({
    host: 'https://ollama.com',
    headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },
  });

  const response = await ollama.generate({
    model: OLLAMA_MODEL,
    prompt: `${SYSTEM_PROMPT}\n\nZadání: ${prompt}`,
    stream: false,
    format: 'json',
    options: { temperature: 0.6 },
  });

  const parsed = safeParseJSON(response.response);
  if (!parsed) {
    throw new Error(`Ollama nevrátila validní JSON: ${response.response.slice(0, 200)}`);
  }

  const questions = validateQuestions(parsed);
  if (questions.length === 0) {
    throw new Error(`Ollama nevrátila žádné validní otázky: ${response.response.slice(0, 200)}`);
  }

  return questions;
}

async function callOpenRouter(prompt: string): Promise<Question[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OpenRouter API key není nastaven");

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
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
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
  if (!parsed) {
    throw new Error(`OpenRouter nevrátila validní JSON: ${content.slice(0, 200)}`);
  }

  const questions = validateQuestions(parsed);
  if (questions.length === 0) {
    throw new Error(`OpenRouter nevrátila žádné validní otázky: ${content.slice(0, 200)}`);
  }

  return questions;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Zadej zadání." }, { status: 400 });
    }

    // 1. Attempt Ollama Cloud
    try {
      const questions = await callOllama(prompt.trim());
      return NextResponse.json({ questions });
    } catch (ollamaErr) {
      console.error("Ollama clarify failed:", ollamaErr);
    }

    // 2. Fallback to OpenRouter
    try {
      const questions = await callOpenRouter(prompt.trim());
      return NextResponse.json({ questions });
    } catch (orErr) {
      console.error("OpenRouter clarify fallback failed:", orErr);
    }

    // 3. Both failed
    return NextResponse.json(
      { error: "AI služba není dostupná. Zkus to prosím později." },
      { status: 502 }
    );
  } catch (err) {
    console.error("Clarify API critical error:", err);
    return NextResponse.json({ error: "Něco se pokazilo." }, { status: 500 });
  }
}
