import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-5";

const SYSTEM_PROMPT = `Jsi AI solution architect. Generuješ kompletní návrh AI řešení na základě zadání uživatele.

Formát výstupu (použij ## pro sekce):

## Architektura
Popiš architekturu řešení. Jaké komponenty, jak spolu komunikují, jaké technologie.

## Odhad nákladů
Odhad ceny. Rozděl na jednorázové náklady a měsíční provoz. Uveď v USD.

## Harmonogram
Časový plán implementace. Rozděl na fáze (týdny/měsíce).

## Technologie
Seznam technologií. Každá na nový řádek s krátkým popisem.

## Návrh databáze
Hlavní tabulky/entity a vztahy mezi nimi.

## Workflow
Krok za krokem, jak řešení funguje od vstupu po výstup.

Piš česky. Buď konkrétní, ne obecný.`;

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
        "X-Title": "petrpiskacek.cloud Challenge",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
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

    // Stream the response back
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

            // Parse SSE from OpenRouter
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

          // Process remaining buffer
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
    console.error("Challenge API error:", err);
    return NextResponse.json(
      { error: "Něco se pokazilo." },
      { status: 500 }
    );
  }
}
