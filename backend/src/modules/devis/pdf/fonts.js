const fs = require('fs');
const path = require('path');

// Dossier où déposer les VRAIES polices des PDF sources.
// Nom de fichier = nom PostScript de la police (ex. MinionPro-Regular.otf).
const FONT_DIR = path.resolve(__dirname, '..', 'templates', 'fonts');

const EXTENSIONS = [
  { ext: '.woff2', format: 'woff2' },
  { ext: '.woff', format: 'woff' },
  { ext: '.otf', format: 'opentype' },
  { ext: '.ttf', format: 'truetype' },
];

// Polices libres utilisées TANT QUE les vraies polices ne sont pas déposées.
// (Fournies par les paquets @fontsource installés avec npm install.)
const FALLBACKS = {
  'Vogue-Regular': { pkg: 'playfair-display', weight: 500, style: 'normal', generic: 'serif' },
  'MinionPro-Regular': { pkg: 'crimson-text', weight: 400, style: 'normal', generic: 'serif' },
  'MinionPro-Bold': { pkg: 'crimson-text', weight: 700, style: 'normal', generic: 'serif' },
  'MinionPro-BoldCn': { pkg: 'crimson-text', weight: 700, style: 'normal', generic: 'serif' },
  'MinionPro-BoldIt': { pkg: 'crimson-text', weight: 700, style: 'italic', generic: 'serif' },
  'AgencyFB-Reg': { pkg: 'saira-extra-condensed', weight: 400, style: 'normal', generic: 'sans-serif' },
  'CaviarDreams-Bold': { pkg: 'quicksand', weight: 700, style: 'normal', generic: 'sans-serif' },
};

// Ces polices n'ont que des capitales : le PDF source affiche tout en majuscules.
const UPPERCASE_FONTS = new Set(['Vogue-Regular']);

const cache = new Map();

function findRealFont(name) {
  for (const { ext, format } of EXTENSIONS) {
    const file = path.join(FONT_DIR, `${name}${ext}`);
    if (fs.existsSync(file)) return { file, format, source: 'reelle' };
  }
  return null;
}

function findFallback(name) {
  const fb = FALLBACKS[name];
  if (!fb) return null;
  try {
    const file = require.resolve(`@fontsource/${fb.pkg}/files/${fb.pkg}-latin-${fb.weight}-${fb.style}.woff2`);
    return { file, format: 'woff2', source: 'provisoire' };
  } catch {
    return null;
  }
}

function resolveFont(name) {
  return findRealFont(name) || findFallback(name);
}

function genericFor(name) {
  return (FALLBACKS[name] && FALLBACKS[name].generic) || 'sans-serif';
}

function mimeFor(format) {
  return { woff2: 'font/woff2', woff: 'font/woff', opentype: 'font/otf', truetype: 'font/ttf' }[format];
}

// CSS @font-face (polices encodées dans la page : aucun accès disque côté navigateur)
function buildFontFaceCss(fontNames) {
  const key = [...fontNames].sort().join('|');
  if (cache.has(key)) return cache.get(key);

  const css = [...fontNames]
    .map((name) => {
      const font = resolveFont(name);
      if (!font) return '';
      const data = fs.readFileSync(font.file).toString('base64');
      return `@font-face{font-family:"${name}";font-weight:normal;font-style:normal;`
        + `src:url(data:${mimeFor(font.format)};base64,${data}) format("${font.format}");}`;
    })
    .join('\n');

  cache.set(key, css);
  return css;
}

// État des polices (pour les logs et le contrôle avant la mise en production)
function getFontStatus(fontNames = Object.keys(FALLBACKS)) {
  return fontNames.map((name) => {
    const font = resolveFont(name);
    return { name, source: font ? font.source : 'absente' };
  });
}

module.exports = { FONT_DIR, UPPERCASE_FONTS, buildFontFaceCss, genericFor, getFontStatus };