const service = require('./devis.service');

// Les erreurs « métier » (validation, introuvable...) portent un status ; les autres vont au gestionnaire central
const wrap = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ success: false, message: err.message, errors: err.details || [] });
    }
    return next(err);
  }
};

function sendPdf(res, disposition, fileName) {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${disposition}; filename="${fileName}"`,
    'Cache-Control': 'no-store',
  });
}

const getTypes = wrap(async (req, res) => {
  res.json({ success: true, data: service.listTypes() });
});

const getTypeSchema = wrap(async (req, res) => {
  res.json({ success: true, data: service.describeType(req.params.typeId) });
});

// Récapitulatif : validation + calculs, sans PDF
const preview = wrap(async (req, res) => {
  const { type, data } = req.body || {};
  res.json({ success: true, data: service.preview(type, data) });
});

// Aperçu : PDF complet renvoyé au navigateur, rien n'est enregistré
const previewPdf = wrap(async (req, res) => {
  const { type, data } = req.body || {};
  const buffer = await service.previewPdf(type, data);
  sendPdf(res, 'inline', 'Apercu_devis.pdf');
  res.send(buffer);
});

const getAll = wrap(async (req, res) => {
  const { type, status, q } = req.query;
  res.json({ success: true, data: await service.list({ type, status, q }) });
});

const getOne = wrap(async (req, res) => {
  res.json({ success: true, data: await service.getOne(req.params.id) });
});

const create = wrap(async (req, res) => {
  const { type, data } = req.body || {};
  const devis = await service.create(type, data, req.user && req.user.id);
  res.status(201).json({ success: true, data: devis });
});

const update = wrap(async (req, res) => {
  const { data } = req.body || {};
  res.json({ success: true, data: await service.update(req.params.id, data) });
});

const regenerate = wrap(async (req, res) => {
  res.json({ success: true, data: await service.regenerate(req.params.id) });
});

// ?download=1 : téléchargement ; sinon affichage dans le navigateur
const getPdf = wrap(async (req, res) => {
  const { file, fileName } = await service.getPdfFile(req.params.id);
  const disposition = req.query.download ? 'attachment' : 'inline';
  res.sendFile(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  });
});

module.exports = { getTypes, getTypeSchema, preview, previewPdf, getAll, getOne, create, update, regenerate, getPdf };