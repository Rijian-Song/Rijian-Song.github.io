const { test, expect } = require("@playwright/test");
test("publication covers defer requests without losing original dimensions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const covers = new Set();
  page.on("request", (request) => {
    if (request.url().includes("/publication_preview/")) covers.add(request.url());
  });
  await page.goto("http://127.0.0.1:4101/publications/", { waitUntil: "networkidle" });
  expect(covers.size).toBeGreaterThan(0);
  expect(covers.size).toBeLessThan(29);
  const images = page.locator("img.preview");
  await expect(images).toHaveCount(29);
  expect(await images.evaluateAll((all) => all.every((img) => Number(img.getAttribute("width")) > 0 && Number(img.getAttribute("height")) > 0))).toBe(
    true
  );
  const initialRequests = covers.size;
  await images.last().scrollIntoViewIfNeeded();
  await expect.poll(() => covers.size).toBeGreaterThan(initialRequests);
  await expect.poll(() => images.last().evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
});
test("publication filtering waits 300 ms and cancels superseded input", async ({ page }) => {
  await page.goto("http://127.0.0.1:4101/publications/", { waitUntil: "networkidle" });
  await page.clock.install();
  await page.locator("#bibsearch").fill("no-such-paper");
  await page.clock.runFor(200);
  await page.locator("#bibsearch").fill("thiol-rich");
  await page.clock.runFor(200);
  await expect(page.locator(".bibliography > li:visible")).toHaveCount(29);
  await page.clock.runFor(100);
  await expect(page.locator(".bibliography > li:visible")).toHaveCount(1);
  await page.locator("#bibsearch").fill("");
  await page.clock.runFor(300);
  await expect(page.locator(".bibliography > li:visible")).toHaveCount(29);
});
