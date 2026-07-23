import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-v4-flash";

const SYSTEM_PROMPT = `Jsi expert na HTML/CSS/JS. Generuješ čistý, funkční HTML kód na základě zadání uživatele.

Pravidla:
- Generuj POUZE HTML kód — žádné vysvětlivky, žádný komentář před/po kódu
- Používej inline CSS nebo <style> tag v <head>
- Používej moderní CSS (flexbox, grid, custom properties)
- Design: tmavý režim (background #0a0a0a, text #e5e5e5), akcent #c8962e (zlatá)
- Responzivní design (mobile-first)
- Žádný externí závislosti (žádný CDN, žádný frameworky)
- Výstup musí být kompletní HTML dokument (<!DOCTYPE html> až </html>)
- Pokud uživatel zadá jen "tlačítko" nebo "formulář", vygeneruj celou stránku s tím prvkem
- Piš česky popisky v UI (tlačítka, labely, placeholder texty)

Příklad výstupu:
<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0a; color: #e5e5e5; font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
  /* ... rest of styles */
</style>
</head>
<body>
  <!-- HTML content -->
</body>
</html>`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Chybí prompt." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chybí API klíč." }, { status: 500 });
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://petrpiskacek.cloud",
        "X-Title": "petrpiskacek.cloud Flash UI",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("OpenRouter error:", response.status, text.slice(0, 300));
      return NextResponse.json(
        { error: "AI služba není dostupná." },
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

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed?.choices?.[0]?.delta?.content || "";
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }

          if (buffer.startsWith("data: ")) {
            const data = buffer.slice(6).trim();
            if (data !== "[DONE]") {
              try {
                const parsed = JSON.parse(data);
                const content = parsed?.choices?.[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Skip
              }
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
      },
    });
  } catch (err) {
    console.error("Flash UI API error:", err);
    return NextResponse.json(
      { error: "Něco se pokazilo." },
      { status: 500 }
    );
  }
}
