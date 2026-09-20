import { createTermin, parseCompetitionHeading } from "./lib/match-termin.mjs";
import { chromium } from "playwright";
import fs from "node:fs/promises";
import { externalLinks } from "./lib/external-links.mjs";

const TEAMS = [
  {
    clubUrl: externalLinks.fupa.matchesUrls.teamOne,
    teamSlug: externalLinks.fupa.teamOneSlug,
  },
  {
    clubUrl: externalLinks.fupa.matchesUrls.teamTwo,
    teamSlug: externalLinks.fupa.teamTwoSlug,
  },
];

const OUTPUT_FILE = process.argv[2] ?? "../content/spiel-termine.json";
const MAX_GAMES_PER_TEAM = 3;

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

function isHomeMatch(href, teamSlug) {
  // FuPa-Match-URLs sind "{heim-slug}-{gast-slug}-{datum}" - das eigene Team
  // steht also nur bei Heimspielen direkt am Anfang des Pfads. Robuster als
  // ein Abgleich der angezeigten Teamnamen, die FuPa je nach Seite abgekürzt
  // oder unterschiedlich benannt anzeigt.
  const path = new URL(href).pathname;
  return path.startsWith(`/match/${teamSlug}-`);
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

  const venue = venueParts.join(", ");

  // FuPa zeigt "-" an, wenn für das Spiel kein Stadion hinterlegt ist.
  return venue === "-" ? "" : venue;
}

function buildGoogleMapsSearchUrl(query) {
  if (!query) {
    return "";
  }

  return `${externalLinks.googleMaps.searchBaseUrl}&query=${encodeURIComponent(query)}`;
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

async function acceptCookiesIfVisible(page) {
  const possibleTexts = [
    "Alle akzeptieren",
    "Akzeptieren",
    "Einverstanden",
    "Zustimmen",
  ];

  // Der Consent-Button auf fupa.net ist kein <button role="button">, sondern
  // ein Element ohne ARIA-Rolle - deshalb per Text statt per Rolle suchen.
  for (const text of possibleTexts) {
    const button = page.getByText(text, { exact: false }).first();
    if (await button.isVisible().catch(() => false)) {
      await button.click().catch(() => {});
      return;
    }
  }
}

async function scrapeTeamMatches(context, team) {
  const page = await context.newPage();

  await page.goto(team.clubUrl, {
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
    team.teamSlug,
  );

  await page.close();

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
    if (matches.length >= MAX_GAMES_PER_TEAM) break;

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
    const competitionHeading = await detailPage
      .locator('a[href*="/league/"] h2, a[href*="/cup/"] h2')
      .first().innerText().catch(() => "");
    const { competition, matchday } = parseCompetitionHeading(competitionHeading);
    if (!competition || !matchday) {
      console.warn(`Liga oder Spieltag nicht verfügbar: ${candidate.href}`);
    }
    const bodyText = await detailPage.locator("body").innerText().catch(() => "");
    const venue = extractVenue(bodyText);
    const scrapedMapsUrl = await extractMapsUrl(detailPage).catch(() => "");

    matches.push({
      date: candidate.date,
      time: candidate.time,
      homeTeam,
      awayTeam,
      competition,
      matchday,
      isHome: isHomeMatch(candidate.href, team.teamSlug),
      venue,
      matchUrl: candidate.href,
      mapsUrl: scrapedMapsUrl || buildGoogleMapsSearchUrl(venue),
    });
  }

  await detailPage.close();

  return matches;
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

  const matchesByTeam = [];

  for (const team of TEAMS) {
    matchesByTeam.push(await scrapeTeamMatches(context, team));
  }

  await browser.close();

  const matches = matchesByTeam
    .flat()
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

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
