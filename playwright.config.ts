import { defineConfig, devices } from '@playwright/test';
import { ENV } from './config/env';

/**
 * Suite del carrito de SauceDemo.
 *
 *   npx playwright test --config projects/saucedemo-qa/playwright.config.ts
 *
 * o, desde la carpeta del proyecto, `npm test`.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,

  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/html', open: 'never' }],
    ['json', { outputFile: './results/resultados.json' }],
  ],

  use: {
    baseURL: ENV.baseURL,
    // SauceDemo marca sus elementos con data-test, no con data-testid.
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    // channel 'chromium' usa el Chromium completo tambien en headless: asi no
    // hace falta tener instalado chrome-headless-shell.
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chromium' } },
  ],
});
