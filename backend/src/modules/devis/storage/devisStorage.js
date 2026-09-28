const fs = require('fs');
const path = require('path');

// backend/ + DEVIS_STORAGE_DIR (relatif à backend/, ou chemin absolu)
const BACKEND_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const ROOT = path.resolve(BACKEND_ROOT, process.env.DEVIS_STORAGE_DIR || 'storage/devis');

function ensureStorage() {
  fs.mkdirSync(ROOT, { recursive: true });
  return ROOT;
}

// Enregistre le PDF d'un devis et renvoie le nom de fichier à stocker en base.
function savePdf(reference, buffer) {
  ensureStorage();
  const fileName = `${reference}.pdf`;
  fs.writeFileSync(path.join(ROOT, fileName), buffer);
  return fileName;
}

// Chemin complet d'un PDF à partir du nom stocké en base (protégé contre les "../").
function resolvePdfPath(fileName) {
  const full = path.resolve(ROOT, fileName);
  if (path.dirname(full) !== ROOT) {
    throw new Error('Chemin de PDF invalide.');
  }
  return full;
}

module.exports = { ensureStorage, savePdf, resolvePdfPath, ROOT };