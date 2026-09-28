const express = require('express');
const controller = require('./devis.controller');

const router = express.Router();

// Le JWT (verifyToken) est appliqué dans server.js sur tout ce module.
router.get('/types', controller.getTypes);
router.get('/types/:typeId', controller.getTypeSchema);

router.post('/preview', controller.preview);
router.post('/preview/pdf', controller.previewPdf);

router.get('/', controller.getAll);
router.post('/', controller.create);

router.get('/:id(\\d+)', controller.getOne);
router.put('/:id(\\d+)', controller.update);
router.post('/:id(\\d+)/regenerate', controller.regenerate);
router.get('/:id(\\d+)/pdf', controller.getPdf);

module.exports = router;