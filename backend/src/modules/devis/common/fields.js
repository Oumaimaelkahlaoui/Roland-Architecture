// Description et validation des champs d'un formulaire de devis.
// Un type de devis déclare ses champs ; le même schéma sert au formulaire (étape 5)
// et à la validation côté serveur.

const TYPES = ["text", "number", "integer", "date", "boolean"];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function resolveDefault(field) {
  return typeof field.default === "function" ? field.default() : field.default;
}

// Version sérialisable (pour l'API / le formulaire)
function describeFields(fields) {
  return fields.map((f) => ({ ...f, default: resolveDefault(f) }));
}

// Accepte "5 000,5" comme 5000.5
function parseNumber(raw) {
  if (typeof raw === "number") return raw;
  const cleaned = String(raw).replace(/[\s\u00a0\u202f]/g, "").replace(",", ".");
  return cleaned === "" ? NaN : Number(cleaned);
}

function validateFields(fields, input = {}) {
  const values = {};
  const errors = [];

  for (const field of fields) {
    if (!TYPES.includes(field.type)) throw new Error(`Type de champ inconnu : ${field.type}`);
    let raw = input[field.key];
    const empty = raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "");

    if (empty && field.type !== "boolean") {
      const def = resolveDefault(field);
      if (def !== undefined) raw = def;
    }
    const stillEmpty = raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "");

    if (field.type === "boolean") {
      values[field.key] = raw === true || raw === "true" || raw === 1 || raw === "1";
      continue;
    }
    if (stillEmpty) {
      if (field.required) errors.push({ key: field.key, message: `${field.label} est obligatoire.` });
      values[field.key] = null;
      continue;
    }

    if (field.type === "text") {
      const text = String(raw).trim();
      if (field.maxLength && text.length > field.maxLength) {
        errors.push({ key: field.key, message: `${field.label} : ${field.maxLength} caractères maximum.` });
      }
      values[field.key] = text;
    } else if (field.type === "number" || field.type === "integer") {
      const n = parseNumber(raw);
      if (!Number.isFinite(n)) {
        errors.push({ key: field.key, message: `${field.label} doit être un nombre.` });
        values[field.key] = null;
        continue;
      }
      if (field.type === "integer" && !Number.isInteger(n)) {
        errors.push({ key: field.key, message: `${field.label} doit être un nombre entier.` });
      }
      if (field.exclusiveMin !== undefined && n <= field.exclusiveMin) {
        errors.push({ key: field.key, message: `${field.label} doit être supérieur à ${field.exclusiveMin}.` });
      }
      if (field.min !== undefined && n < field.min) {
        errors.push({ key: field.key, message: `${field.label} doit être supérieur ou égal à ${field.min}.` });
      }
      if (field.max !== undefined && n > field.max) {
        errors.push({ key: field.key, message: `${field.label} doit être inférieur ou égal à ${field.max}.` });
      }
      values[field.key] = n;
    } else if (field.type === "date") {
      const text = String(raw).slice(0, 10);
      const valid = /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(Date.parse(text));
      if (!valid) errors.push({ key: field.key, message: `${field.label} : date invalide (AAAA-MM-JJ).` });
      values[field.key] = text;
    }
  }

  return { ok: errors.length === 0, values, errors };
}

module.exports = { describeFields, validateFields, todayIso };