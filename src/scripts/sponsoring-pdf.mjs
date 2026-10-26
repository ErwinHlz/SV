// Erzeugt die Sponsoring-Mappe als PDF aus src/content/sponsoring.json.
// Aufruf (aus src/scripts): node sponsoring-pdf.mjs
// Benötigt ein installiertes Chrome/Chromium; Pfad notfalls per CHROME_PATH setzen.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const content = JSON.parse(readFileSync(join(root, "src/content/sponsoring.json"), "utf8"));
const outFile = join(root, "public", content.download.file);

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const chrome = chromeCandidates.find((path) => existsSync(path));
if (!chrome) {
  console.error("Kein Chrome gefunden. Bitte CHROME_PATH setzen.");
  process.exit(1);
}

const dataUri = (file, type) =>
  `data:${type};base64,${readFileSync(join(root, file)).toString("base64")}`;

const logo = dataUri("src/assets/sv_logo_farbe.svg", "image/svg+xml");
const coverPhoto = dataUri("src/assets/stadion/tribuene-blick-platz-1.jpg", "image/jpeg");
const teamPhoto = dataUri("src/assets/Kader/gesamtkader.jpg", "image/jpeg");

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const packages = content.packages.filter((pkg) => pkg.pdf !== false);
const firstPackages = packages.slice(0, 4);
const morePackages = packages.slice(4);

// Eine allein stehende letzte Karte läuft über die volle Breite, das spart Höhe.
const packageCard = (pkg, index, wide = false) => `
  <article class="card${pkg.highlight ? " card--hot" : ""}${wide ? " card--wide" : ""}">
    <div class="card__head">
      <span class="card__num">${String(index + 1).padStart(2, "0")}</span>
      ${pkg.highlight ? `<span class="badge">${escape(pkg.highlight)}</span>` : ""}
    </div>
    <h3>${escape(pkg.title)}</h3>
    <p class="card__lead">${escape(pkg.lead)}</p>
    <ul>${pkg.points.map((point) => `<li>${escape(point)}</li>`).join("")}</ul>
  </article>`;

const footer = (page) => `
  <footer class="foot">
    <span>SV Ottweiler 1919 e.V. · Sponsoring-Mappe</span>
    <span>${page}</span>
  </footer>`;

const { contact } = content;

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Sponsoring – SV Ottweiler 1919</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Barlow", Arial, sans-serif;
    color: #0b1530;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    position: relative;
    width: 210mm;
    height: 297mm;
    overflow: hidden;
    page-break-after: always;
    background: #ffffff;
    padding: 20mm 18mm 22mm;
  }
  .page:last-child { page-break-after: auto; }
  h1, h2, h3 { margin: 0; }
  .display { font-family: "Barlow Condensed", "Arial Narrow", sans-serif; text-transform: uppercase; }
  .kicker {
    font-size: 9pt; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #c9a21d;
  }
  .lead { font-size: 11.5pt; line-height: 1.6; color: #33405c; }
  .foot {
    position: absolute; left: 18mm; right: 18mm; bottom: 10mm;
    display: flex; justify-content: space-between;
    padding-top: 3mm; border-top: 0.6pt solid #d9deea;
    font-size: 8pt; color: #7a86a3;
  }

  /* Titelseite */
  .cover { padding: 0; background: #021b4d; color: #fff; }
  .cover__photo {
    position: absolute; inset: 0 0 auto 0; height: 168mm;
    background: url(${coverPhoto}) center/cover;
  }
  .cover__photo::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(2,27,77,0.15) 0%, rgba(2,27,77,0.55) 55%, #021b4d 100%);
  }
  .cover__logo {
    position: absolute; top: 16mm; left: 18mm; width: 30mm; height: 30mm;
    border-radius: 50%; background: #fff; padding: 2mm;
  }
  .cover__body { position: absolute; left: 18mm; right: 18mm; top: 142mm; }
  .cover__body .kicker { color: #f4d047; }
  .cover h1 { margin-top: 5mm; font-size: 46pt; line-height: 0.92; }
  .cover h1 span { color: #f4d047; }
  .cover__lead { margin-top: 7mm; max-width: 150mm; font-size: 13pt; line-height: 1.55; color: #d7e0f3; }
  .cover__bar { margin-top: 10mm; width: 28mm; height: 2.2mm; background: #f4d047; border-radius: 2mm; }
  .cover__contact {
    position: absolute; left: 18mm; right: 18mm; bottom: 16mm;
    display: flex; gap: 10mm; font-size: 10pt; color: #d7e0f3;
  }
  .cover__contact strong { display: block; color: #fff; font-size: 10.5pt; }

  /* Über uns */
  h2.title { margin-top: 3mm; font-size: 30pt; line-height: 0.98; color: #021b4d; }
  .intro { margin-top: 6mm; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-top: 9mm; }
  .stat {
    padding: 5mm 4mm; border-radius: 4mm; background: #021b4d; color: #fff; text-align: center;
  }
  .stat b { display: block; font-family: "Barlow Condensed", sans-serif; font-size: 22pt; line-height: 1; color: #f4d047; }
  .stat span { display: block; margin-top: 2mm; font-size: 8.5pt; line-height: 1.35; color: #d7e0f3; }
  .channels { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-top: 8mm; }
  .channel { padding: 4.5mm 5mm; border-left: 1.4mm solid #f4d047; border-radius: 2.5mm; background: #f3f5fa; }
  .channel h3 { font-size: 12pt; color: #021b4d; }
  .channel p { margin: 1.5mm 0 0; font-size: 9.5pt; line-height: 1.5; color: #33405c; }
  .benefits { margin-top: 9mm; }
  .benefits h3 { font-size: 13pt; color: #021b4d; }
  .checks { margin: 3mm 0 0; padding: 0; list-style: none; display: grid; gap: 2.4mm; }
  .checks li { position: relative; padding-left: 7mm; font-size: 10.5pt; line-height: 1.45; color: #33405c; }
  .checks li::before {
    content: ""; position: absolute; left: 0; top: 1.4mm; width: 3.4mm; height: 3.4mm;
    border-radius: 50%; background: #f4d047; box-shadow: inset 0 0 0 1mm #021b4d;
  }

  /* Bausteine */
  .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-top: 8mm; }
  .card {
    padding: 5mm 5.5mm; border: 0.6pt solid #d9deea; border-radius: 4mm; background: #fff;
  }
  .card--hot { border-color: #f4d047; box-shadow: inset 0 0 0 0.6pt #f4d047; background: #fffbea; }
  .card__head { display: flex; align-items: center; justify-content: space-between; }
  .card__num {
    display: inline-grid; place-items: center; width: 9mm; height: 9mm; border-radius: 50%;
    background: #021b4d; color: #f4d047; font-weight: 800; font-size: 9.5pt;
  }
  .badge {
    padding: 1mm 2.6mm; border-radius: 10mm; background: #f4d047; color: #021b4d;
    font-size: 7.5pt; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .card h3 { margin-top: 3mm; font-size: 15pt; color: #021b4d; }
  .card__lead { margin: 1.5mm 0 0; font-size: 9.8pt; line-height: 1.45; font-weight: 600; color: #33405c; }
  .card ul { margin: 3mm 0 0; padding-left: 4.5mm; }
  .card li { margin-top: 1.4mm; font-size: 9.2pt; line-height: 1.42; color: #4a5672; }
  .card li::marker { color: #c9a21d; }
  .card--wide { grid-column: 1 / -1; }
  .card--wide ul { columns: 2; column-gap: 8mm; }
  .card--wide li { break-inside: avoid; }

  /* Ablauf */
  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-top: 7mm; }
  .step { padding: 4.5mm; border-radius: 4mm; background: #021b4d; color: #fff; }
  .step b {
    display: inline-grid; place-items: center; width: 8mm; height: 8mm; border-radius: 50%;
    background: #f4d047; color: #021b4d; font-size: 10pt;
  }
  .step h3 { margin-top: 3mm; font-size: 11.5pt; }
  .step p { margin: 1.5mm 0 0; font-size: 8.8pt; line-height: 1.45; color: #d7e0f3; }

  /* Abschluss */
  .closing { padding: 0; background: #021b4d; color: #fff; }
  .closing__photo { height: 120mm; background: url(${teamPhoto}) center 30%/cover; }
  .closing__body { padding: 14mm 18mm 0; }
  .closing__body .kicker { color: #f4d047; }
  .closing h2 { margin-top: 4mm; font-size: 34pt; line-height: 0.95; }
  .closing__text { margin-top: 6mm; max-width: 160mm; font-size: 12pt; line-height: 1.6; color: #d7e0f3; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-top: 10mm; }
  .contact-item { padding: 5mm; border-radius: 4mm; background: rgba(255,255,255,0.07); }
  .contact-item span { display: block; font-size: 8.5pt; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #f4d047; }
  .contact-item strong { display: block; margin-top: 1.5mm; font-size: 13pt; }
  .closing .foot { border-top-color: rgba(255,255,255,0.18); color: #9fb0d0; }
</style>
</head>
<body>

<section class="page cover">
  <div class="cover__photo"></div>
  <img class="cover__logo" src="${logo}" alt="Wappen SV Ottweiler 1919">
  <div class="cover__body">
    <p class="kicker">Sponsoring-Mappe · Saison 2026/27</p>
    <h1 class="display">Partner werden<br><span>beim SV Ottweiler</span></h1>
    <p class="cover__lead">${escape(content.hero.lead)}</p>
    <div class="cover__bar"></div>
  </div>
  <div class="cover__contact">
    <div><strong>${escape(contact.person)}</strong>${escape(contact.role)}</div>
    <div><strong>E-Mail</strong>${escape(contact.email)}</div>
    <div><strong>Instagram</strong>${escape(contact.instagram)}</div>
  </div>
</section>

<section class="page">
  <p class="kicker">${escape(content.intro.kicker)}</p>
  <h2 class="title display">${escape(content.intro.title)}</h2>
  <p class="lead intro">${escape(content.intro.text)}</p>
  <div class="stats">
    ${content.reach.map((item) => `<div class="stat"><b>${escape(item.value)}</b><span>${escape(item.label)}</span></div>`).join("")}
  </div>
  <div class="channels">
    ${content.channels.map((channel) => `<div class="channel"><h3>${escape(channel.title)}</h3><p>${escape(channel.text)}</p></div>`).join("")}
  </div>
  <div class="benefits">
    <h3>Was du davon hast</h3>
    <ul class="checks">${content.benefits.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>
  </div>
  ${footer(2)}
</section>

<section class="page">
  <p class="kicker">${escape(content.packagesIntro.kicker)}</p>
  <h2 class="title display">${escape(content.packagesIntro.title)}</h2>
  <p class="lead intro">${escape(content.packagesIntro.text)}</p>
  <div class="cards">${firstPackages.map((pkg, index) => packageCard(pkg, index)).join("")}</div>
  ${footer(3)}
</section>

<section class="page">
  <p class="kicker">${escape(content.packagesIntro.kicker)}</p>
  <div class="cards" style="margin-top: 4mm">${morePackages
    .map((pkg, index) =>
      packageCard(
        pkg,
        index + firstPackages.length,
        index === morePackages.length - 1 && morePackages.length % 2 === 1,
      ),
    )
    .join("")}</div>
  <p class="kicker" style="margin-top: 9mm">${escape(content.steps.kicker)}</p>
  <h2 class="title display">${escape(content.steps.title)}</h2>
  <div class="steps">
    ${content.steps.items.map((step, index) => `<div class="step"><b>${index + 1}</b><h3>${escape(step.title)}</h3><p>${escape(step.text)}</p></div>`).join("")}
  </div>
  ${footer(4)}
</section>

<section class="page closing">
  <div class="closing__photo"></div>
  <div class="closing__body">
    <p class="kicker">${escape(contact.kicker)}</p>
    <h2 class="display">${escape(contact.title)}</h2>
    <p class="closing__text">${escape(contact.text)} Gerne stellen wir dir ein Paket zusammen, das genau zu deinem Unternehmen passt.</p>
    <div class="contact-grid">
      <div class="contact-item"><span>Ansprechpartner</span><strong>${escape(contact.person)}</strong>${escape(contact.role)}</div>
      <div class="contact-item"><span>E-Mail</span><strong>${escape(contact.email)}</strong></div>
      <div class="contact-item"><span>Telefon</span><strong>${escape(contact.phone)}</strong></div>
      <div class="contact-item"><span>Instagram</span><strong>${escape(contact.instagram)}</strong></div>
    </div>
  </div>
  ${footer(5)}
</section>

</body>
</html>`;

const tmpHtml = join(tmpdir(), `sponsoring-${Date.now()}.html`);
writeFileSync(tmpHtml, html);
mkdirSync(dirname(outFile), { recursive: true });

execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--virtual-time-budget=8000",
  `--print-to-pdf=${outFile}`,
  pathToFileURL(tmpHtml).href,
], { stdio: "ignore" });

rmSync(tmpHtml, { force: true });
console.log(`PDF erstellt: ${outFile}`);
