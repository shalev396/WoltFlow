/**
 * One-time script: reads JSON from public/locales and writes TS modules to src/i18n/locales.
 * Run from Client: node scripts/convert-locales-to-ts.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesPublic = path.join(__dirname, "..", "public", "locales");
const localesSrc = path.join(__dirname, "..", "src", "i18n", "locales");

function walk(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) {
      files.push(...walk(path.join(dir, e.name), rel));
    } else if (
      e.isFile() &&
      e.name.endsWith(".json") &&
      !e.name.includes("privacy_validated")
    ) {
      files.push(rel);
    }
  }
  return files;
}

const relPaths = walk(localesPublic);
for (const rel of relPaths) {
  const srcPath = path.join(localesPublic, rel);
  const content = fs.readFileSync(srcPath, "utf-8");
  const data = JSON.parse(content);
  const tsContent = `export default ${JSON.stringify(data, null, 2)} as const;\n`;
  const outRel = rel.replace(/\.json$/, ".ts");
  const outPath = path.join(localesSrc, outRel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, tsContent, "utf-8");
  console.log(outRel);
}
console.log("Done. Created", relPaths.length, "files in src/i18n/locales");
