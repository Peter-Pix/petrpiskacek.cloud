import { NextRequest, NextResponse } from "next/server";
import { MODELS } from "@/lib/models";

const OLLAMA_URL = "https://ollama.com/api/chat";
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

const SYSTEM_PROMPT = [
  "Jsi expertní UI/UX kodér. Na základě požadavku klienta vytvoříš jeden kompletní, izolovaný HTML dokument.",
  "",
  "Absolutní pravidla (NEPORUŠUJ):",
  "- Výstup začíná PŘESNĚ na '<!DOCTYPE html>' a končí PŘESNĚ na '</html>'.",
  "- Před '<!DOCTYPE html>' ani za '</html>' NESMÍ být žádný text, vysvětlení, poznámka ani prázdné řádky.",
  "- NEPOUŽÍVEJ markdown code-fence (```html ... ```). Vracím pouze čistý HTML.",
  "- Vracím POUZE HTML kód - žádné komentáře typu 'Tady je...', 'Here's a...', 'Vytvořil jsem...'.",
  "",
  "Technická pravidla:",
  "- Pouzivam inline CSS nebo <style> tag v <head>.",
  "- Pouzivam moderni CSS (flexbox, grid, custom properties).",
  "- Design: tmavy rezim (background #0a0a0a, text #e5e5e5), akcent #c8962e (zlata).",
  "- Responzivni design (mobile-first).",
  "- Zadny externi zavislosti (zadny CDN, zadny frameworky).",
  "- Pokud uzivatel zada jen 'tlacitko' nebo 'formular', vytvorim celou stranku s tim prvkem.",
  "- Pisu cesky popisky v UI (tlacitka, labely, placeholder texty).",
  "- NEPRIDAVAM navigaci, menu, footer, copyright, ani odkazy na jine stranky. Jen to, co uzivatel zadal.",
  "- NEPOUZIVAM iframe, object, embed, ani jine vnorene dokumenty.",
  "- Neprebiram obsah z okolni stranky. Delam samostatny, izolovany navrh.",
  "- Pokud navrh obsahuje vice stranek/sekci (napr. prezentace, carousel, taby), pridam JS pro prepinani (sipky, klik, keyboard events).",
  "- Animace delam plynule a pomale (transition: 0.4s-0.6s ease, ne 0.2s). Zadne trhane nebo prilis rychle animace.",
  "- Pouzivam bezpecne CSS animace: opacity, transform (translate, scale), background-color. Vyhybam se animacim width/height/top/left, ktere zpusobuji layout shifting.",
  "- Pokud pouzivam @keyframes, nastavuji animation-duration na 0.5s-1s, ne rychleji.",
  "- Veskery JS pisu primo do HTML (internal <script> tag), zadne externi soubory.",
  "",
  "Priklad vystupu:",
  "<!DOCTYPE html>",
  '<html lang="cs">',
  "<head>",
  '<meta charset="UTF-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  "<style>",
  "  * { margin: 0; padding: 0; box-sizing: border-box; }",
  "  body { background: #0a0a0a; color: #e5e5e5; font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; }",
  "</style>",
  "</head>",
  "<body>",
  "  <!-- HTML content -->",
  "</body>",
  "</html>",
].join("\n");

// Extract complete HTML document from any raw text.
function extractHtml(raw: string): string {
  const cleaned = raw
    .replace(/^\s*```[a-zA-Z]*\n?/im, "")
    .replace(/\n?```\s*$/im, "")
    .replace(/^\s*`+/, "")
    .replace(/`+\s*$/, "")
    .trim();

  const start = cleaned.search(/<!DOCTYPE\s+html/i);
  if (start === -1) {
    const htmlStart = cleaned.search(/<html/i);
    if (htmlStart === -1) return "";
    return cleaned.slice(htmlStart);
  }

  let end = cleaned.search(/<\/html\s*>/i);
  if (end === -1) end = cleaned.length;
  else end += cleaned.slice(end).match(/<\/html\s*>/i)![0].length;

  return cleaned.slice(start, end);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const limit = checkRateLimit(ip);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Denní limit využitý.",
          message: "Dneska jsi vyčerpal svých 5 návrhů. Zítra máš zase plnou náruč možností.",
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
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Chybí zadání." }, { status: 400 });
    }

    const apiKey = process.env.OLLAMA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Služba je dočasně nedostupná." }, { status: 500 });
    }

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODELS.flashUI,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 4096,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("Ollama error:", response.status, text.slice(0, 300));
      return NextResponse.json(
        { error: "Omlouváme se — náš AI návrhář má právě plné ruce práce. Zkus to za chvilku, jak se fronta trochu uvolní." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawOutput = data?.message?.content || "";
    const html = extractHtml(rawOutput);

    if (!html) {
      console.error("No HTML extracted. Raw preview:", rawOutput.slice(0, 500));
      return NextResponse.json(
        { error: "Omlouváme se — teď je o Flash UI takový zájem, že server potřebuje krátký dech. Zkus to za pár vteřin." },
        { status: 502 }
      );
    }

    return new Response(html, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-RateLimit-Limit": String(DAILY_LIMIT),
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  } catch (err) {
    console.error("Flash UI API error:", err);
    return NextResponse.json(
      { error: "Omlouváme se — momentálně je o naše návrhy takový nával, že servery potřebují pauzu. Zkus to za chvilku." },
      { status: 500 }
    );
  }
}
