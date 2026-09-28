// Tests du devis "Bab Taghzout" : node --test   (ou : npm test)
// Les valeurs attendues viennent du PDF source.
const test = require("node:test");
const assert = require("node:assert/strict");

const bab = require("../src/modules/devis/types/bab-taghzout");
const sample = require("../src/modules/devis/types/bab-taghzout/sample.json");
const { listTypes, getType } = require("../src/modules/devis/types");

test("registre : les 2 types sont disponibles", () => {
  assert.deepEqual(listTypes().map((t) => t.id).sort(), ["bab-taghzout", "riad-kasba"]);
  assert.equal(getType("bab-taghzout"), bab);
});

test("Bab : les valeurs du PDF source sont acceptées", () => {
  const { ok, errors } = bab.validate(sample);
  assert.equal(ok, true, JSON.stringify(errors));
});

test("Bab : calculs identiques au PDF (p.6 et p.7)", () => {
  const calc = bab.compute(bab.validate(sample).values);
  assert.equal(calc.surface_ref, 311.6);       // (116 × 2,60) + 10
  assert.equal(calc.travaux, 1246400);         // 311,60 × 4 000
  assert.equal(calc.honoraires, 62320);        // 1 246 400 × 5 %
  assert.equal(calc.bet_total, 15000);         // 2 000+3 000+7 000+3 000
  assert.equal(calc.bet_premiere_tranche, 12000);
  assert.equal(calc.total_general, 80320);     // 62 320+15 000+3 000
  assert.deepEqual(calc.echeances, [18696, 12464, 12464, 12464, 6232]);
  assert.deepEqual(calc.warnings, []);
  assert.equal(bab.totalAmount(calc), 80320);
});

test("Bab : validation des erreurs", () => {
  const vide = bab.validate({});
  assert.equal(vide.ok, false);
  assert.ok(vide.errors.some((e) => e.key === "surface"));

  const pct = bab.validate({ ...sample, pct5: 5 });
  assert.equal(pct.ok, false);
  assert.match(pct.errors[0].message, /100 %/);

  assert.equal(bab.validate({ ...sample, surface: 0 }).ok, false);
});

test("Bab : textes imprimés (jetons)", () => {
  const { values } = bab.validate(sample);
  const tokens = bab.buildTokens(values, bab.compute(values));
  assert.equal(tokens.date, "24/08/2026");
  assert.equal(tokens.coef_surface, "2,60");
  assert.equal(tokens.surface_ref, "311,60");
  assert.equal(tokens.travaux, "1 246 400");
  assert.equal(tokens.honoraires, "62 320");
  assert.equal(tokens.bet_total, "15 000");
  assert.equal(tokens.total_general, "80 320");
  assert.equal(tokens.ech1, "18 696");
  assert.equal(tokens.ech4, "12 464");
});

test("Bab : le client est affiché par défaut (contrairement à Kasba)", () => {
  const { values } = bab.validate(sample);
  assert.equal(bab.buildFlags(values).show_client, true);
});

test("Bab : chaque jeton du layout existe", () => {
  const { values } = bab.validate(sample);
  const tokens = bab.buildTokens(values, bab.compute(values));
  const used = new Set();
  for (const page of bab.layout.pages) {
    for (const item of page.items) {
      const texts = item.runs ? item.runs.map((r) => r.s) : [item.s];
      texts.filter(Boolean).forEach((s) => [...s.matchAll(/\{\{(\w+)\}\}/g)].forEach((m) => used.add(m[1])));
    }
  }
  for (const key of used) assert.ok(key in tokens, `jeton inconnu dans le layout : ${key}`);
});

test("Bab : le layout reproduit les 9 pages du PDF source (A4, 7 × A3, A4)", () => {
  const sizes = bab.layout.pages.map((p) => `${p.w}x${p.h}`);
  assert.equal(sizes.length, 9);
  assert.equal(sizes[0], "595.28x841.89");
  assert.equal(sizes[8], "595.28x841.89");
  assert.ok(sizes.slice(1, 8).every((s) => s === "1190.55x841.89"));
});

test("Bab : génération PDF de bout en bout", { skip: !process.env.DEVIS_PDF_TEST }, async () => {
  const { generateDevisPdf, closeBrowser } = require("../src/modules/devis/pdf/generator");
  try {
    const { buffer } = await generateDevisPdf(bab, sample);
    assert.equal(buffer.subarray(0, 5).toString(), "%PDF-");
    const { PDFDocument } = require("pdf-lib");
    const pdf = await PDFDocument.load(buffer);
    assert.equal(pdf.getPageCount(), 9);
  } finally {
    await closeBrowser();
  }
});