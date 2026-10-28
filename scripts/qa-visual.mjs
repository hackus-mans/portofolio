import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const root = "http://127.0.0.1:4173/portofolio/";
const chrome = process.env.CHROME_BIN || "/usr/bin/google-chrome";
const browser = await chromium.launch({
  headless: true,
  executablePath: chrome,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});
const failures = [];
const inspected = [];
const screenshots = "qa/screenshots";
fs.mkdirSync(screenshots, { recursive: true });

const expected = (condition, reason) => {
  if (!condition) failures.push(reason);
};
const newPage = async width => browser.newPage({
  viewport: { width, height: Math.max(780, Math.round(width * .75)) },
  deviceScaleFactor: 1
});
const visit = async (page, route, width, options = {}) => {
  const response = await page.goto(root + route, { waitUntil: "networkidle", timeout: 45000 });
  const status = response?.status();
  expected(status === 200, route + ": HTTP " + status + " (" + width + "px)");
  expected(await page.locator("#main-content").count() === 1, route + ": missing main landmark");
  expected(await page.locator(".ed-header").count() === 1, route + ": missing global header");
  expected(await page.locator(".ed-footer").count() === 1, route + ": missing footer");
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expected(dimensions.scrollWidth <= dimensions.width + 3, route + ": horizontal overflow " + JSON.stringify({ ...dimensions, viewport: width }));
  if (options.screenshot) {
    await page.screenshot({
      path: path.join(screenshots, options.screenshot), type: "jpeg", quality: 76, fullPage: true
    });
  }
  inspected.push({ route, width, status });
};

try {
  const dist = path.resolve("dist");
  const walk = directory => fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => entry.isDirectory()
      ? walk(path.join(directory, entry.name))
      : [path.join(directory, entry.name)]);
  const routes = walk(dist)
    .filter(file => file.endsWith("index.html"))
    .map(file => {
      const rel = path.relative(dist, file).split(path.sep).join("/");
      return rel === "index.html" ? "" : rel.replace(/index\.html$/, "");
    });

  // Test EVERY generated page for HTTP status, basic structure, and desktop overflow.
  const desktop = await newPage(1440);
  const exceptions = [];
  desktop.on("pageerror", error => exceptions.push(error.message));
  for (const route of routes) {
    await visit(desktop, route, 1440, { screenshot: route === "" ? "home-desktop.jpg" : undefined });
  }
  expected(exceptions.length === 0, "Desktop JavaScript errors: " + exceptions.join(" | "));
  await desktop.close();

  // Representative mobile/tablet routes, including the long image-heavy write-ups.
  const published = routes.filter(route => route.startsWith("writeups/") && route !== "writeups/");
  const targets = [...new Set([
    "", "writeups/", "ctf/", "homelab/", "projects/", "about/",
    ...published.slice(0, 5)
  ])].filter(route => routes.includes(route));

  for (const width of [320, 390, 768]) {
    const page = await newPage(width);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const route of targets) {
      await visit(page, route, width, {
        screenshot: width === 390 && (route === "" || route === "writeups/")
          ? (route === "" ? "home-mobile.jpg" : "writeups-mobile.jpg")
          : undefined
      });
    }
    if (width === 390) {
      await page.goto(root, { waitUntil: "networkidle" });
      const menu = page.locator(".ed-mobile-menu summary");
      expected(await menu.isVisible(), "Mobile menu hidden at 390px");
      if (await menu.isVisible()) {
        await menu.click();
        expected(await page.locator(".ed-mobile-panel").isVisible(), "Mobile navigation will not open");
        await page.locator('.ed-mobile-panel a[href$="/writeups/"]').click();
        expected(page.url().includes("/writeups/"), "Mobile navigation fails to open Write-ups");
      }
    }
    expected(errors.length === 0, width + "px JavaScript errors: " + errors.join(" | "));
    await page.close();
  }

  const page = await newPage(1440);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(root + "writeups/", { waitUntil: "networkidle" });
  const cards = page.locator("[data-wu-entry]");
  const count = await cards.count();
  const sourceDocs = walk(path.join("src", "content", "writeups")).filter(file => file.endsWith(".md")).length;
  expected(count === sourceDocs, "Write-up cards mismatch: " + count + " visible vs " + sourceDocs + " published Markdown files");
  expected(await page.locator(".wu-section-tab").count() === 4, "Missing fourth CTF tab in Write-ups");
  expected(await page.locator(".wu-chip[data-wu-filter='platform']").count() > 0, "Missing platform filter");

  const search = page.locator("[data-wu-search]");
  if (count) {
    await page.locator('[data-wu-section="Laboratoires"].wu-section-tab').click();
    expected(await page.locator('[data-wu-section="Laboratoires"].wu-section-tab').getAttribute("aria-pressed") === "true", "Lab filter not interactive");
    await search.fill("xyz-impossible-query-6281");
    expected(await page.locator("[data-wu-empty]").isVisible(), "No-results message not visible");
    await page.locator("[data-wu-reset]").click();
    expected(await page.locator("[data-wu-entry]:not([hidden])").count() === count, "Reset fails to restore all articles");
  }

  // Exercise the screenshot viewer using a real public write-up.
  const article = published.find(route => route.includes("responder")) || published[0];
  if (article) {
    await page.goto(root + article, { waitUntil: "networkidle" });
    const thumbnails = page.locator(".article-layout .prose img");
    const imageCount = await thumbnails.count();
    if (imageCount) {
      await thumbnails.first().click();
      const viewer = page.locator("[data-shade-image-viewer]");
      expected(await viewer.isVisible(), article + ": screenshot did not open in lightbox");
      expected(await page.locator("[data-image-expanded]").getAttribute("src") !== null, article + ": image source not set");
      if (imageCount > 1) {
        await page.locator("[data-image-next]").click();
        expected((await page.locator("[data-image-counter]").innerText()).startsWith("2 /"), article + ": next image failed");
        await page.keyboard.press("ArrowLeft");
        expected((await page.locator("[data-image-counter]").innerText()).startsWith("1 /"), article + ": keyboard back failed");
      }
      await page.keyboard.press("Escape");
      expected(!(await viewer.isVisible()), article + ": lightbox does not close on Escape");
      await page.screenshot({ path: path.join(screenshots, "writeup-desktop.jpg"), type: "jpeg", quality: 76, fullPage: true });
    }
  }
  expected(errors.length === 0, "Interactive browser errors: " + errors.join(" | "));
  await page.close();

  if (failures.length) {
    console.error("SHADE FULL BROWSER QA FAILED\n" + failures.map((error, i) => (i + 1) + ". " + error).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("SHADE FULL BROWSER QA PASSED " + JSON.stringify({
      generatedPages: routes.length, visited: inspected.length,
      mobileWidths: [320, 390, 768], writeupCards: count, screenshots
    }));
  }
} finally {
  await browser.close();
}
