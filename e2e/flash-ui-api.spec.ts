import { test, expect } from "@playwright/test";

/**
 * Testuje Flash UI API — generování HTML komponenty z promptu.
 */

const API = "/api/flash-ui";

test.describe("Flash UI API", () => {
  test("flash-ui vrátí HTML", async ({ request }) => {
    const res = await request.post(API, {
      data: { prompt: "tlačítko" },
    });
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<html");
    expect(body).toContain("<body");
  });

  test("flash-ui/random-prompt vrátí prompt", async ({ request }) => {
    const res = await request.post(`${API}/random-prompt`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.prompt).toBeTruthy();
  });
});
