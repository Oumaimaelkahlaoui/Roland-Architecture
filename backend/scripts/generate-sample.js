// Génère le PDF d'exemple d'un type de devis à partir de son sample.json
// (valeurs identiques au PDF source) : node scripts/generate-sample.js riad-kasba
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { getType } = require("../src/modules/devis/types");
const { generateDevisPdf, closeBrowser } = require("../src/modules/devis/pdf/generator");
const { getFontStatus } = require("../src/modules/devis/pdf/fonts");

async function main() {
  const id = process.argv[2] || "riad-kasba";
  const type = getType(id);
  if (!type) throw new Error(`Type de devis inconnu : ${id}`);

  const samplePath = path.join(__dirname, "..", "src", "modules", "devis", "types", id, "sample.json");
  const sample = JSON.parse(fs.readFileSync(samplePath, "utf8"));

  const { buffer, calc } = await generateDevisPdf(type, sample);

  const outDir = path.join(__dirname, "..", "storage", "samples");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${id}.pdf`);
  fs.writeFileSync(outFile, buffer);

  console.log("[SAMPLE] PDF généré :", outFile, `(${Math.round(buffer.length / 1024)} Ko)`);
  console.log("[SAMPLE] Calculs :", JSON.stringify(calc));
  console.log("[SAMPLE] Polices :", getFontStatus().map((f) => `${f.name}=${f.source}`).join(", "));
}

main()
  .catch((err) => {
    console.error("[SAMPLE] Échec :", err.message);
    process.exitCode = 1;
  })
  .finally(() => closeBrowser());