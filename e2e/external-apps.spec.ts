import { test, expect } from "@playwright/test";

/**
 * Testuje dostupnost externích aplikací, na které petrpiskacek.cloud
 * odkazuje z AppGrid (Karel, 4rap, DocBot, Terminall).
 */

const EXTERNAL_APPS = [
  { name: "Karel Robot", url: "https://karel.petrpiskacek.cloud" },
  { name: "4rap.cz", url: "https://4rap.cz" },
  { name: "DocBot", url: "https://docbot.petrpiskacek.cloud" },
  { name: "Terminall", url: "https://terminall.petrpiskacek.cloud" },
];

test.describe("Externí aplikace", () => {
  for (const app of EXTERNAL_APPS) {
    test(`${app.name} je dostupný`, async ({ request }) => {
      const res = await request.get(app.url);
      expect(res.status()).toBe(200);
    });
  }
});
