const pool = require('../../config/database');

// devis_date est renvoyée en texte 'YYYY-MM-DD' (évite les décalages de fuseau horaire)
const COLUMNS = `id, reference, type, status, client_name, project_name,
  DATE_FORMAT(devis_date, '%Y-%m-%d') AS devis_date,
  data_json, calc_json, total_amount, pdf_path, pdf_generated_at,
  created_by, created_at, updated_at`;

function parseJson(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return value; // MySQL renvoie déjà un objet
  try {
    return JSON.parse(value);
  } catch {
    return null; // MariaDB renvoie le JSON sous forme de texte
  }
}

function hydrate(row) {
  if (!row) return null;
  const { data_json, calc_json, total_amount, ...rest } = row;
  return {
    ...rest,
    total_amount: total_amount === null ? null : Number(total_amount),
    data: parseJson(data_json),
    calc: parseJson(calc_json),
  };
}

async function list({ type, status, q, limit = 100, offset = 0 } = {}) {
  const where = [];
  const params = [];

  if (type) { where.push('type = ?'); params.push(type); }
  if (status) { where.push('status = ?'); params.push(status); }
  if (q) {
    where.push('(reference LIKE ? OR client_name LIKE ? OR project_name LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const sql = `SELECT ${COLUMNS} FROM devis
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const [rows] = await pool.query(sql, params);
  return rows.map(hydrate);
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM devis WHERE id = ?`, [id]);
  return hydrate(rows[0]);
}

// Référence interne DEV-AAAA-NNNN (aucune référence n'est imprimée dans les PDF sources)
async function nextReference() {
  const prefix = `DEV-${new Date().getFullYear()}-`;
  const [rows] = await pool.query(
    'SELECT MAX(CAST(SUBSTRING(reference, ?) AS UNSIGNED)) AS n FROM devis WHERE reference LIKE ?',
    [prefix.length + 1, `${prefix}%`]
  );
  return `${prefix}${String((rows[0].n || 0) + 1).padStart(4, '0')}`;
}

async function create({ type, status = 'brouillon', clientName = null, projectName = null,
  devisDate, data, calc = null, totalAmount = null, createdBy = null }) {
  // 3 essais : la contrainte UNIQUE protège si deux devis sont créés en même temps
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const reference = await nextReference();
    try {
      const [result] = await pool.query(
        `INSERT INTO devis (reference, type, status, client_name, project_name, devis_date,
           data_json, calc_json, total_amount, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [reference, type, status, clientName, projectName, devisDate,
          JSON.stringify(data), calc ? JSON.stringify(calc) : null, totalAmount, createdBy]
      );
      return getById(result.insertId);
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY' || attempt === 3) throw err;
    }
  }
  return null;
}

// Champs modifiables : seuls ceux fournis sont mis à jour
async function update(id, fields) {
  const map = {
    status: 'status',
    clientName: 'client_name',
    projectName: 'project_name',
    devisDate: 'devis_date',
    totalAmount: 'total_amount',
    pdfPath: 'pdf_path',
    pdfGeneratedAt: 'pdf_generated_at',
  };
  const sets = [];
  const params = [];

  for (const [key, column] of Object.entries(map)) {
    if (fields[key] !== undefined) { sets.push(`${column} = ?`); params.push(fields[key]); }
  }
  if (fields.data !== undefined) { sets.push('data_json = ?'); params.push(JSON.stringify(fields.data)); }
  if (fields.calc !== undefined) {
    sets.push('calc_json = ?');
    params.push(fields.calc === null ? null : JSON.stringify(fields.calc));
  }

  if (sets.length) {
    params.push(id);
    await pool.query(`UPDATE devis SET ${sets.join(', ')} WHERE id = ?`, params);
  }
  return getById(id);
}

module.exports = { list, getById, create, update };