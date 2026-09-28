// Conversion entre les données d'un devis et les valeurs affichées dans le formulaire dynamique

// Valeurs affichées dans les champs : texte pour tout, booléen pour les cases à cocher
export function initialValues(fields, data) {
  const values = {};
  for (const field of fields) {
    const stored = data ? data[field.key] : undefined;
    if (field.type === 'boolean') {
      values[field.key] = stored !== undefined && stored !== null ? Boolean(stored) : Boolean(field.default);
    } else if (stored !== undefined && stored !== null) {
      values[field.key] = String(stored);
    } else if (!data && field.default !== undefined && field.default !== null) {
      values[field.key] = String(field.default);
    } else {
      values[field.key] = '';
    }
  }
  return values;
}

// Le serveur accepte "5 000,5" : on envoie les textes tels que saisis
export function toPayload(fields, values) {
  const payload = {};
  for (const field of fields) payload[field.key] = values[field.key];
  return payload;
}