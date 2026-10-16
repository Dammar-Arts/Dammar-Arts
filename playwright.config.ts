import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './tests/artifacts/runs',
  snapshotDir: './tests/artifacts/snapshots',
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:1314',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 14'],
      },
    },
  ],
  webServer: {
    command: 'hugo server -D --bind 127.0.0.1 --port 1314 --contentDir tests/fixtures',
    url: 'http://127.0.0.1:1314',
    reuseExistingServer: !(globalThis as any).process?.env?.CI,
    timeout: 30000,
  },
});