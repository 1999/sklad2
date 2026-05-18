const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test',
  use: {
    baseURL: 'http://localhost:8080',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node test/server.js',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});
