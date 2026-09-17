import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const externalLinksPath = path.join(
  __dirname,
  "../../content/external-links.json",
);

export const externalLinks = JSON.parse(
  fs.readFileSync(externalLinksPath, "utf8"),
);
