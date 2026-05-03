import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const LEAGUE_STANDING_URL =
  "https://www.fupa.net/league/bezirksliga-ill/standing";

const OUTPUT_DIR = "../assets/vereinslogos";
const OUTPUT_JSON = "../content/vereinslogos.json";

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function cleanTeamName(text) {
  return text
    .replace(/^\d+\s*\.\s*/, "")
    .replace(/\s+\d+\s+\d+\s*-\s*\d+\s*-\s*\d+.*$/, "")
    .replace(/\s*\((Auf|Ab|zg\.|o\.W\.)\)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function downloadImage(url, filepath) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome Safari",
      Referer: "https://www.fupa.net/",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Download fehlgeschlagen: ${response.status} ${response.statusText} - ${url}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(filepath, buffer);
}

async function acceptCookiesIfVisible(page) {
  const buttons = [
    "Alle akzeptieren",
    "Akzeptieren",
    "Einverstanden",
    "Zustimmen",
  ];

  for (const label of buttons) {
    const button = page.getByRole("button", { name: label }).first();

    if (await button.isVisible().catch(() => false)) {
      await button.click().catch(() => {});
      return;
    }
  }
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  await ensureDir(path.dirname(OUTPUT_JSON));

  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  await page.goto(LEAGUE_STANDING_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  await acceptCookiesIfVisible(page);
  await page.waitForLoadState("networkidle").catch(() => {});

  const teams = await page.$$eval('a[href*="/team/"]', (links) => {
    return links.map((a) => ({
      name: a.innerText.replace(/\s+/g, " ").trim(),
      url: new URL(a.getAttribute("href"), window.location.origin).href,
    }));
  });

  const uniqueTeams = Array.from(
    new Map(
      teams
        .filter((team) => team.name && team.url)
        .map((team) => [
          team.url,
          {
            ...team,
            name: team.name,
          },
        ]),
    ).values(),
  );

  const results = [];
  const detailPage = await context.newPage();

  for (const team of uniqueTeams) {
    const teamName = cleanTeamName(team.name);
    const slug = slugify(teamName);

    console.log(`Scrape Logo: ${teamName}`);

    await detailPage.goto(team.url, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await detailPage.waitForLoadState("networkidle").catch(() => {});

    const logoUrl = await detailPage.evaluate(() => {
      const urls = [];

      document.querySelectorAll("img").forEach((img) => {
        if (img.currentSrc) urls.push(img.currentSrc);
        if (img.src) urls.push(img.src);
      });

      document.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (href) urls.push(new URL(href, window.location.origin).href);
      });

      return (
        urls.find((url) => url.includes("image.fupa.net/club/")) ||
        urls.find(
          (url) => url.includes("/club/") && url.includes("image.fupa.net"),
        ) ||
        null
      );
    });

    if (!logoUrl) {
      console.warn(`Kein Logo gefunden für: ${teamName}`);
      results.push({
        name: teamName,
        slug,
        logo: null,
        sourceUrl: team.url,
      });
      continue;
    }

    const extensionMatch = new URL(logoUrl).pathname.match(
      /\.(png|jpg|jpeg|webp|svg)$/i,
    );
    const extension = extensionMatch?.[1]?.toLowerCase() ?? "jpeg";

    const filename = `${slug}.${extension === "jpg" ? "jpeg" : extension}`;
    const filepath = path.join(OUTPUT_DIR, filename);

    await downloadImage(logoUrl, filepath);

    results.push({
      name: teamName,
      slug,
      logo: `/images/vereinslogos/${filename}`,
      sourceUrl: team.url,
      originalLogoUrl: logoUrl,
    });
  }

  await browser.close();

  results.sort((a, b) => a.name.localeCompare(b.name, "de"));

  await fs.writeFile(
    OUTPUT_JSON,
    JSON.stringify(results, null, 2) + "\n",
    "utf8",
  );

  console.log(`\nFertig.`);
  console.log(`Logos gespeichert in: ${OUTPUT_DIR}`);
  console.log(`JSON gespeichert in: ${OUTPUT_JSON}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
