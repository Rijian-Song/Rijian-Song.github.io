const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
  testDir: ".",
  timeout: 60000,
  workers: 2,
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: require("node:path").resolve("output/playwright/report"), open: "never" }]],
  use: { deviceScaleFactor: 1, locale: "en-GB", timezoneId: "Europe/Brussels", colorScheme: "light", trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: [{ command: "node test/visual/server.js", port: 4101, reuseExistingServer: !process.env.CI }],
});
