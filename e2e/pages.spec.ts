import { test, expect } from "@playwright/test";

/**
 * Testuje hlavní stránky a interní routy.
 */

test.describe("Stránky", () => {
  test("homepage se načte se správným titulkem", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/petrpiskacek\.cloud/);
  });

  test("challenge stránka (Sparring) se načte", async ({ page }) => {
    const response = await page.goto("/challenge");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Promysli to lépe|Sparring/i);
  });

  test("flash-ui stránka se načte", async ({ page }) => {
    const response = await page.goto("/flash-ui");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Flash UI/i);
  });
});

test.describe("AI Worker stránka", () => {
  test("ai-worker se načte s hero + case study + kalkulačkou", async ({ page }) => {
    const response = await page.goto("/ai-worker");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/AI pracovník/i);
    // Hero
    await expect(page.getByText("Potřebuje AI pracovníka")).toBeVisible();
    // Case study 1 — Sovereign OS
    await expect(page.getByText("50 firem v 13 sektorech")).toBeVisible();
    // Case study 2 — 4rap
    await expect(page.getByText("1 699 entit, 9 294 graf uzlů")).toBeVisible();
    // ROI kalkulačka
    await expect(page.getByText("Kalkulačka úspory")).toBeVisible();
    // Ceník
    await expect(page.getByText("Jedna cena. Žádné rozpětí.")).toBeVisible();
    // CTA
    await expect(page.getByText("20minutové demo")).toBeVisible();
  });
});
