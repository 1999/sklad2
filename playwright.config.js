const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node test/server.js',
    url: 'http://localhost:8080/test/fixture.html',
    reuseExistingServer: !process.env.CI,
  },
});
