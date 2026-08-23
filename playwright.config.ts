import { defineConfig, devices } from "@playwright/test";

/**
 * E2E testy pro petrpiskacek.cloud.
 *
 * Testy běží proti živé produkci (baseURL). Sparring/Flash UI API testy
 * jsou označené @api a dají se spustit samostatně.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: process.env.BASE_URL || "https://petrpiskacek.cloud",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
