import { chromium } from "playwright";
import fs from "node:fs/promises";

const CONFIG = {
  clubMatchesUrl: "https://www.fupa.net/club/fsg-ottweiler-steinbach/matches",

  // Für die 2. Mannschaft:
  // In FuPa-Match-URLs steht die zweite Mannschaft mit "...fsg-ottweiler-steinbach-m2..."
  teamUrlPart: "fsg-ottweiler-steinbach-m2",

  timezone: "Europe/Berlin",

  outputFile: "../content/match-highlights.json",

  logos: {
    "FSG Ottweiler-Steinbach 2": "/team-logos/fsg-ottweiler-steinbach.png",
    "FSG Ottweiler-Steinbach II": "/team-logos/fsg-ottweiler-steinbach.png",
    "FSG Ottweiler-Steinbach": "/team-logos/fsg-ottweiler-steinbach.png",

    // Weitere Logos kannst du hier fest eintragen:
    // "SC Alsweiler": "/team-logos/sc-alsweiler.png",
    // "VfB Heusweiler II": "/team-logos/vfb-heusweiler.png"
  },
};

function slugifyTeam(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/ii/g, "2")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function logoFor(teamName) {
  return CONFIG.logos[teamName] ?? `/team-logos/${slugifyTeam(teamName)}.png`;
}

function normalizeResult(result) {
  if (!result) return "-:-";
  return result.replace(/\s+/g, "");
}

function toISODateGerman(dateStr) {
  // 03.05.2026 -> 2026-05-03
  const [dd, mm, yyyy] = dateStr.split(".");
  return `${yyyy}-${mm}-${dd}`;
}

function dateFromMatchUrl(matchUrl) {
  // Beispiel:
  // sc-alsweiler-m1-fsg-ottweiler-steinbach-m2-260503
  // 260503 -> 2026-05-03

  const match = matchUrl.match(/-(\d{6})(?:\/|$)/);

  if (!match) return "";

  const raw = match[1];
  const year = `20${raw.slice(0, 2)}`;
  const month = raw.slice(2, 4);
  const day = raw.slice(4, 6);

  return `${year}-${month}-${day}`;
}

function getBerlinTodayDateOnly() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CONFIG.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [year, month, day] = formatter
    .format(new Date())
    .split("-")
    .map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

function dateOnlyFromISO(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function getWeekRanges() {
  const today = getBerlinTodayDateOnly();

  // JS: Sonntag = 0, Montag = 1, Dienstag = 2, ...
  const day = today.getUTCDay();

  // Woche beginnt Montag
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  const currentWeekStart = addDays(today, -daysSinceMonday);
  const previousWeekStart = addDays(currentWeekStart, -7);
  const nextWeekStart = addDays(currentWeekStart, 7);
  const weekAfterNextStart = addDays(currentWeekStart, 14);

  return {
    previousWeekStart,
    currentWeekStart,
    nextWeekStart,
    weekAfterNextStart,
  };
}

function isInRange(date, start, end) {
  return date >= start && date < end;
}

function matchDateTime(match) {
  return new Date(`${match.datum}T${match.uhrzeit || "00:00"}:00`);
}

function pickGamesByWeek(matches) {
  const {
    previousWeekStart,
    currentWeekStart,
    nextWeekStart,
    weekAfterNextStart,
  } = getWeekRanges();

  const sorted = matches
    .filter((match) => match.datum)
    .sort((a, b) => matchDateTime(a) - matchDateTime(b));

  const previousWeekMatches = sorted.filter((match) =>
    isInRange(
      dateOnlyFromISO(match.datum),
      previousWeekStart,
      currentWeekStart,
    ),
  );

  const currentWeekMatches = sorted.filter((match) =>
    isInRange(dateOnlyFromISO(match.datum), currentWeekStart, nextWeekStart),
  );

  const nextWeekMatches = sorted.filter((match) =>
    isInRange(dateOnlyFromISO(match.datum), nextWeekStart, weekAfterNextStart),
  );

  const now = new Date();

  const futureCurrentWeekMatch = currentWeekMatches.find(
    (match) => matchDateTime(match) >= now,
  );

  return {
    // Letztes Spiel aus der Vorwoche
    last: previousWeekMatches.at(-1) ?? null,

    // Aktueller Spieltag:
    // Vor Spielbeginn: Spiel dieser Woche mit -:-
    // Nach Spielende / Ergebnis: Spiel dieser Woche mit Ergebnis
    live: futureCurrentWeekMatch ?? currentWeekMatches.at(-1) ?? null,

    // Erstes Spiel der nächsten Woche
    next: nextWeekMatches[0] ?? null,
  };
}

async function collectMatchLinks(page, url) {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(1500);

  const links = await page.$$eval(
    'a[href*="/match/"]',
    (anchors, teamUrlPart) => {
      const unique = new Map();

      for (const anchor of anchors) {
        const hrefValue = anchor.getAttribute("href");
        if (!hrefValue) continue;

        const href = new URL(hrefValue, location.href).href;

        if (!href.includes(teamUrlPart)) continue;

        unique.set(href, {
          href,
          text: anchor.innerText.replace(/\s+/g, " ").trim(),
        });
      }

      return [...unique.values()];
    },
    CONFIG.teamUrlPart,
  );

  return links;
}

function extractResultFromLines(lines, home, away) {
  for (let i = 0; i < lines.length - 4; i++) {
    const possibleHome = lines[i];
    const possibleHomeGoals = lines[i + 1];
    const possibleColon = lines[i + 2];
    const possibleAwayGoals = lines[i + 3];
    const possibleAway = lines[i + 4];

    if (
      possibleHome === home &&
      /^\d+$/.test(possibleHomeGoals) &&
      possibleColon === ":" &&
      /^\d+$/.test(possibleAwayGoals) &&
      possibleAway === away
    ) {
      return `${possibleHomeGoals}:${possibleAwayGoals}`;
    }
  }

  return "-:-";
}

async function readMatch(page, matchUrl) {
  const infoUrl = matchUrl.endsWith("/info") ? matchUrl : `${matchUrl}/info`;

  await page.goto(infoUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(1000);

  const title = await page
    .locator("h1")
    .first()
    .innerText()
    .catch(() => "");
  const bodyText = await page.locator("body").innerText();

  const titleMatch = title.match(/^(.+?)\s+-\s+(.+)$/);

  if (!titleMatch) {
    throw new Error(`Teams konnten nicht gelesen werden: ${infoUrl}`);
  }

  const home = titleMatch[1].trim();
  const away = titleMatch[2].trim();

  const kickoffTimeMatch = bodyText.match(/Anstoß um\s+(\d{1,2}:\d{2})\s+Uhr/);

  // Wichtig:
  // Datum zuerst aus der URL lesen, weil FuPa manchmal "Heute" oder "Morgen"
  // statt eines vollständigen Datums anzeigt.
  let datum = dateFromMatchUrl(matchUrl);

  // Fallback: vollständiges Datum aus Text lesen
  const absoluteDateMatch = bodyText.match(/(\d{2}\.\d{2}\.\d{4})/);
  if (!datum && absoluteDateMatch) {
    datum = toISODateGerman(absoluteDateMatch[1]);
  }

  const stadiumMatch = bodyText.match(
    /Stadion\s+(.+?)(?:\n|Auf Karte anzeigen)/,
  );

  const lines = bodyText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const result = extractResultFromLines(lines, home, away);

  return {
    heimmannschaft: home,
    gastmannschaft: away,
    ergebnis: normalizeResult(result),
    bild_heim: logoFor(home),
    bild_gast: logoFor(away),
    ort: stadiumMatch ? stadiumMatch[1].trim() : "",
    datum,
    uhrzeit: kickoffTimeMatch ? kickoffTimeMatch[1] : "",
    url: matchUrl,
  };
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 FSG-Ottweiler-Steinbach-WebsiteBot/1.0; contact=webmaster@example.com",
  });

  const urlsToScan = [
    CONFIG.clubMatchesUrl,
    `${CONFIG.clubMatchesUrl}?pointer=prev`,
    `${CONFIG.clubMatchesUrl}?pointer=next`,
  ];

  const allLinks = [];

  for (const url of urlsToScan) {
    try {
      const links = await collectMatchLinks(page, url);
      allLinks.push(...links);
    } catch (error) {
      console.warn(`Konnte Seite nicht lesen: ${url}`);
      console.warn(error.message);
    }
  }

  const uniqueLinks = [
    ...new Map(allLinks.map((item) => [item.href, item])).values(),
  ];

  if (uniqueLinks.length === 0) {
    console.warn("Keine Match-Links gefunden.");
    console.warn("Prüfe CONFIG.teamUrlPart:", CONFIG.teamUrlPart);
  }

  const matches = [];

  for (const link of uniqueLinks) {
    try {
      const match = await readMatch(page, link.href);
      matches.push(match);

      await page.waitForTimeout(800);
    } catch (error) {
      console.warn(`Spiel übersprungen: ${link.href}`);
      console.warn(error.message);
    }
  }

  await browser.close();

  console.log("\nGefundene Spiele:");
  console.table(
    matches.map((match) => ({
      datum: match.datum,
      uhrzeit: match.uhrzeit,
      heim: match.heimmannschaft,
      gast: match.gastmannschaft,
      ergebnis: match.ergebnis,
    })),
  );

  const output = pickGamesByWeek(matches);

  for (const key of ["last", "live", "next"]) {
    if (output[key]) {
      delete output[key].url;
    }
  }

  await fs.writeFile(
    CONFIG.outputFile,
    JSON.stringify(output, null, 2),
    "utf8",
  );

  console.log(`\nJSON gespeichert in ${CONFIG.outputFile}:\n`);
  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
