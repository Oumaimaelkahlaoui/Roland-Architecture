const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updateAdminCredentials() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });

    const newEmail = 'Admin@RolandArchitecte.com';
    const newPassword = 'Roland123@@';

    // Générer le nouveau hash bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Vérifier si un admin existe déjà (par exemple l'ancien admin@roland.ma)
    const [existing] = await connection.query('SELECT * FROM users WHERE role = ?', ['admin']);

    if (existing.length > 0) {
      // Mettre à jour l'admin existant avec le nouvel email et le nouveau mot de passe
      await connection.query(
        'UPDATE users SET email = ?, password_hash = ? WHERE role = ?',
        [newEmail, hashedPassword, 'admin']
      );
      console.log('----------------------------------------');
      console.log('[SUCCÈS] Identifiants admin mis à jour !');
      console.log(`Nouvel Email    : ${newEmail}`);
      console.log(`Nouveau Password: ${newPassword}`);
      console.log('----------------------------------------');
    } else {
      // S'il n'y a aucun admin, on le crée
      await connection.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Administrateur', newEmail, hashedPassword, 'admin']
      );
      console.log('----------------------------------------');
      console.log('[SUCCÈS] Compte administrateur créé !');
      console.log(`Email    : ${newEmail}`);
      console.log(`Password : ${newPassword}`);
      console.log('----------------------------------------');
    }

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('[ERREUR] Échec de la mise à jour :', error);
    process.exit(1);
  }
}

updateAdminCredentials();