import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const steps = [
  {
    name: "FuPa Match Highlights",
    script: "fupa-scraper.mjs",
  },
  {
    name: "Fussball.de Spielberichte",
    script: "fussball-spielberichte.mjs",
  },
  {
    name: "Instagram Posts",
    script: "instagram-json.mjs",
    env: {
      IG_OUTPUT_FILE: "../content/instagram-posts.json",
    },
  },
  {
    name: "Spieltermine",
    script: "spiele-als-termine.mjs",
  },
];

function runStep(step) {
  return new Promise((resolve, reject) => {
    console.log(`\n==> Starte: ${step.name}`);

    const child = spawn(process.execPath, [step.script], {
      cwd: __dirname,
      stdio: "inherit",
      env: {
        ...process.env,
        ...step.env,
      },
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        console.log(`==> Fertig: ${step.name}`);
        resolve();
        return;
      }

      reject(new Error(`${step.name} fehlgeschlagen (Exit-Code ${code ?? "?"})`));
    });
  });
}

for (const step of steps) {
  await runStep(step);
}

console.log("\nAlle Inhalte wurden aktualisiert.");
