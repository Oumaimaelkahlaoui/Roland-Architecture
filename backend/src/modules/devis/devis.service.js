const fs = require('fs');
const repository = require('./devis.repository');
const { listTypes: listRegisteredTypes, getType } = require('./types');
const { generateDevisPdf } = require('./pdf/generator');
const { savePdf, resolvePdfPath } = require('./storage/devisStorage');
const { buildPdfFileName } = require('./common/fileName');

function httpError(status, message, details) {
  const error = new Error(message);
  error.status = status;
  if (details) error.details = details;
  return error;
}

function requireType(typeId) {
  const type = typeId ? getType(typeId) : null;
  if (!type) throw httpError(400, 'Type de devis inconnu.');
  return type;
}

function requireData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw httpError(400, 'Les données du devis sont manquantes.');
  }
  return data;
}

// Ajoute l'intitulé professionnel du type (l'utilisateur ne voit jamais l'identifiant technique)
function withLabel(devis) {
  if (!devis) return null;
  const type = getType(devis.type);
  return { ...devis, type_label: type ? type.label : devis.type };
}

// Validation + calculs, sans PDF (récapitulatif)
function preview(typeId, input) {
  const type = requireType(typeId);
  const { ok, values, errors } = type.validate(requireData(input));
  if (!ok) throw httpError(400, 'Données du devis invalides.', errors);
  const calc = type.compute(values);
  return {
    values,
    calc,
    recap: type.buildRecap ? type.buildRecap(values, calc) : [],
    warnings: calc.warnings || [],
  };
}

// Le générateur valide, calcule puis produit le PDF ; on convertit ses échecs techniques en message lisible
async function render(type, input) {
  try {
    return await generateDevisPdf(type, requireData(input));
  } catch (err) {
    if (err.status) throw err;
    console.error('[DEVIS] Échec de génération du PDF :', err);
    throw httpError(500, `Génération du PDF impossible : ${err.message}`);
  }
}

async function previewPdf(typeId, input) {
  const type = requireType(typeId);
  const { buffer } = await render(type, input);
  return buffer;
}

async function list(filters) {
  const rows = await repository.list(filters);
  return rows.map(withLabel);
}

async function getOne(id) {
  const devis = await repository.getById(id);
  if (!devis) throw httpError(404, 'Devis introuvable.');
  const type = getType(devis.type);
  const recap = type && type.buildRecap && devis.data && devis.calc ? type.buildRecap(devis.data, devis.calc) : [];
  return { ...withLabel(devis), recap };
}

async function create(typeId, input, userId) {
  const type = requireType(typeId);
  const { buffer, values, calc } = await render(type, input);

  const devis = await repository.create({
    type: type.id,
    status: 'brouillon',
    clientName: type.clientName(values),
    projectName: type.projectName(values),
    devisDate: type.devisDate(values),
    data: values,
    calc,
    totalAmount: type.totalAmount(calc),
    createdBy: userId || null,
  });

  // Le devis reste « brouillon » tant que son PDF n'est pas enregistré sur le disque
  const pdfPath = savePdf(devis.reference, buffer);
  await repository.update(devis.id, { status: 'genere', pdfPath, pdfGeneratedAt: new Date() });
  return getOne(devis.id);
}

async function saveRegenerated(existing, type, input) {
  const { buffer, values, calc } = await render(type, input);
  const pdfPath = savePdf(existing.reference, buffer);
  await repository.update(existing.id, {
    status: 'genere',
    clientName: type.clientName(values),
    projectName: type.projectName(values),
    devisDate: type.devisDate(values),
    data: values,
    calc,
    totalAmount: type.totalAmount(calc),
    pdfPath,
    pdfGeneratedAt: new Date(),
  });
  return getOne(existing.id);
}

// Modification : on garde la même référence, on remplace les données et le PDF
async function update(id, input) {
  const existing = await repository.getById(id);
  if (!existing) throw httpError(404, 'Devis introuvable.');
  return saveRegenerated(existing, requireType(existing.type), input);
}

// Régénération : mêmes données enregistrées, PDF refait (ex. après dépôt des vraies polices)
async function regenerate(id) {
  const existing = await repository.getById(id);
  if (!existing) throw httpError(404, 'Devis introuvable.');
  return saveRegenerated(existing, requireType(existing.type), existing.data);
}

async function getPdfFile(id) {
  const devis = await repository.getById(id);
  if (!devis) throw httpError(404, 'Devis introuvable.');
  if (!devis.pdf_path) throw httpError(404, 'Le PDF de ce devis n’a pas encore été généré.');
  const file = resolvePdfPath(devis.pdf_path);
  if (!fs.existsSync(file)) {
    throw httpError(404, 'Le fichier PDF est introuvable sur le serveur. Utilisez « Régénérer le PDF ».');
  }
  return { file, fileName: buildPdfFileName(devis) };
}

function describeType(typeId) {
  const type = typeId ? getType(typeId) : null;
  if (!type) throw httpError(404, 'Type de devis introuvable.');
  return type.describe();
}

module.exports = {
  listTypes: listRegisteredTypes,
  describeType,
  preview,
  previewPdf,
  list,
  getOne,
  create,
  update,
  regenerate,
  getPdfFile,
};