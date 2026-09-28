-- Table des devis. "IF NOT EXISTS" : relancer `npm run db:migrate` ne supprime JAMAIS les devis déjà enregistrés.
CREATE TABLE IF NOT EXISTS devis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(60) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'brouillon',
  client_name VARCHAR(255) NULL,
  project_name VARCHAR(255) NULL,
  devis_date DATE NOT NULL,
  data_json JSON NOT NULL,
  calc_json JSON NULL,
  total_amount DECIMAL(14,2) NULL,
  pdf_path VARCHAR(500) NULL,
  pdf_generated_at DATETIME NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_devis_type (type),
  INDEX idx_devis_status (status),
  INDEX idx_devis_created_at (created_at),
  CONSTRAINT fk_devis_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;