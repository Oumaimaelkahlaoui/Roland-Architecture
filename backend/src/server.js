require('dotenv').config();

const express = require('express');
const cors = require('cors');

const pool = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middleware/authMiddleware');
const devisRoutes = require('./modules/devis/devis.route');
const { ensureStorage } = require('./modules/devis/storage/devisStorage');
const { closeBrowser } = require('./modules/devis/pdf/generator');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Santé du serveur + base de données
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'ok' });
  } catch (err) {
    console.error('[SANTÉ] Base de données indisponible :', err.message);
    res.status(500).json({ status: 'error', db: 'error' });
  }
});

// Auth
app.use('/api/auth', authRoutes);

// Route protégée de test (vérification du token)
app.get('/api/admin/verify', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token valide', user: req.user });
});

// Devis (toutes les routes exigent un JWT valide)
app.use('/api/devis', verifyToken, devisRoutes);

// 404 pour les routes /api inconnues
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable.' });
});

// Gestion centralisée des erreurs
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERREUR]', err);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
});

ensureStorage();

const server = app.listen(PORT, () => {
  console.log(`[SERVEUR] En écoute sur le port ${PORT}`);
});

// Arrêt propre : ferme le Chrome utilisé pour les PDF (sinon il peut rester actif après Ctrl+C / redémarrage nodemon)
let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[SERVEUR] Arrêt (${signal})...`);
  server.close();
  try {
    await closeBrowser();
  } catch (err) {
    console.error('[SERVEUR] Fermeture du navigateur PDF impossible :', err.message);
  }
  process.exit(0);
}
['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach((signal) => process.once(signal, () => shutdown(signal)));