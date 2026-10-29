import { defineConfig, devices } from '@playwright/test'

/*
 * Responsive and accessibility smoke tests. Point BASE_URL at a running server
 * (default: `npm run build && npm start` on :3000).
 */
const baseURL = process.env.BASE_URL || 'http://localhost:3000'

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: { baseURL, trace: 'off' },
  projects: [
    { name: 'mobile-360', use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 780 }, hasTouch: true } },
    { name: 'tablet-768', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
})
