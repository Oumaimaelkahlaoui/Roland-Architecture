const fs = require('fs');
const path = require('path');
const fitScript = require('./fitScript');
const { UPPERCASE_FONTS, buildFontFaceCss, genericFor } = require('./fonts');

const ASSETS_DIR = path.resolve(__dirname, '..', 'templates', 'assets');
const imageCache = new Map();

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Remplace {{jeton}} par sa valeur ; un jeton inconnu donne une erreur claire
function fill(template, tokens) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in tokens)) throw new Error(`Jeton de devis inconnu : ${key}`);
    return tokens[key];
  });
}

function imageDataUri(fileName) {
  if (imageCache.has(fileName)) return imageCache.get(fileName);
  const file = path.join(ASSETS_DIR, fileName);
  if (!fs.existsSync(file)) {
    throw new Error(`Image manquante : ${fileName} (à déposer dans ${ASSETS_DIR})`);
  }
  const ext = path.extname(fileName).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  const uri = `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
  imageCache.set(fileName, uri);
  return uri;
}

function textContent(font, value) {
  return UPPERCASE_FONTS.has(font) ? value.toLocaleUpperCase('fr') : value;
}

function fontAttrs(font, size, color) {
  return `font-family="${font}, ${genericFor(font)}" font-size="${size}" fill="${color}"`;
}

function renderText(item, tokens, flags) {
  if (item.if && !flags[item.if]) return '';

  const runs = item.runs || [{ font: item.font, s: item.s }];
  const filled = runs.map((run) => ({ font: run.font, s: fill(run.s, tokens) }));
  if (filled.every((run) => run.s.trim() === '')) return '';

  const attrs = [
    fontAttrs(item.font, item.size, item.color),
    `x="${item.fit === 'center' ? item.cx : item.x}"`,
    `y="${item.y}"`,
    'style="white-space:pre"',
    `data-fit="${item.fit}"`,
    `data-w="${item.w}"`,
  ];
  if (item.maxw) attrs.push(`data-maxw="${item.maxw}"`);
  if (item.fit === 'center') attrs.push('text-anchor="middle"');
  if (item.wrap) {
    attrs.push('data-wrap="1"', `data-wrap-w="${item.wrap.maxw}"`, `data-wrap-lh="${item.wrap.lh}"`);
    attrs.push(`data-maxw="${item.wrap.maxw}"`);
  }

  const inner = item.runs
    ? filled
      .map((run) => `<tspan font-family="${run.font}, ${genericFor(run.font)}">${escapeXml(textContent(run.font, run.s))}</tspan>`)
      .join('')
    : escapeXml(textContent(item.font, filled[0].s));

  return `<text ${attrs.join(' ')}>${inner}</text>`;
}

function renderItem(item, tokens, flags) {
  switch (item.t) {
    case 'img':
      return `<image x="${item.x}" y="${item.y}" width="${item.w}" height="${item.h}" `
        + `preserveAspectRatio="none" href="${imageDataUri(item.f)}"/>`;
    case 'rect':
      return `<rect x="${item.x}" y="${item.y}" width="${item.w}" height="${item.h}" fill="${item.fill}"`
        + `${item.op !== undefined ? ` fill-opacity="${item.op}"` : ''}/>`;
    case 'srect':
      return `<rect x="${item.x}" y="${item.y}" width="${item.w}" height="${item.h}" fill="none" `
        + `stroke="${item.stroke}" stroke-width="${item.sw}"/>`;
    case 'txt':
      return renderText(item, tokens, flags);
    default:
      throw new Error(`Élément de layout inconnu : ${item.t}`);
  }
}

// Une page = un SVG aux dimensions exactes du PDF source (unités = points)
function buildPageHtml(page, tokens, flags = {}) {
  const fonts = new Set();
  page.items.forEach((item) => {
    if (item.t !== 'txt') return;
    (item.runs || [item]).forEach((run) => fonts.add(run.font));
  });

  const widthIn = (page.w / 72).toFixed(5);
  const heightIn = (page.h / 72).toFixed(5);
  const body = page.items.map((item) => renderItem(item, tokens, flags)).join('\n');

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8">
<style>
@page{size:${widthIn}in ${heightIn}in;margin:0}
html,body{margin:0;padding:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
svg{display:block;overflow:hidden}
${buildFontFaceCss(fonts)}
</style></head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" width="${widthIn}in" height="${heightIn}in" viewBox="0 0 ${page.w} ${page.h}">
${body}
</svg>
<script>${fitScript}</script>
</body></html>`;
}

module.exports = { buildPageHtml };