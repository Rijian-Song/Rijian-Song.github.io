const { test, expect } = require("@playwright/test");
const { PNG } = require("pngjs");
const routes = [
  "/",
  "/research/",
  "/projects/01-injectable-hydrogel-mechanics/",
  "/projects/02-wet-tissue-adhesion/",
  "/projects/03-chronic-wound-repair/",
  "/projects/04-translational-hydrogel-platform/",
  "/publications/",
  "/news/",
  "/news/2026-09-08-esb-presentation/",
  "/notes/",
  "/contact/",
  "/cv/",
  "/404.html",
];
const widths = [390, 576, 768, 1024, 1440];
async function ready(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Load below-fold images for a complete visual comparison; loading behaviour is tested separately.
    await Promise.all(
      [...document.images].map(async (img) => {
        img.loading = "eager";
        await img.decode();
      })
    );
  });
}
test.afterEach(async ({ browser }) => {
  for (const context of browser.contexts()) await context.close();
});
async function stableScreenshot(page, fullPage = true) {
  await page.bringToFront();
  let previous;
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const current = await page.screenshot({ fullPage });
    if (previous && previous.equals(current)) return current;
    previous = current;
  }
  throw new Error("Page did not reach a stable screenshot");
}
async function compare(before, after, info, name) {
  const a = await stableScreenshot(before, name !== "scroll");
  const b = await stableScreenshot(after, name !== "scroll");
  const pa = PNG.sync.read(a),
    pb = PNG.sync.read(b);
  expect([pb.width, pb.height]).toEqual([pa.width, pa.height]);
  const { default: pixelmatch } = await import("pixelmatch");
  const diff = new PNG({ width: pa.width, height: pa.height });
  const changed = pixelmatch(pa.data, pb.data, diff.data, pa.width, pa.height, { threshold: 0, includeAA: true });
  if (changed) {
    await info.attach(name + "-before", { body: a, contentType: "image/png" });
    await info.attach(name + "-after", { body: b, contentType: "image/png" });
    await info.attach(name + "-diff", { body: PNG.sync.write(diff), contentType: "image/png" });
  }
  expect(changed, name + ": changed pixels").toBe(0);
}
for (const width of widths)
  for (const route of routes) {
    test(`${width} ${route}`, async ({ browser }, info) => {
      const before = await browser.newPage({ deviceScaleFactor: 1, locale: "en-GB", timezoneId: "Europe/Brussels", colorScheme: "light" }),
        after = await browser.newPage({ deviceScaleFactor: 1, locale: "en-GB", timezoneId: "Europe/Brussels", colorScheme: "light" });
      for (const p of [before, after]) await p.setViewportSize({ width, height: 900 });
      await ready(before, "http://127.0.0.1:4100" + route);
      await ready(after, "http://127.0.0.1:4101" + route);
      if (process.env.VISUAL_NEGATIVE_CONTROL === "1") await after.addStyleTag({ content: "body { background: magenta !important; }" });
      await compare(before, after, info, "page");
      await expect(after.locator("body")).toBeVisible();
      expect(await after.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
test("menu, filter, zoom and scrolling remain usable", async ({ browser }, info) => {
  const before = await browser.newPage({ deviceScaleFactor: 1, locale: "en-GB", timezoneId: "Europe/Brussels", colorScheme: "light" }),
    after = await browser.newPage({ deviceScaleFactor: 1, locale: "en-GB", timezoneId: "Europe/Brussels", colorScheme: "light" });
  for (const p of [before, after]) {
    await p.setViewportSize({ width: 390, height: 900 });
    await ready(p, `http://127.0.0.1:${p === before ? 4100 : 4101}/publications/`);
    await p.getByRole("button", { name: "Toggle navigation" }).click();
    await expect(p.getByRole("button", { name: "Toggle navigation" })).toHaveAttribute("aria-expanded", "true");
  }
  await compare(before, after, info, "menu");
  for (const p of [before, after]) {
    await p.keyboard.press("Escape");
    await expect(p.getByRole("button", { name: "Toggle navigation" })).toHaveAttribute("aria-expanded", "false");
    await expect(p.locator(".bibliography > li:visible")).toHaveCount(29);
    await p.locator("#bibsearch").fill("thiol-rich");
    await expect(p.locator(".bibliography > li:visible")).toHaveCount(1);
  }
  await compare(before, after, info, "filter");
  for (const p of [before, after]) {
    await p.locator("#bibsearch").fill("");
    await expect(p.locator(".bibliography > li:visible")).toHaveCount(29);
    await Promise.all([
      p.evaluate(
        () => new Promise((resolve) => document.querySelector("img[data-zoomable]").addEventListener("medium-zoom:opened", resolve, { once: true }))
      ),
      p.locator("img[data-zoomable]").first().click(),
    ]);
    await expect(p.locator(".medium-zoom-image--opened").first()).toBeVisible();
    await p.keyboard.press("Escape");
    await expect(p.locator(".medium-zoom-image--opened")).toHaveCount(0);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(p.locator("#back-to-top")).toBeVisible();
  }
  await compare(before, after, info, "scroll");
  for (const p of [before, after]) {
    await p.locator("#back-to-top").click();
    await expect.poll(() => p.evaluate(() => scrollY)).toBe(0);
  }
});
