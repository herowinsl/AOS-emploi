-- ============================================================
-- À exécuter dans : cPanel → phpMyAdmin → onglet SQL
-- Préfixe : aos_(distinct des tables WordPress wp_)
-- Encodage : utf8mb4 — obligatoire pour l'arabe
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- TABLE 1 : Liste blanche des employés (filtre de sécurité)
-- Seul un email présent ici peut s'inscrire sur le site.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `aos_verified_employees` (
  `id`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `email`       VARCHAR(150)    NOT NULL,
  `nom`         VARCHAR(100)    DEFAULT NULL,
  `type`        ENUM('actif','retraité') NOT NULL DEFAULT 'actif',
  `imported_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- TABLE 2 : Comptes adhérents
-- Créés à l'inscription, validés par l'admin (Attribution clé unique).
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `aos_adherents` (
  `id`           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `nom`          VARCHAR(100)    NOT NULL,
  `email`        VARCHAR(150)    NOT NULL,
  `telephone`    VARCHAR(20)     DEFAULT NULL,
  `lieu_travail` VARCHAR(200)    DEFAULT NULL,
  `unique_key`   VARCHAR(30)     DEFAULT NULL   COMMENT 'Ex: AOS-2026-X7Y2',
  `status`       ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `token`        VARCHAR(255)    DEFAULT NULL,
  `token_expiry` DATETIME        DEFAULT NULL,
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at`  DATETIME        DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`),
  UNIQUE KEY `uq_key` (`unique_key`),
  KEY `idx_status` (`status`),
  KEY `idx_token`  (`token`(32))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- TABLE 3 : Demandes de services
-- Stocke les formulaires (Aïd, Prêt, Estivage).
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `aos_demandes` (
  `id`              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `adherent_id`     INT UNSIGNED    NOT NULL,
  `type_demande`    ENUM('aid', 'loan', 'vacation', 'autre') NOT NULL,
  `sujet`           VARCHAR(255)    NOT NULL,
  `form_data`       JSON            NOT NULL COMMENT 'Données RIB, Montant, Dates, etc.',
  `status`          ENUM('pending','approved','rejected','en_traitement') NOT NULL DEFAULT 'pending',
  `admin_response`  TEXT            DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_adherent` (`adherent_id`),
  KEY `idx_status`   (`status`),
  CONSTRAINT `fk_demande_adherent`
    FOREIGN KEY (`adherent_id`) REFERENCES `aos_adherents` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ────────────────────────────────────────────────────────────
-- DONNÉES DE TEST
-- ────────────────────────────────────────────────────────────
INSERT INTO `aos_verified_employees` (`email`, `nom`, `type`) VALUES
('ilyas@emploi.gov.ma',   'Ilyas Sennane',       'actif'),
('ahmed@emploi.gov.ma',   'Ahmed Benali',         'actif'),
('fatima@emploi.gov.ma',  'Fatima Zahra Alami',   'actif'),
('hassan@emploi.gov.ma',  'Hassan Moukrim',        'retraité'),
('khadija@emploi.gov.ma', 'Khadija Tazi',          'actif');