import { chromium } from "playwright";
import fs from "node:fs/promises";
import { externalLinks } from "./lib/external-links.mjs";

const CONFIG = {
  // Jede Mannschaft hat auf FuPa eine eigene Spielplan-Seite, die bereits die
  // komplette Saison zeigt (keine ?pointer=prev/next-Pagination mehr nötig).
  sources: [
    {
      team: "teamOne",
      matchesUrl: externalLinks.fupa.matchesUrls.teamOne,
      teamSlug: externalLinks.fupa.clubSlug,
    },
    {
      team: "teamTwo",
      matchesUrl: externalLinks.fupa.matchesUrls.teamTwo,
      teamSlug: externalLinks.fupa.teamTwoSlug,
    },
  ],

  timezone: "Europe/Berlin",

  outputFile: "../content/match-highlights.json",

  // FuPa hat für dieses Team bei Heimspielen kein Stadion hinterlegt (zeigt
  // immer "-"). Fallback auf die bekannte Heimspielstätte.
  homeLocation: "Stadion Im Alten Weiher",

  logos: {
    "SV Ottweiler": "/images/sv_logo_farbe.svg",
    "SV Ottweiler II": "/images/sv_logo_farbe.svg",
    Ottweiler: "/images/sv_logo_farbe.svg",
    "Ottweiler II": "/images/sv_logo_farbe.svg",

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
  const nextWeekStart = addDays(currentWeekStart, 7);

  return {
    currentWeekStart,
    nextWeekStart,
  };
}

function isInRange(date, start, end) {
  return date >= start && date < end;
}

function isHomeMatch(href, teamSlug) {
  // FuPa-Match-URLs sind "{heim-slug}-{gast-slug}-{datum}" - das eigene Team
  // steht also nur bei Heimspielen direkt am Anfang des Pfads.
  const path = new URL(href).pathname;
  return path.startsWith(`/match/${teamSlug}-`);
}

function matchDateTime(match) {
  return new Date(`${match.datum}T${match.uhrzeit || "00:00"}:00`);
}

function pickGamesByWeek(matches) {
  const { currentWeekStart, nextWeekStart } = getWeekRanges();

  const sorted = matches
    .filter((match) => match.datum)
    .sort((a, b) => matchDateTime(a) - matchDateTime(b));

  const currentWeekMatches = sorted.filter((match) =>
    isInRange(dateOnlyFromISO(match.datum), currentWeekStart, nextWeekStart),
  );

  const now = new Date();

  const futureCurrentWeekMatch = currentWeekMatches.find(
    (match) => matchDateTime(match) >= now,
  );

  // Aktueller Spieltag:
  // Vor Spielbeginn: Spiel dieser Woche mit -:-
  // Nach Spielende / Ergebnis: Spiel dieser Woche mit Ergebnis
  const live = futureCurrentWeekMatch ?? currentWeekMatches.at(-1) ?? null;

  // Wichtig: "Letztes"/"Naechstes" relativ zum gewaehlten `live`-Spiel (statt
  // strikt an der Kalenderwoche) bestimmen. Sonst geht ein bereits
  // gespieltes Nachholspiel unter der Woche verloren, sobald in derselben
  // Kalenderwoche noch ein zweites (kuenftiges) Spiel ansteht: das
  // Nachholspiel faellt weder in "letzte Woche" (last) noch wird es als
  // `live` gewaehlt (das ist ja das kuenftige Spiel) - es verschwindet
  // komplett statt als "Letztes" zu erscheinen.
  const referenceTime = live ? matchDateTime(live).getTime() : now.getTime();

  const last =
    sorted
      .filter(
        (match) => match !== live && matchDateTime(match).getTime() < referenceTime,
      )
      .at(-1) ?? null;

  const next =
    sorted.find(
      (match) => match !== live && matchDateTime(match).getTime() > referenceTime,
    ) ?? null;

  return { last, live, next };
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

async function collectMatchLinks(page, url) {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await acceptCookiesIfVisible(page);
  await page.waitForTimeout(1500);

  const links = await page.$$eval('a[href*="/match/"]', (anchors) => {
    const unique = new Map();

    for (const anchor of anchors) {
      const hrefValue = anchor.getAttribute("href");
      if (!hrefValue) continue;

      const href = new URL(hrefValue, location.href).href;

      unique.set(href, {
        href,
        text: anchor.innerText.replace(/\s+/g, " ").trim(),
      });
    }

    return [...unique.values()];
  });

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
    ort: extractVenue(bodyText),
    datum,
    uhrzeit: kickoffTimeMatch ? kickoffTimeMatch[1] : "",
    match_url: matchUrl,
  };
}

async function readMatchesForSource(page, source) {
  const links = await collectMatchLinks(page, source.matchesUrl);

  if (links.length === 0) {
    console.warn(
      `Keine Match-Links gefunden für ${source.team} (${source.matchesUrl}).`,
    );
  }

  const matches = [];

  for (const link of links) {
    try {
      const match = await readMatch(page, link.href);

      if (!match.ort && isHomeMatch(link.href, source.teamSlug)) {
        match.ort = CONFIG.homeLocation;
      }

      matches.push(match);

      await page.waitForTimeout(800);
    } catch (error) {
      console.warn(`Spiel übersprungen: ${link.href}`);
      console.warn(error.message);
    }
  }

  console.log(`\nGefundene Spiele (${source.team}): ${matches.length}`);
  console.table(
    matches.map((match) => ({
      datum: match.datum,
      uhrzeit: match.uhrzeit,
      heim: match.heimmannschaft,
      gast: match.gastmannschaft,
      ergebnis: match.ergebnis,
      ort: match.ort,
    })),
  );

  return matches;
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 FSG-Ottweiler-Steinbach-WebsiteBot/1.0; contact=webmaster@example.com",
  });

  const output = {};

  for (const source of CONFIG.sources) {
    const matches = await readMatchesForSource(page, source);
    output[source.team] = pickGamesByWeek(matches);
  }

  await browser.close();

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
