// Nom de fichier des PDF, dans le style des devis d'origine :
// majuscules, sans accents, tout séparateur remplacé par "_".

const TITLES = /\b(monsieur|madame|mademoiselle|mme|mlle|mr|m|dr)\b\.?/gi;

// Règle par type de devis (identifiant = celui du type dans types/index.js)
const RULES = {
  'riad-kasba': { prefix: 'DEVIS_INTERIEUR', sep: '___', client: 'full' },
  'bab-taghzout': { prefix: 'DEVIS_MAISON_HOTES', sep: '_', client: 'lastnames' },
};
const DEFAULT_RULE = { prefix: 'DEVIS', sep: '_', client: 'lastnames' };

function slug(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// "M. Damien Duval / Mme Emilie Chatelain" -> "DUVAL_CHATELAIN"
function lastNames(clientName) {
  return String(clientName || '')
    .split(/\s*(?:\/|&|\+|,|\bet\b)\s*/i)
    .map((person) => {
      const words = person.replace(TITLES, ' ').trim().split(/\s+/).filter(Boolean);
      return slug(words[words.length - 1] || '');
    })
    .filter(Boolean)
    .join('_');
}

function buildPdfFileName(devis) {
  const rule = RULES[devis.type] || DEFAULT_RULE;
  const client = rule.client === 'full' ? slug(devis.client_name) : lastNames(devis.client_name);
  const parts = [rule.prefix, slug(devis.project_name), client].filter(Boolean);
  return `${parts.join(rule.sep)}.pdf`;
}

module.exports = { buildPdfFileName, slug };