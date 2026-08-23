import { test, expect } from "@playwright/test";

/**
 * Testuje Sparring API workflow end-to-end:
 * random-prompt → clarify → block → expand
 *
 * Tyto testy volají produkční API endpointy (nežádají LLM model,
 * takže každé volání trvá pár sekund).
 */

const API = "/api/sparring";

test.describe("Sparring API", () => {
  test("random-prompt vrátí prompt", async ({ request }) => {
    const res = await request.post(`${API}/random-prompt`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.prompt).toBeTruthy();
    expect(typeof data.prompt).toBe("string");
  });

  test("clarify vrátí 1-2 doplňující otázky", async ({ request }) => {
    const res = await request.post(`${API}/clarify`, {
      data: { prompt: "AI asistent pro malou logistickou firmu" },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.questions)).toBe(true);
    expect(data.questions.length).toBeGreaterThan(0);
    expect(data.questions.length).toBeLessThanOrEqual(2);
    for (const q of data.questions) {
      expect(q.text).toBeTruthy();
    }
  });

  test("block vrátí validní core blok", async ({ request }) => {
    const res = await request.post(`${API}/block`, {
      data: {
        prompt: "AI asistent pro logistiku",
        answers: { q1: "interní", q2: "real-time" },
        blockKind: "core",
      },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.block.kind).toBe("core");
    expect(data.block.what).toBeTruthy();
    expect(data.block.forWhom).toBeTruthy();
    expect(data.block.mainFeature).toBeTruthy();
  });

  test("block vrátí validní stack blok", async ({ request }) => {
    const res = await request.post(`${API}/block`, {
      data: {
        prompt: "AI asistent pro logistiku",
        answers: { q1: "interní" },
        blockKind: "stack",
      },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.block.kind).toBe("stack");
    for (const key of ["frontend", "backend", "database", "ai", "infra"]) {
      expect(data.block[key]).toBeTruthy();
    }
  });

  test("expand vrátí rozšíření bloku", async ({ request }) => {
    const res = await request.post(`${API}/expand`, {
      data: {
        prompt: "AI asistent pro logistiku",
        blockKind: "core",
        currentBlock: {
          kind: "core",
          what: "AI asistent pro logistiku",
          forWhom: "dispečeři",
          mainFeature: "plánování tras",
        },
      },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.expansion).toBeTruthy();
    expect(typeof data.expansion).toBe("string");
  });
});
