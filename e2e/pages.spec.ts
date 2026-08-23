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
