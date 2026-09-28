const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const { buildPageHtml } = require('./pageHtml');

let browserPromise = null;

function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        // PUPPETEER_EXECUTABLE_PATH permet d'utiliser un Chrome déjà installé
      })
      .catch((err) => {
        browserPromise = null;
        throw err;
      });
  }
  return browserPromise;
}

async function closeBrowser() {
  if (!browserPromise) return;
  const browser = await browserPromise;
  browserPromise = null;
  await browser.close();
}

// Chaque page du modèle peut avoir son propre format (A4 portrait, A3 paysage...).
// On génère donc chaque page séparément à sa taille exacte, puis on assemble.
async function renderLayoutToPdf(layout, tokens, flags = {}) {
  const browser = await getBrowser();
  const browserPage = await browser.newPage();
  const merged = await PDFDocument.create();

  try {
    for (const pageDef of layout.pages) {
      const html = buildPageHtml(pageDef, tokens, flags);
      await browserPage.setContent(html, { waitUntil: 'load' });
      await browserPage.waitForFunction(() => document.body.dataset.ready === '1', { timeout: 30000 });

      const error = await browserPage.evaluate(() => document.body.dataset.error || '');
      if (error) throw new Error(`Mise en page du devis : ${error}`);

      const pageBytes = await browserPage.pdf({
        width: `${pageDef.w / 72}in`,
        height: `${pageDef.h / 72}in`,
        printBackground: true,
        pageRanges: '1',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      const source = await PDFDocument.load(pageBytes);
      const [copied] = await merged.copyPages(source, [0]);
      // Chrome arrondit le format de page : on recadre au format exact du PDF source
      const { height: chromeHeight } = copied.getSize();
      copied.setMediaBox(0, chromeHeight - pageDef.h, pageDef.w, pageDef.h);
      copied.setCropBox(0, chromeHeight - pageDef.h, pageDef.w, pageDef.h);
      merged.addPage(copied);
    }
  } finally {
    await browserPage.close();
  }

  merged.setTitle('Devis');
  merged.setCreator('Roland Architecture + Interior Design');
  return Buffer.from(await merged.save());
}

// Validation -> calculs -> jetons -> PDF
async function generateDevisPdf(type, input) {
  const { ok, values, errors } = type.validate(input);
  if (!ok) {
    const error = new Error('Données du devis invalides.');
    error.status = 400;
    error.details = errors;
    throw error;
  }
  const calc = type.compute(values);
  const tokens = type.buildTokens(values, calc);
  const flags = type.buildFlags(values);
  const buffer = await renderLayoutToPdf(type.layout, tokens, flags);
  return { buffer, values, calc };
}

module.exports = { generateDevisPdf, renderLayoutToPdf, closeBrowser };