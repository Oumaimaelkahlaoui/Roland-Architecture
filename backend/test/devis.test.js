// Tests du module devis : node --test   (ou : npm test)
// Les valeurs attendues viennent du PDF source « Riad Kasba ».
const test = require("node:test");
const assert = require("node:assert/strict");

const { formatNumber, formatDateFr, numberToFrenchWords, round2 } = require("../src/modules/devis/common/format");
const kasba = require("../src/modules/devis/types/riad-kasba");
const sample = require("../src/modules/devis/types/riad-kasba/sample.json");
const { listTypes, getType } = require("../src/modules/devis/types");

test("formats français", () => {
  assert.equal(formatNumber(1155000), "1 155 000");
  assert.equal(formatNumber(57750), "57 750");
  assert.equal(formatNumber(311.6), "311,6");
  assert.equal(formatNumber(0), "0");
  assert.equal(formatDateFr("2026-08-15"), "15/08/2026");
  assert.equal(round2(1.005), 1.01);
});

test("nombres en lettres", () => {
  const cases = { 1: "un", 21: "vingt et un", 30: "trente", 71: "soixante et onze", 80: "quatre-vingts",
    81: "quatre-vingt-un", 100: "cent", 200: "deux cents", 365: "trois cent soixante-cinq" };
  for (const [n, words] of Object.entries(cases)) assert.equal(numberToFrenchWords(Number(n)), words);
});

test("registre : le type Riad Kasba est disponible", () => {
  assert.ok(listTypes().some((t) => t.id === "riad-kasba"));
  assert.equal(getType("riad-kasba"), kasba);
  assert.equal(getType("inconnu"), null);
});

test("Kasba : les valeurs du PDF source sont acceptées", () => {
  const { ok, errors } = kasba.validate(sample);
  assert.equal(ok, true, JSON.stringify(errors));
});

test("Kasba : calculs identiques au PDF (p.5 et p.6)", () => {
  const calc = kasba.compute(kasba.validate(sample).values);
  assert.equal(calc.travaux, 1155000);               // 231 × 5 000
  assert.equal(calc.honoraires_theoriques, 57750);   // 1 155 000 × 5 %
  assert.equal(calc.forfait, 50000);                 // saisi, non déduit
  assert.deepEqual(calc.echeances, [15000, 15000, 10000, 7500, 2500]);
  assert.equal(calc.total_echeances, 50000);
  assert.deepEqual(calc.warnings, []);
  assert.equal(kasba.totalAmount(calc), 50000);
});

test("Kasba : validation des erreurs", () => {
  const vide = kasba.validate({});
  assert.equal(vide.ok, false);
  assert.ok(vide.errors.some((e) => e.key === "surface"));
  assert.ok(vide.errors.some((e) => e.key === "project_name"));

  const pct = kasba.validate({ ...sample, pct5: 10 });
  assert.equal(pct.ok, false);
  assert.match(pct.errors[0].message, /100 %/);

  const client = kasba.validate({ ...sample, show_client: true, client_name: "" });
  assert.equal(client.ok, false);

  assert.equal(kasba.validate({ ...sample, surface: -5 }).ok, false);
  assert.equal(kasba.validate({ ...sample, validite_jours: 0 }).ok, false);
});

test("Kasba : saisie à la française (« 5 000,5 »)", () => {
  const { ok, values } = kasba.validate({ ...sample, cout_m2: "5 000,5" });
  assert.equal(ok, true);
  assert.equal(values.cout_m2, 5000.5);
});

test("Kasba : valeurs par défaut reprises du PDF", () => {
  const { values } = kasba.validate({ ...sample, project_type: "", mission: "", duree: "", validite_jours: "", taux_honoraires: "" });
  assert.equal(values.project_type, "Riad");
  assert.equal(values.mission, "Conception + autorisation + DCE + suivi");
  assert.equal(values.duree, "Environ 3 mois");
  assert.equal(values.validite_jours, 30);
  assert.equal(values.taux_honoraires, 5);
});

test("Kasba : textes imprimés (jetons)", () => {
  const { values } = kasba.validate(sample);
  const tokens = kasba.buildTokens(values, kasba.compute(values));
  assert.equal(tokens.date, "15/08/2026");
  assert.equal(tokens.project_name_upper, "RIAD KASBA");
  assert.equal(tokens.surface, "231");
  assert.equal(tokens.cout_m2, "5 000");
  assert.equal(tokens.travaux, "1 155 000");
  assert.equal(tokens.honoraires_theoriques, "57 750");
  assert.equal(tokens.forfait, "50 000");
  assert.equal(tokens.validite_lettres, "trente");
  assert.equal(tokens.jours, "jours");
  assert.equal(tokens.ech4, "7 500");
  assert.equal(kasba.buildTokens({ ...values, validite_jours: 1 }, kasba.compute(values)).jours, "jour");
});

test("Kasba : ligne client affichée seulement si la case est cochée", () => {
  const { values } = kasba.validate(sample);
  assert.equal(kasba.buildFlags(values).show_client, false);
  const avec = kasba.validate({ ...sample, client_name: "M. Julien", show_client: true }).values;
  assert.equal(kasba.buildFlags(avec).show_client, true);
});

test("Kasba : chaque jeton du layout existe (pas de faute de frappe)", () => {
  const { values } = kasba.validate(sample);
  const tokens = kasba.buildTokens(values, kasba.compute(values));
  const used = new Set();
  for (const page of kasba.layout.pages) {
    for (const item of page.items) {
      const texts = item.runs ? item.runs.map((r) => r.s) : [item.s];
      texts.filter(Boolean).forEach((s) => [...s.matchAll(/\{\{(\w+)\}\}/g)].forEach((m) => used.add(m[1])));
    }
  }
  for (const key of used) assert.ok(key in tokens, `jeton inconnu dans le layout : ${key}`);
});

test("Kasba : le layout reproduit les 8 pages du PDF source (A4, 6 × A3, A4)", () => {
  const sizes = kasba.layout.pages.map((p) => `${p.w}x${p.h}`);
  assert.equal(sizes.length, 8);
  assert.equal(sizes[0], "595.28x841.89");
  assert.equal(sizes[7], "595.28x841.89");
  assert.ok(sizes.slice(1, 7).every((s) => s === "1190.55x841.89"));
});

// Test complet avec Chrome (plus lent) : DEVIS_PDF_TEST=1 npm test
test("Kasba : génération PDF de bout en bout", { skip: !process.env.DEVIS_PDF_TEST }, async () => {
  const { generateDevisPdf, closeBrowser } = require("../src/modules/devis/pdf/generator");
  try {
    const { buffer } = await generateDevisPdf(kasba, sample);
    assert.equal(buffer.subarray(0, 5).toString(), "%PDF-");
    const { PDFDocument } = require("pdf-lib");
    const pdf = await PDFDocument.load(buffer);
    assert.equal(pdf.getPageCount(), 8);
    assert.equal(Math.round(pdf.getPage(1).getWidth()), 1191);
  } finally {
    await closeBrowser();
  }
});