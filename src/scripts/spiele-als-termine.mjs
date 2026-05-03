import { chromium } from "playwright";
import fs from "node:fs/promises";

const CLUB_URL = "https://www.fupa.net/club/fsg-ottweiler-steinbach/matches";
const TEAM_NAME = "FSG Ottweiler-Steinbach II";
const TEAM_SLUG = "fsg-ottweiler-steinbach-m2";

const HOME_LOCATION = "Sportplatz Ottweiler";
const OUTPUT_FILE = process.argv[2] ?? "../content/spiel-termine.json";
const MAX_GAMES = 3;

function dateFromFuPaMatchUrl(url) {
  // Beispiel: .../vfb-heusweiler-m2-fsg-ottweiler-steinbach-m2-260510
  const match = url.match(/-(\d{6})(?:[/?#]|$)/);
  if (!match) return null;

  const raw = match[1]; // YYMMDD
  const year = 2000 + Number(raw.slice(0, 2));
  const month = Number(raw.slice(2, 4));
  const day = Number(raw.slice(4, 6));

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayInBerlinDateOnly() {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date()); // YYYY-MM-DD
}

function normalizeTeamName(name) {
  return name
    .replace(/\s+/g, " ")
    .replace("Ottweiler-Steinbach", "Ottweiler-Steinbach")
    .trim()
    .toLowerCase();
}

function extractVenue(bodyText) {
  const lines = bodyText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const stadiumIndex = lines.findIndex((line) => /^stadion$/i.test(line));

  if (stadiumIndex === -1) {
    return "";
  }

  const venueParts = [];

  for (let i = stadiumIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];

    if (
      /^auf karte anzeigen$/i.test(line) ||
      /^schiedsrichter/i.test(line) ||
      /^zuschauer/i.test(line) ||
      /^wettbewerb/i.test(line) ||
      /^spieltag/i.test(line) ||
      /^uhr$/i.test(line) ||
      /^anstoß/i.test(line)
    ) {
      break;
    }

    venueParts.push(line);

    if (venueParts.length >= 2) {
      break;
    }
  }

  return venueParts.join(", ");
}

function buildGoogleMapsSearchUrl(query) {
  if (!query) {
    return "";
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

async function extractMapsUrl(page) {
  return page.$$eval('a[href]', (anchors) => {
    const match = anchors.find((anchor) => {
      const text = anchor.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const href = anchor.getAttribute("href") ?? "";

      return (
        /auf karte anzeigen/i.test(text) ||
        /google\.[^/]+\/maps/i.test(href) ||
        /\/maps\//i.test(href)
      );
    });

    if (!match) {
      return "";
    }

    return new URL(match.getAttribute("href"), window.location.origin).href;
  });
}

function createTermin(match, id) {
  const isHome =
    normalizeTeamName(match.homeTeam) === normalizeTeamName(TEAM_NAME);
  const opponent = isHome ? match.awayTeam : match.homeTeam;
  const location = match.venue || (isHome ? HOME_LOCATION : `Auswärts bei ${opponent}`);

  return {
    id,
    title: `${isHome ? "Heimspiel" : "Auswärtsspiel"} gegen ${opponent}`,
    excerpt: `${isHome ? "Heimspiel" : "Auswärtsspiel"} der FSG Ottweiler-Steinbach II. Kommt vorbei und unterstützt das Team.`,
    date: match.date,
    time: match.time,
    location,
    content: isHome
      ? `Anpfiff ist um ${match.time} Uhr. Kommt vorbei und unterstützt die FSG Ottweiler-Steinbach II am ${location}.`
      : `Anpfiff ist um ${match.time} Uhr. Die FSG Ottweiler-Steinbach II spielt auswärts bei ${opponent} in ${location}.`,
    image: "termineImage",
    imageAlt: "Symbol fuer Termin",
    externalUrl: match.matchUrl,
    mapsUrl: match.mapsUrl,
  };
}

async function acceptCookiesIfVisible(page) {
  const possibleButtons = [
    "Alle akzeptieren",
    "Akzeptieren",
    "Einverstanden",
    "Zustimmen",
  ];

  for (const text of possibleButtons) {
    const button = page.getByRole("button", { name: text }).first();
    if (await button.isVisible().catch(() => false)) {
      await button.click().catch(() => {});
      return;
    }
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  await page.goto(CLUB_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  await acceptCookiesIfVisible(page);
  await page.waitForLoadState("networkidle").catch(() => {});

  const rawLinks = await page.$$eval(
    'a[href*="/match/"]',
    (anchors, teamSlug) => {
      return anchors
        .map((a) => ({
          href: new URL(a.getAttribute("href"), window.location.origin).href,
          text: a.innerText.replace(/\s+/g, " ").trim(),
        }))
        .filter((link) => {
          return (
            link.href.includes(teamSlug) && /\b\d{1,2}:\d{2}\b/.test(link.text)
          );
        });
    },
    TEAM_SLUG,
  );

  const uniqueLinks = Array.from(
    new Map(rawLinks.map((link) => [link.href, link])).values(),
  );

  const today = todayInBerlinDateOnly();

  const candidates = uniqueLinks
    .map((link) => {
      const date = dateFromFuPaMatchUrl(link.href);
      const time = link.text.match(/\b\d{1,2}:\d{2}\b/)?.[0] ?? null;

      return {
        ...link,
        date,
        time,
      };
    })
    .filter((match) => match.date && match.time && match.date >= today)
    .sort((a, b) => {
      return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
    });

  const detailPage = await context.newPage();
  const matches = [];

  for (const candidate of candidates) {
    if (matches.length >= MAX_GAMES) break;

    await detailPage.goto(candidate.href, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await detailPage.waitForLoadState("networkidle").catch(() => {});

    const headline = await detailPage
      .locator("h1")
      .first()
      .innerText()
      .catch(() => "");

    // Beispiel: "Heusweiler II - FSG Ottweiler-Steinbach II"
    const parts = headline.split(/\s+-\s+/).map((part) => part.trim());

    if (parts.length !== 2) {
      console.warn(`Konnte Heim/Auswärts nicht lesen: ${candidate.href}`);
      continue;
    }

    const [homeTeam, awayTeam] = parts;
    const bodyText = await detailPage.locator("body").innerText().catch(() => "");
    const venue = extractVenue(bodyText);
    const scrapedMapsUrl = await extractMapsUrl(detailPage).catch(() => "");

    if (
      normalizeTeamName(homeTeam) !== normalizeTeamName(TEAM_NAME) &&
      normalizeTeamName(awayTeam) !== normalizeTeamName(TEAM_NAME)
    ) {
      continue;
    }

    matches.push({
      date: candidate.date,
      time: candidate.time,
      homeTeam,
      awayTeam,
      venue,
      matchUrl: candidate.href,
      mapsUrl: scrapedMapsUrl || buildGoogleMapsSearchUrl(venue),
    });
  }

  await browser.close();

  const termine = matches.map((match, index) => createTermin(match, index + 1));

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(termine, null, 2) + "\n",
    "utf8",
  );

  console.log(`Gespeichert: ${OUTPUT_FILE}`);
  console.log(JSON.stringify(termine, null, 2));
}

main().catch((error) => {
  console.error("Fehler beim Scrapen:", error);
  process.exit(1);
});
