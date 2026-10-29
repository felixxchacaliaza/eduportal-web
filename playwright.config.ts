import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración oficial de Playwright E2E para eduportal-web
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4200',
    storageState: './tests/e2e/.auth/admin-state.json',
    trace: 'off',
    screenshot: 'only-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
