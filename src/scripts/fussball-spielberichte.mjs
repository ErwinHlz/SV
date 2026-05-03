import fs from "node:fs/promises";

const CONFIG = {
  sourceUrl:
    "https://www.fussball.de/ugc.news/-/object-ref/01VUVFGMV0000000VS548984VU8N0U3U#!/",

  team: "FSG Ottweiler/Steinbach 2",

  outputFile: "../content/spielberichte.json",

  // true = nur Spielberichte, keine Vorberichte
  onlySpielberichte: true,

  // Anzahl der neuesten Berichte, die in die JSON sollen
  // null = alle sichtbaren Berichte von der Seite
  limit: null,

  // Für Website oft besser false wegen Nutzungsrechten.
  // true = kompletter Text wird gespeichert
  includeFullText: true,
};

function absoluteUrl(url, baseUrl) {
  return new URL(url, baseUrl).href;
}

function normalizeText(text) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/\u200b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#034;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(html) {
  return decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/h1>/gi, "\n")
      .replace(/<\/h2>/gi, "\n")
      .replace(/<\/h3>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  );
}

function htmlToLines(html) {
  return stripTags(html)
    .split("\n")
    .map((line) => normalizeText(line))
    .filter(Boolean);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 FSG-Ottweiler-Steinbach-WebsiteBot/1.0",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "de-DE,de;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} bei ${url}`);
  }

  return await response.text();
}

function toISODateGerman(date) {
  // 27.04.2026 -> 2026-04-27
  const [dd, mm, yyyy] = date.split(".");
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm}-${dd}`;
}

function makeIdFromUrl(url) {
  const match = url.match(/article-uuid\/([^/?#]+)/);
  return match ? match[1] : url;
}

function makeExcerpt(text, maxLength = 220) {
  const clean = normalizeText(text);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trim()}...`;
}

function extractNewsLinksFromOverview(html) {
  const links = [];
  const seen = new Set();

  const anchorRegex =
    /<a\b[^>]*href=["']([^"']*\/mgc\.newsdetail\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match;

  while ((match = anchorRegex.exec(html)) !== null) {
    const href = absoluteUrl(match[1], CONFIG.sourceUrl);
    const anchorHtml = match[2];
    const text = normalizeText(stripTags(anchorHtml));

    if (!text) continue;
    if (seen.has(href)) continue;

    const parsed = parseOverviewText(text);

    if (CONFIG.onlySpielberichte && parsed.typ !== "Spielbericht") {
      continue;
    }

    seen.add(href);

    links.push({
      id: makeIdFromUrl(href),
      url: href,
      raw: text,
      ...parsed,
    });
  }

  return links;
}

function parseOverviewText(text) {
  const clean = normalizeText(text);

  const typeMatch = clean.match(/\b(Spielbericht|Vorbericht)\b/);
  const dateMatch = clean.match(/(\d{2}\.\d{2}\.\d{4})\s*\|\s*(\d{1,2}:\d{2})/);

  const typ = typeMatch ? typeMatch[1] : "";
  const datum_de = dateMatch ? dateMatch[1] : "";
  const datum = datum_de ? toISODateGerman(datum_de) : "";
  const uhrzeit = dateMatch ? dateMatch[2] : "";

  let rest = clean;

  if (dateMatch) {
    rest = clean.slice(dateMatch.index + dateMatch[0].length).trim();
  }

  rest = rest.replace(/\s*Mehr lesen\s*$/i, "").trim();

  const competitionMatch = rest.match(
    /(Bezirksliga|Kreisliga|Landesliga|Verbandsliga|Oberliga|Regionalliga|A-Klasse|B-Klasse|C-Klasse|Freundschaftsspiel|Pokal)/i,
  );

  let titel = rest;
  let spielinfo = "";

  if (competitionMatch) {
    titel = rest.slice(0, competitionMatch.index).trim();
    spielinfo = rest.slice(competitionMatch.index).trim();
  }

  return {
    typ,
    datum,
    datum_de,
    uhrzeit,
    titel,
    spielinfo,
  };
}

function parseSpielInfo(spielinfo) {
  const result = {
    wettbewerb: "",
    heimmannschaft: "",
    gastmannschaft: "",
    ergebnis: "",
    halbzeit: "",
    ort: "",
  };

  if (!spielinfo) return result;

  const comp = spielinfo.match(/^(.+?):\s+(.+)$/);
  if (!comp) {
    result.wettbewerb = spielinfo;
    return result;
  }

  result.wettbewerb = comp[1].trim();

  const rest = comp[2].trim();

  // Beispiel:
  // FSG Ottweiler/Steinbach 2 – SG Saubach 2, 4:2 (2:1), Ottweiler
  const playedMatch = rest.match(
    /^(.+?)\s+[–-]\s+(.+?),\s+([0-9]+:[0-9]+)\s+\(([0-9]+:[0-9]+)\),\s*(.+)$/,
  );

  if (playedMatch) {
    result.heimmannschaft = playedMatch[1].trim();
    result.gastmannschaft = playedMatch[2].trim();
    result.ergebnis = playedMatch[3].trim();
    result.halbzeit = playedMatch[4].trim();
    result.ort = playedMatch[5].trim();
    return result;
  }

  // Fallback für Vorberichte:
  // SC Alsweiler – FSG Ottweiler/Steinbach 2 (Sonntag, 15:00 Uhr)
  const previewMatch = rest.match(/^(.+?)\s+[–-]\s+(.+?)\s+\((.+)\)$/);

  if (previewMatch) {
    result.heimmannschaft = previewMatch[1].trim();
    result.gastmannschaft = previewMatch[2].trim();
  }

  return result;
}

function extractTitleFromArticle(lines, fallbackTitle) {
  const index = lines.findIndex(
    (line) => line.includes("Spielbericht |") || line.includes("Vorbericht |"),
  );

  if (index !== -1 && lines[index + 1]) {
    return lines[index + 1];
  }

  return fallbackTitle;
}

function extractArticleText(lines) {
  const startIndex = lines.findIndex((line) =>
    /^(Bezirksliga|Kreisliga|Landesliga|Verbandsliga|Oberliga|Regionalliga|A-Klasse|B-Klasse|C-Klasse|Freundschaftsspiel|Pokal).+?:/.test(
      line,
    ),
  );

  if (startIndex === -1) return "";

  let endIndex = lines.findIndex(
    (line, index) => index > startIndex && line.startsWith("Autor/-in:"),
  );

  if (endIndex === -1) {
    endIndex = lines.findIndex(
      (line, index) =>
        index > startIndex &&
        (line === "Melden" ||
          line.includes("Teile diese Seite") ||
          line.includes("Impressum")),
    );
  }

  if (endIndex === -1) {
    endIndex = lines.length;
  }

  return lines.slice(startIndex, endIndex).join("\n\n").trim();
}

function extractAutor(lines) {
  const autorLine = lines.find((line) => line.startsWith("Autor/-in:"));
  if (!autorLine) return "";

  return autorLine.replace(/^Autor\/-in:\s*/, "").trim();
}

function extractZumSpielUrl(html, baseUrl) {
  const match = html.match(
    /<a\b[^>]*href=["']([^"']+)["'][^>]*>\s*Zum Spiel\s*<\/a>/i,
  );

  if (!match) return "";

  return absoluteUrl(match[1], baseUrl);
}

async function readArticle(item) {
  const html = await fetchHtml(item.url);
  const lines = htmlToLines(html);

  const titel = extractTitleFromArticle(lines, item.titel);
  const text = extractArticleText(lines);
  const autor = extractAutor(lines);
  const spiel_url = extractZumSpielUrl(html, item.url);

  const spiel = parseSpielInfo(item.spielinfo || text.split("\n\n")[0] || "");

  const result = {
    id: item.id,
    team: CONFIG.team,
    typ: item.typ,
    datum: item.datum,
    datum_de: item.datum_de,
    uhrzeit: item.uhrzeit,
    titel,
    wettbewerb: spiel.wettbewerb,
    spiel: {
      heimmannschaft: spiel.heimmannschaft,
      gastmannschaft: spiel.gastmannschaft,
      ergebnis: spiel.ergebnis,
      halbzeit: spiel.halbzeit,
      ort: spiel.ort,
    },
    kurztext: makeExcerpt(text),
    url: item.url,
    spiel_url,
    autor,
  };

  if (CONFIG.includeFullText) {
    result.text = text;
  }

  return result;
}

async function main() {
  console.log("Lade Übersicht...");
  const overviewHtml = await fetchHtml(CONFIG.sourceUrl);

  let items = extractNewsLinksFromOverview(overviewHtml);

  if (CONFIG.limit !== null) {
    items = items.slice(0, CONFIG.limit);
  }

  console.log(`Gefundene sichtbare Spielberichte: ${items.length}`);

  const reports = [];

  for (const item of items) {
    try {
      console.log(`Lese: ${item.datum_de} - ${item.titel}`);
      const report = await readArticle(item);
      reports.push(report);
    } catch (error) {
      console.warn(`Konnte Bericht nicht lesen: ${item.url}`);
      console.warn(error.message);

      // Fallback: wenigstens Daten aus der Übersicht speichern
      const spiel = parseSpielInfo(item.spielinfo);

      reports.push({
        id: item.id,
        team: CONFIG.team,
        typ: item.typ,
        datum: item.datum,
        datum_de: item.datum_de,
        uhrzeit: item.uhrzeit,
        titel: item.titel,
        wettbewerb: spiel.wettbewerb,
        spiel: {
          heimmannschaft: spiel.heimmannschaft,
          gastmannschaft: spiel.gastmannschaft,
          ergebnis: spiel.ergebnis,
          halbzeit: spiel.halbzeit,
          ort: spiel.ort,
        },
        kurztext: item.spielinfo,
        url: item.url,
        spiel_url: "",
        autor: "",
      });
    }
  }

  reports.sort((a, b) => {
    const dateA = `${a.datum || "0000-00-00"}T${a.uhrzeit || "00:00"}`;
    const dateB = `${b.datum || "0000-00-00"}T${b.uhrzeit || "00:00"}`;
    return dateB.localeCompare(dateA);
  });

  const output = {
    generated_at: new Date().toISOString(),
    source: CONFIG.sourceUrl,
    team: CONFIG.team,
    count: reports.length,
    reports,
  };

  await fs.writeFile(
    CONFIG.outputFile,
    JSON.stringify(output, null, 2),
    "utf8",
  );

  console.log(`Fertig: ${CONFIG.outputFile} aktualisiert.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
