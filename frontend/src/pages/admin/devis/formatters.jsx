// Formats d'affichage (français)

export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '—';
  return `${Number(value).toLocaleString('fr-FR')} MAD`;
}

// "2026-08-15" -> "15/08/2026"
export function formatDate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '—';
}

// Valeur d'un champ du formulaire, telle qu'affichée dans un récapitulatif
export function formatFieldValue(field, value) {
  if (field.type === 'boolean') return value ? 'Oui' : 'Non';
  if (value === null || value === undefined || value === '') return '—';
  if (field.type === 'date') return formatDate(value);
  if (field.type === 'number' || field.type === 'integer') {
    const text = Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    return field.unit ? `${text} ${field.unit}` : text;
  }
  return String(value);
}

// Nom du fichier PDF : DEVIS_<PROJET>_<CLIENT>.pdf (majuscules, sans accents ni caractères spéciaux)
function cleanForFileName(text, maxLength = 60) {
  return String(text || '')
    .replace(/œ/gi, 'oe')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
    .slice(0, maxLength)
    .replace(/_+$/g, '');
}

export function devisFileName(devis) {
  const parts = ['DEVIS', cleanForFileName(devis.project_name), cleanForFileName(devis.client_name)].filter(Boolean);
  // Ni projet ni client : on retombe sur la référence
  if (parts.length === 1) parts.push(cleanForFileName(devis.reference));
  return `${parts.join('_')}.pdf`;
}