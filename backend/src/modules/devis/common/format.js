// Formats français utilisés dans les devis (identiques aux PDF sources :
// espace ordinaire entre les milliers, virgule décimale, dates JJ/MM/AAAA).

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

// 1155000 -> "1 155 000" ; 311.6 -> "311,6" ; 2.6 -> "2,6"
function formatNumber(value, maxDecimals = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const fixed = Math.abs(n).toFixed(maxDecimals).replace(/\.?0+$/, "");
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${n < 0 ? "-" : ""}${grouped}${dec ? `,${dec}` : ""}`;
}

// "2026-08-15" -> "15/08/2026"
function formatDateFr(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

const UNITS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const TENS = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"];

function below100(n, final) {
  if (n < 20) return UNITS[n];
  if (n < 70) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return TENS[t];
    return u === 1 ? `${TENS[t]} et un` : `${TENS[t]}-${UNITS[u]}`;
  }
  if (n < 80) {
    const r = n - 60;
    return r === 11 ? "soixante et onze" : `soixante-${UNITS[r]}`;
  }
  if (n === 80) return final ? "quatre-vingts" : "quatre-vingt";
  return `quatre-vingt-${UNITS[n - 80]}`;
}

// 30 -> "trente" (0 à 999, en toutes lettres)
function numberToFrenchWords(n) {
  if (!Number.isInteger(n) || n < 0 || n > 999) {
    throw new RangeError("numberToFrenchWords : entier entre 0 et 999 attendu");
  }
  if (n < 100) return below100(n, true);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const hundreds = h === 1 ? "cent" : `${UNITS[h]} cent`;
  if (r === 0) return h > 1 ? `${hundreds}s` : hundreds;
  return `${hundreds} ${below100(r, true)}`;
}
// Comme formatNumber, mais impose un nombre fixe de décimales (ex. le PDF Bab Taghzout
// écrit "2,60" et "311,60", jamais "2,6" ni "311,6").
function formatFixed(value, decimals) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const fixed = Math.abs(n).toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${n < 0 ? "-" : ""}${grouped}${dec !== undefined ? `,${dec}` : ""}`;
}

module.exports = { round2, formatNumber, formatFixed, formatDateFr, numberToFrenchWords };
