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
  "Pomaham s navrhem HTML kodu. Delam cisty, funkcni HTML na zaklade zadani.",
  "",
  "Pravidla:",
  "- Vracim POUZE HTML kod - zadne vysvetlivky, zadny komentar pred/po kodu",
  "- Pouzivam inline CSS nebo <style> tag v <head>",
  "- Pouzivam moderni CSS (flexbox, grid, custom properties)",
  "- Design: tmavy rezim (background #0a0a0a, text #e5e5e5), akcent #c8962e (zlata)",
  "- Responzivni design (mobile-first)",
  "- Zadny externi zavislosti (zadny CDN, zadny frameworky)",
  "- Vystup musi byt kompletni HTML dokument (<!DOCTYPE html> az </html>)",
  "- Pokud uzivatel zada jen 'tlacitko' nebo 'formular', vytvorim celou stranku s tim prvkem",
  "- Pisu cesky popisky v UI (tlacitka, labely, placeholder texty)",
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

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const limit = checkRateLimit(ip);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Denni limit vycerpan.",
          message: "Muzes generovat max 5x denne. Zkus to zitra.",
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
      return NextResponse.json({ error: "Chybi prompt." }, { status: 400 });
    }

    const apiKey = process.env.OLLAMA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chybi API klic." }, { status: 500 });
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
        stream: true,
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
        { error: "AI sluzba neni dostupna." },
        { status: 502 }
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: "No response stream." }, { status: 502 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let buffer = "";
        let hasStartedHtml = false;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const parsed = JSON.parse(line);
                const content = parsed?.message?.content || "";
                if (content) {
                  if (!hasStartedHtml) {
                    const htmlStartIndex = content.indexOf("<html");
                    const doctypeIndex = content.indexOf("<!DOCTYPE");
                    const startPos = Math.max(doctypeIndex, htmlStartIndex);
                    if (startPos !== -1) {
                      hasStartedHtml = true;
                      controller.enqueue(encoder.encode(content.slice(startPos)));
                    }
                  } else {
                    controller.enqueue(encoder.encode(content));
                  }
                }
              } catch {
                // skip
              }
            }
          }

          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer);
              const content = parsed?.message?.content || "";
              if (content) {
                if (!hasStartedHtml) {
                  const htmlStartIndex = content.indexOf("<html");
                  const doctypeIndex = content.indexOf("<!DOCTYPE");
                  const startPos = Math.max(doctypeIndex, htmlStartIndex);
                  if (startPos !== -1) {
                    controller.enqueue(encoder.encode(content.slice(startPos)));
                  }
                } else {
                  controller.enqueue(encoder.encode(content));
                }
              }
            } catch {
              // skip
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
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
      { error: "Necco se pokazilo." },
      { status: 500 }
    );
  }
}
