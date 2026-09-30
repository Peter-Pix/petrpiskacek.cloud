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
  "Jsi expertní frontend kodér. Na základě zadání klienta vytvoříš jeden kompletní, izolovaný HTML dokument, který lze okamžitě zobrazit v prohlížeči.",
  "",
  "NEJVYŠŠÍ PRAVIDLA — pokud je porušíš, výstup bude odmítnut:",
  "- Výstup MUSÍ začínat PŘESNĚ na '<!DOCTYPE html>' a končit PŘESNĚ na '</html>'.",
  "- Před '<!DOCTYPE html>' ani za '</html>' NESMÍ být JEDINÝ znak textu, vysvětlení, poznámka, prázdný řádek ani markdown fence.",
  "- NEPOUŽÍVEJ ```html ani ```. Vracím pouze čistý HTML bez obalu.",
  "- NIKDY nepiš věty jako 'Tady je...', 'Here's...', 'Vytvořil jsem...', 'Omlouváme se...' — jen kód.",
  "",
  "Technická pravidla:",
  "- Všechny styly píšu do <style> v <head> nebo inline. ŽÁDNÉ externí CSS soubory, žádné <link rel=stylesheet>.",
  "- ŽÁDNÉ externí závislosti: žádné CDN, žádné Google Fonts, žádné ikonické fonty, žádné frameworky, žádné skripty z jiných serverů.",
  "- Font-family: pouze system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif, serif, monospace.",
  "- Design: tmavý režim (background #0a0a0a, text #e5e5e5), akcent #c8962e (zlata).",
  "- Responzivní design (mobile-first), moderní CSS (flexbox, grid, custom properties).",
  "- Pokud uživatel zadá jen 'tlačítko' nebo 'formulář', vytvořím celou stránku s tím prvkem.",
  "- Píšu české popisky v UI (tlačítka, labely, placeholder texty).",
  "- NEPŘIDÁVÁM navigaci, menu, footer, copyright, ani odkazy na jiné stránky. Jen to, co uživatel zadal.",
  "- NEPOUŽÍVÁM iframe, object, embed, ani jiné vnořené dokumenty.",
  "- Nepřebírám obsah z okolní stránky. Dělám samostatný, izolovaný návrh.",
  "- Pokud návrh obsahuje více stránek/sekcí (např. prezentace, carousel, taby), přidám JS pro přepínání (šipky, klik, keyboard events).",
  "- Animace dělám plynulé a pomalé (transition: 0.4s-0.6s ease, ne 0.2s). Žádné trhané nebo příliš rychlé animace.",
  "- Používám bezpečné CSS animace: opacity, transform (translate, scale), background-color. Vyhýbám se animacím width/height/top/left, které způsobují layout shifting.",
  "- Pokud používám @keyframes, nastavuji animation-duration na 0.5s-1s, ne rychleji.",
  "- Veškerý JS píšu přímo do HTML (internal <script> tag), žádné externí soubory.",
  "",
  "Příklad správného výstupu:",
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
  if (!raw || typeof raw !== "string") return "";

  // Strip markdown code fences (including language tag and any surrounding fences).
  let cleaned = raw
    .replace(/^\s*```[a-zA-Z0-9_+-]*\n?/im, "")
    .replace(/\n?```\s*$/im, "")
    .trim();

  // If after stripping fences there are still stray leading/trailing backticks, remove them.
  cleaned = cleaned.replace(/^\s*`+/, "").replace(/`+\s*$/, "").trim();

  // Find DOCTYPE start (case-insensitive, allow leading whitespace).
  let start = cleaned.search(/<!DOCTYPE\s+html\b/i);
  if (start !== -1) {
    const before = cleaned.slice(0, start).trim();
    if (before) {
      console.warn("Discarded text before DOCTYPE:", before.slice(0, 200));
    }
  }

  // Fallback: find <html tag.
  if (start === -1) {
    start = cleaned.search(/<html\b/i);
  }

  // Last resort: if raw contains any <body or common HTML element, treat as fragment.
  if (start === -1) {
    const fragmentStart = cleaned.search(/<(?:body|div|section|nav|button|form|input|header|main|article|ul|ol|table|canvas|svg)/i);
    if (fragmentStart !== -1) {
      console.warn("Model returned HTML fragment; wrapping in template.");
      const fragment = cleaned.slice(fragmentStart);
      return wrapFragment(fragment);
    }
    return "";
  }

  // Find end of </html>.
  let end = cleaned.search(/<\/html\s*>/i);
  if (end === -1) {
    end = cleaned.length;
  } else {
    const match = cleaned.slice(end).match(/<\/html\s*>/i);
    end += match ? match[0].length : 7;
  }

  return cleaned.slice(start, end).trim();
}

// Wrap a bare HTML fragment in a complete document shell.
function wrapFragment(fragment: string): string {
  return [
    "<!DOCTYPE html>",
    '<html lang="cs">',
    "<head>",
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    "<style>",
    "  * { margin: 0; padding: 0; box-sizing: border-box; }",
    "  body { background: #0a0a0a; color: #e5e5e5; font-family: system-ui, sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }",
    "</style>",
    "</head>",
    "<body>",
    fragment,
    "</body>",
    "</html>",
  ].join("\n");
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
