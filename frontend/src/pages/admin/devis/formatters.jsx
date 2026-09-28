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