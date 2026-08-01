import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";
import { MODELS, OPENROUTER_URL } from "@/lib/models";

const OLLAMA_MODEL = MODELS.sparring;
const OPENROUTER_MODEL = "google/gemini-2.5-flash";
const DAILY_LIMIT = 5;

const ipUsage = new Map<string, { count: number; date: string }>();

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetDate: string } {
  const today = new Date().toISOString().split("T")[0];
  const record = ipUsage.get(ip);
  if (!record || record.date !== today) {
    ipUsage.set(ip, { count: 1, date: today });
    return { allowed: true, remaining: DAILY_LIMIT - 1, resetDate: today };
  }
  if (record.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, resetDate: today };
  }
  record.count++;
  return { allowed: true, remaining: DAILY_LIMIT - record.count, resetDate: today };
}

const BLOCK_SCHEMAS: Record<string, Record<string, string>> = {
  core: {
    what: "1 věta — CO to je",
    forWhom: "1 věta — PRO KOHO",
    mainFeature: "1 věta — HLAVNÍ FEATURE",
  },
  stack: {
    frontend: "doporučený frontend stack",
    backend: "doporučený backend stack",
    database: "doporučená databáze",
    ai: "AI komponenty",
    infra: "infrastruktura a hosting",
  },
  costs: {
    oneTime: "jednorázové náklady na implementaci",
    monthly: "měsíční provozní náklady",
    mvp: "MVP scope a odhad",
    note: "volitelná doplňující poznámka",
  },
  timeline: {
    prvniFaze: "1-2 týdny — první fáze",
    druhaFaze: "2-4 týdny — druhá fáze",
    tretiFaze: "1+ měsíc — třetí fáze",
  },
};

function buildSystemPrompt(blockKind: string, prompt: string, answers: Record<string, string>): string {
  const schema = BLOCK_SCHEMAS[blockKind];
  if (!schema) throw new Error(`Neznámý typ bloku: ${blockKind}`);

  const fields = Object.entries(schema)
    .map(([key, desc]) => `"${key}": "${desc}"`)
    .join(",\n    ");

  return `Jsi expert na business analýzu. MLUV ČESKY. VŽDY ODPOVÍDEJ ČESKY. Generuj strukturovaný blok typu "${blockKind}" pro projekt: ${prompt}.

Odpovědi na doplňující otázky: ${JSON.stringify(answers)}.

Vrať POUZE validní JSON objekt bez jakéhokoliv textu, formátování nebo markdownu. Všechny hodnoty piš ČESKY:
{
  "kind": "${blockKind}",
  ${fields}
}

Každá hodnota musí být string. Žádný další text, žádné vysvětlivky, jen JSON.`;
}

function validateBlock(data: unknown, blockKind: string): boolean {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (obj.kind !== blockKind) return false;

  const schema = BLOCK_SCHEMAS[blockKind];
  if (!schema) return false;

  for (const key of Object.keys(schema)) {
    if (typeof obj[key] !== "string" || !(obj[key] as string).trim()) return false;
  }
  return true;
}

function safeParseJSON(text: string): unknown {
  // Zkus parsovat rovnou
  try {
    return JSON.parse(text);
  } catch {
    // Zkus najít JSON v textu (model občas přidá markdown nebo text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // nothing
      }
    }
    return null;
  }
}

async function callOllama(prompt: string, answers: Record<string, string>, blockKind: string): Promise<unknown> {
  const ollama = new Ollama({
    host: 'https://ollama.com',
    headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },
  });

  const systemPrompt = buildSystemPrompt(blockKind, prompt, answers);

  const response = await ollama.generate({
    model: OLLAMA_MODEL,
    prompt: systemPrompt,
    stream: false,
    format: 'json',
  });

  const parsed = safeParseJSON(response.response);
  if (!parsed) {
    throw new Error(`Ollama nevrátila validní JSON: ${response.response.slice(0, 200)}`);
  }

  if (!validateBlock(parsed, blockKind)) {
    throw new Error(`Ollama vrátila nevalidní strukturu bloku: ${JSON.stringify(parsed).slice(0, 200)}`);
  }

  return parsed;
}

async function callOpenRouter(prompt: string, answers: Record<string, string>, blockKind: string): Promise<unknown> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) throw new Error("OpenRouter API key není nastaven");

  const systemPrompt = buildSystemPrompt(blockKind, prompt, answers);

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openRouterKey}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`OpenRouter vrátil ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter nevrátil žádný obsah");

  const parsed = safeParseJSON(content);
  if (!parsed) {
    throw new Error(`OpenRouter nevrátila validní JSON: ${content.slice(0, 200)}`);
  }

  if (!validateBlock(parsed, blockKind)) {
    throw new Error(`OpenRouter vrátila nevalidní strukturu bloku: ${JSON.stringify(parsed).slice(0, 200)}`);
  }

  return parsed;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(req);
    const limit = checkRateLimit(ip);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Denní limit vyčerpán.",
          message: "Můžeš generovat max 5x denně. Zkus to zítra.",
          limit: DAILY_LIMIT,
          remaining: 0,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(DAILY_LIMIT),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": limit.resetDate,
          },
        }
      );
    }

    const body = await req.json();
    const { prompt, answers, blockKind } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Chybí prompt." }, { status: 400 });
    }
    if (!blockKind || !BLOCK_SCHEMAS[blockKind]) {
      return NextResponse.json({ error: `Neznámý typ bloku: ${blockKind}` }, { status: 400 });
    }

    // 1. Attempt Ollama Cloud
    try {
      const block = await callOllama(prompt, answers, blockKind);
      return NextResponse.json({ block }, {
        headers: {
          "X-RateLimit-Limit": String(DAILY_LIMIT),
          "X-RateLimit-Remaining": String(limit.remaining),
        },
      });
    } catch (ollamaErr) {
      console.error("Ollama failed:", ollamaErr);
    }

    // 2. Fallback to OpenRouter
    try {
      const block = await callOpenRouter(prompt, answers, blockKind);
      return NextResponse.json({ block }, {
        headers: {
          "X-RateLimit-Limit": String(DAILY_LIMIT),
          "X-RateLimit-Remaining": String(limit.remaining),
        },
      });
    } catch (orErr) {
      console.error("OpenRouter fallback failed:", orErr);
    }

    // 3. Both failed
    return NextResponse.json(
      { error: "AI služba není dostupná. Zkus to prosím později." },
      {
        status: 502,
        headers: {
          "X-RateLimit-Limit": String(DAILY_LIMIT),
          "X-RateLimit-Remaining": String(limit.remaining),
        },
      }
    );
  } catch (err) {
    console.error("Block API critical error:", err);
    return NextResponse.json(
      { error: "AI služba není dostupná. Zkus to prosím později." },
      { status: 502 }
    );
  }
}
