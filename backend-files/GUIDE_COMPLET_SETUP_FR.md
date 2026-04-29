# 📘 GUIDE COMPLET — Intégration AOS-EMPLOI Frontend + Backend sur cPanel

**Date:** Avril 2026  
**Version:** 1.0 Final  
**Public:** Superviseur/Administrateur cPanel WordPress  
**Langue:** Français

---

## 📑 Table des Matières

1. [Vue d'ensemble du projet](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Base de données (Déjà créée)](#base-de-données)
4. [Installation étape par étape](#installation-étape-par-étape)
5. [Fichiers backend à créer](#fichiers-backend-à-créer)
6. [Configuration WordPress/ACF](#configuration-wordpress-acf)
7. [Intégration frontend](#intégration-frontend)
8. [Tests et validation](#tests-et-validation)
9. [Mise en production](#mise-en-production)
10. [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble du Projet

### Qu'est-ce qu'AOS-EMPLOI ?

AOS-EMPLOI est une plateforme web bilingue (FR/AR) destinée à :

- **Authentification sécurisée** des employés via clé unique
- **Gestion de l'espace adhérent** (profil, documents, demandes)
- **Présentation institutionnelle** (statuts, services, actualités)
- **Soumission de demandes** (Aïd, Prêts, Estivage)

### Stack Technique Globale

| Composant            | Technologie        | Détail                                                               |
| -------------------- | ------------------ | -------------------------------------------------------------------- |
| **Frontend**         | React 18 + Vite    | SPA (Single Page Application)                                        |
| **API**              | WordPress REST API | Endpoints personnalisés                                              |
| **Authentification** | Token Bearer       | Sessions 24h via JWT                                                 |
| **Base de données**  | MySQL              | 3 tables : `aos_verified_employees`, `aos_adherents`, `aos_demandes` |
| **CMS**              | WordPress + ACF    | Gestion du contenu (Statuts, Services, Actualités)                   |
| **Serveur**          | cPanel + Apache    | Hébergement partagé                                                  |

---

## 🏗️ Architecture Technique

### Flux d'authentification

```
┌─────────────────────────────────────────────────────────────┐
│  1. Employé accède au site → Formulaire d'inscription       │
│                                                             │
│  2. Email vérifié dans `aos_verified_employees` ?          │
│     ✓ OUI → Demande créée (status = "pending")             │
│     ✗ NON → Erreur : "Email non autorisé"                 │
│                                                             │
│  3. Administrateur approuve → Génère clé unique             │
│     Ex : AOS-2026-K7X3-M9QP                                │
│                                                             │
│  4. Employé se connecte avec :                             │
│     - Email                                                 │
│     - Clé unique                                            │
│                                                             │
│  5. Backend génère Token Bearer (24h)                       │
│     → Stocké en localStorage (frontend)                     │
│                                                             │
│  6. Requêtes authentifiées :                               │
│     Header: Authorization: Bearer <token>                   │
└─────────────────────────────────────────────────────────────┘
```

### Endpoints API Créés

| Endpoint            | Méthode  | Auth    | Description                          |
| ------------------- | -------- | ------- | ------------------------------------ |
| `/aos/v1/register`  | POST     | Non     | Inscription (vérification whitelist) |
| `/aos/v1/login`     | POST     | Non     | Connexion avec clé unique            |
| `/aos/v1/me`        | GET      | ✓ Token | Récupérer profil utilisateur         |
| `/aos/v1/demandes`  | GET/POST | ✓ Token | Lister/créer demandes                |
| `/aos/v1/documents` | GET      | ✓ Token | Récupérer documents accessibles      |

### Structure de données (Demandes)

**Exemple de `form_data` (JSON stocké en BD) :**

```json
{
  "type": "aid",
  "montant": 5000,
  "motif": "Situation d'urgence",
  "rib": "XXXXX...",
  "beneficiaire": "Bénéficiaire du prêt"
}
```

---

## 💾 Base de Données

### Statut Actuel ✅

**Les 3 tables existent déjà sur cPanel :**

1. **`aos_verified_employees`** — Whitelist d'emails autorisés
   - Contient les emails des employés du ministère
   - Créés par l'administrateur avant campagne d'inscription

2. **`aos_adherents`** — Comptes adhérents
   - Email + clé unique générée
   - Status : pending → approved → rejected

3. **`aos_demandes`** — Historique des demandes
   - Liées à chaque adhérent
   - Type : aid, loan, vacation, autre

### ✅ Vérification en cPanel (phpMyAdmin)

```sql
-- Vérifier que les tables existent
SHOW TABLES LIKE 'aos_%';

-- Résultat attendu :
-- aos_adherents
-- aos_demandes
-- aos_verified_employees
```

---

## 🚀 Installation Étape par Étape

### Étape 1 : Préparation de l'environnement cPanel

#### 1.1 Accédez à phpMyAdmin

- **cPanel → Bases de données → phpMyAdmin**
- Vérifiez les 3 tables `aos_*` (voir section ci-dessus)

#### 1.2 Vérifiez les permissions MySQL

```sql
-- Vérifier l'user
SELECT user, host FROM mysql.user;

-- Les tables doivent être accessibles par votre user MySQL
GRANT ALL PRIVILEGES ON `aos_%`.* TO 'votre_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 1.3 Notez l'URL de base WordPress

- **Exemple :** `https://votredomaine.com`
- Vous en aurez besoin pour `wp-config.php`

---

### Étape 2 : Installation du Plugin Backend

#### 2.1 Téléchargez le plugin

**Fichier fourni :** `aos-backend-system.php`

#### 2.2 Créez le répertoire du plugin

```
cPanel File Manager (ou FTP)
├── public_html/
│   └── wp-content/
│       └── plugins/
│           └── aos-emploi-backend/
│               └── aos-backend-system.php  ← Déposez le fichier ici
```

#### 2.3 Activez le plugin en WordPress

1. Dashboard WordPress → **Plugins**
2. Cherchez "AOS-Emploi Backend System"
3. Cliquez sur **Activer**

#### 2.4 Vérifiez l'activation

Testez un endpoint :

```bash
curl -X GET https://votredomaine.com/wp-json/aos/v1/me \
  -H "Authorization: Bearer test-token"
```

**Réponse attendue (test-token invalide) :**

```json
{
  "code": "rest_forbidden",
  "message": "Sorry, you are not allowed to do that."
}
```

---

### Étape 3 : Configuration CORS (Critique !)

#### 3.1 Modifiez `.htaccess`

**Fichier :** `public_html/.htaccess`

```apache
# --- SECTION CORS (À AJOUTER) ---
<IfModule mod_headers.c>
    # Remplacez 'https://votredomaine-frontend.com' par votre domaine frontend
    Header set Access-Control-Allow-Origin "https://votredomaine-frontend.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
</IfModule>

# Reste du .htaccess (standard WordPress)
# ... (votre contenu existant)
```

#### 3.2 Alternative : Modifier le plugin directement

**Fichier :** `wp-content/plugins/aos-emploi-backend/aos-backend-system.php`

```php
// Ligne ~15 : Modifiez l'origine CORS
header('Access-Control-Allow-Origin: https://votredomaine-frontend.com');
```

**Pour développement :** Vous pouvez temporairement utiliser `*` (non recommandé pour production)

---

### Étape 4 : Configuration WordPress/ACF (Contenu)

#### 4.1 Installez ACF Pro (Advanced Custom Fields)

- Dashboard WordPress → **Plugins → Ajouter**
- Cherchez "Advanced Custom Fields Pro"
- Installez et activez (vous devez avoir une licence)

#### 4.2 Créez les Custom Post Types

**Option A : Via Plugin (Recommandé)**

```php
// wp-content/plugins/aos-cpt-plugin.php
<?php
/**
 * Plugin Name: AOS Custom Post Types
 * Description: Crée les CPTs pour AOS-Emploi
 */

add_action('init', function() {
    // CPT: Services
    register_post_type('aos_services', [
        'labels' => ['name' => 'Services', 'singular_name' => 'Service'],
        'public' => true,
        'rest_base' => 'services',
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'custom-fields', 'thumbnail'],
    ]);

    // CPT: Actualités
    register_post_type('aos_actualites', [
        'labels' => ['name' => 'Actualités', 'singular_name' => 'Actualité'],
        'public' => true,
        'rest_base' => 'actualites',
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'custom-fields', 'thumbnail'],
    ]);

    // CPT: Chiffres Clés
    register_post_type('aos_chiffres', [
        'labels' => ['name' => 'Chiffres Clés', 'singular_name' => 'Chiffre'],
        'public' => true,
        'rest_base' => 'chiffres',
        'show_in_rest' => true,
        'supports' => ['title', 'custom-fields'],
    ]);

    // CPT: Documents
    register_post_type('aos_documents', [
        'labels' => ['name' => 'Documents', 'singular_name' => 'Document'],
        'public' => true,
        'rest_base' => 'documents',
        'show_in_rest' => true,
        'supports' => ['title', 'custom-fields'],
    ]);
});

// Enregistrer les champs ACF
if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group([
        'key' => 'group_aos_services',
        'title' => 'Champs Service',
        'fields' => [
            [
                'key' => 'field_titre_fr',
                'name' => 'titre_fr',
                'label' => 'Titre (FR)',
                'type' => 'text',
            ],
            [
                'key' => 'field_titre_ar',
                'name' => 'titre_ar',
                'label' => 'Titre (AR)',
                'type' => 'text',
            ],
            [
                'key' => 'field_description_fr',
                'name' => 'description_fr',
                'label' => 'Description Courte (FR)',
                'type' => 'textarea',
            ],
            [
                'key' => 'field_description_ar',
                'name' => 'description_ar',
                'label' => 'Description Courte (AR)',
                'type' => 'textarea',
            ],
            [
                'key' => 'field_icone',
                'name' => 'icone',
                'label' => 'Icône (URL)',
                'type' => 'url',
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'aos_services']
            ]
        ],
    ]);
}
```

**Option B : Via UI WordPress**

1. Dashboard → **ACF → Field Groups → Ajouter un groupe**
2. Remplissez les champs comme indiqué ci-dessus
3. Assignez au CPT approprié

---

### Étape 5 : Test des Endpoints

#### Test 1 : Inscription

```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ilyas@emploi.gov.ma",
    "nom": "Ilyas Sennane",
    "telephone": "+212612345678",
    "lieu_travail": "Direction DSI"
  }'
```

**Réponse attendue :**

```json
{
  "success": true,
  "message": "Demande envoyée."
}
```

#### Test 2 : Connexion (Après approche admin)

```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ilyas@emploi.gov.ma",
    "unique_key": "AOS-2026-K7X3-M9QP"
  }'
```

**Réponse attendue :**

```json
{
  "token": "a1b2c3d4e5f6...",
  "user": {
    "id": 1,
    "nom": "Ilyas Sennane",
    "email": "ilyas@emploi.gov.ma",
    "lieu_travail": "Direction DSI",
    "unique_key": "AOS-2026-K7X3-M9QP"
  }
}
```

#### Test 3 : Requête authentifiée

```bash
curl -X GET https://votredomaine.com/wp-json/aos/v1/me \
  -H "Authorization: Bearer a1b2c3d4e5f6..."
```

---

## 📂 Fichiers Backend à Créer

### Fichier 1 : Plugin Principal

**Chemin :** `wp-content/plugins/aos-emploi-backend/aos-backend-system.php`

✅ **Déjà fourni** dans le projet : `backend-files/aos-backend-system.php`

**Actions requises :**

1. Copier le fichier
2. Adapter l'URL CORS (ligne ~15)

---

### Fichier 2 : CPT + ACF Plugin

**Chemin :** `wp-content/plugins/aos-cpt-plugin.php`

```php
<?php
/**
 * Plugin Name: AOS Custom Post Types & ACF Fields
 * Description: Enregistre les CPTs et champs ACF pour AOS-Emploi
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

add_action('init', function() {
    // ============ CUSTOM POST TYPES ============

    register_post_type('aos_services', [
        'label'           => 'Services',
        'public'          => true,
        'hierarchical'    => false,
        'show_in_rest'    => true,
        'rest_base'       => 'services',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'supports'        => ['title', 'editor', 'custom-fields', 'thumbnail'],
        'rewrite'         => ['slug' => 'service'],
        'menu_icon'       => 'dashicons-briefcase',
    ]);

    register_post_type('aos_actualites', [
        'label'           => 'Actualités',
        'public'          => true,
        'hierarchical'    => false,
        'show_in_rest'    => true,
        'rest_base'       => 'actualites',
        'supports'        => ['title', 'editor', 'custom-fields', 'thumbnail'],
        'rewrite'         => ['slug' => 'actualite'],
        'menu_icon'       => 'dashicons-newspaper',
    ]);

    register_post_type('aos_chiffres', [
        'label'           => 'Chiffres Clés',
        'public'          => true,
        'show_in_rest'    => true,
        'rest_base'       => 'chiffres',
        'supports'        => ['title', 'custom-fields'],
        'menu_icon'       => 'dashicons-chart-bar',
    ]);

    register_post_type('aos_documents', [
        'label'           => 'Documents',
        'public'          => true,
        'show_in_rest'    => true,
        'rest_base'       => 'documents',
        'supports'        => ['title', 'custom-fields'],
        'menu_icon'       => 'dashicons-media-document',
    ]);
});

// ============ ACF FIELDS ============

add_action('acf/init', function() {
    if (!function_exists('acf_add_local_field_group')) return;

    // Champs Service
    acf_add_local_field_group([
        'key'      => 'group_aos_services',
        'title'    => 'Champs du Service',
        'fields'   => [
            [
                'key'   => 'field_service_titre_fr',
                'name'  => 'titre_fr',
                'label' => 'Titre (Français)',
                'type'  => 'text',
                'required' => 1,
            ],
            [
                'key'   => 'field_service_titre_ar',
                'name'  => 'titre_ar',
                'label' => 'Titre (العربية)',
                'type'  => 'text',
                'required' => 1,
            ],
            [
                'key'   => 'field_service_desc_fr',
                'name'  => 'description_fr',
                'label' => 'Description (Français)',
                'type'  => 'textarea',
                'rows'  => 4,
            ],
            [
                'key'   => 'field_service_desc_ar',
                'name'  => 'description_ar',
                'label' => 'Description (العربية)',
                'type'  => 'textarea',
                'rows'  => 4,
            ],
            [
                'key'   => 'field_service_icon',
                'name'  => 'icone_url',
                'label' => 'URL Icône',
                'type'  => 'url',
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'aos_services']
            ]
        ],
    ]);

    // Champs Actualité
    acf_add_local_field_group([
        'key'      => 'group_aos_actualites',
        'title'    => 'Champs de l\'Actualité',
        'fields'   => [
            [
                'key'   => 'field_actualite_titre_fr',
                'name'  => 'titre_fr',
                'label' => 'Titre (Français)',
                'type'  => 'text',
                'required' => 1,
            ],
            [
                'key'   => 'field_actualite_titre_ar',
                'name'  => 'titre_ar',
                'label' => 'Titre (العربية)',
                'type'  => 'text',
                'required' => 1,
            ],
            [
                'key'   => 'field_actualite_extrait_fr',
                'name'  => 'extrait_fr',
                'label' => 'Extrait (Français)',
                'type'  => 'textarea',
                'rows'  => 3,
            ],
            [
                'key'   => 'field_actualite_extrait_ar',
                'name'  => 'extrait_ar',
                'label' => 'Extrait (العربية)',
                'type'  => 'textarea',
                'rows'  => 3,
            ],
            [
                'key'   => 'field_actualite_slug',
                'name'  => 'slug',
                'label' => 'Slug (URL-friendly)',
                'type'  => 'text',
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'aos_actualites']
            ]
        ],
    ]);

    // Champs Chiffres Clés
    acf_add_local_field_group([
        'key'      => 'group_aos_chiffres',
        'title'    => 'Champs Chiffres Clés',
        'fields'   => [
            [
                'key'   => 'field_chiffre_valeur',
                'name'  => 'valeur',
                'label' => 'Valeur numérique',
                'type'  => 'number',
                'required' => 1,
            ],
            [
                'key'   => 'field_chiffre_suffixe',
                'name'  => 'suffixe',
                'label' => 'Suffixe (%, +, etc.)',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_chiffre_label_fr',
                'name'  => 'label_fr',
                'label' => 'Label (Français)',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_chiffre_label_ar',
                'name'  => 'label_ar',
                'label' => 'Label (العربية)',
                'type'  => 'text',
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'aos_chiffres']
            ]
        ],
    ]);

    // Champs Documents
    acf_add_local_field_group([
        'key'      => 'group_aos_documents',
        'title'    => 'Champs Document',
        'fields'   => [
            [
                'key'   => 'field_doc_fichier',
                'name'  => 'fichier_pdf',
                'label' => 'Fichier PDF',
                'type'  => 'file',
                'required' => 1,
            ],
            [
                'key'   => 'field_doc_categorie',
                'name'  => 'categorie',
                'label' => 'Catégorie',
                'type'  => 'select',
                'choices' => [
                    'statuts' => 'Statuts',
                    'reglement' => 'Règlement',
                    'rapports' => 'Rapports',
                    'autre' => 'Autre',
                ],
            ],
            [
                'key'   => 'field_doc_titre_fr',
                'name'  => 'titre_fr',
                'label' => 'Titre (Français)',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_doc_titre_ar',
                'name'  => 'titre_ar',
                'label' => 'Titre (العربية)',
                'type'  => 'text',
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => 'aos_documents']
            ]
        ],
    ]);
});
```

---

### Fichier 3 : Filtre REST pour afficher les champs ACF

**Chemin :** `wp-content/plugins/aos-rest-filters.php`

```php
<?php
/**
 * Plugin Name: AOS REST API Filters
 * Description: Ajoute les champs ACF aux réponses REST
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Ajouter les champs ACF aux posts Services
add_filter('rest_prepare_aos_services', function($response) {
    $post_id = $response->data['id'];
    $response->data['acf'] = get_fields($post_id);
    return $response;
}, 10, 1);

// Idem pour Actualités
add_filter('rest_prepare_aos_actualites', function($response) {
    $post_id = $response->data['id'];
    $response->data['acf'] = get_fields($post_id);
    return $response;
}, 10, 1);

// Idem pour Chiffres
add_filter('rest_prepare_aos_chiffres', function($response) {
    $post_id = $response->data['id'];
    $response->data['acf'] = get_fields($post_id);
    return $response;
}, 10, 1);

// Idem pour Documents
add_filter('rest_prepare_aos_documents', function($response) {
    $post_id = $response->data['id'];
    $response->data['acf'] = get_fields($post_id);
    return $response;
}, 10, 1);
```

---

## 🔗 Configuration WordPress/ACF

### Vue d'ensemble des contenus à créer

| Type              | Endpoint                    | Données                  | Bilingue    |
| ----------------- | --------------------------- | ------------------------ | ----------- |
| **Services**      | `/wp-json/wp/v2/services`   | 5-10 items               | Oui (FR/AR) |
| **Actualités**    | `/wp-json/wp/v2/actualites` | 5-10 articles            | Oui (FR/AR) |
| **Chiffres Clés** | `/wp-json/wp/v2/chiffres`   | 3-4 chiffres             | Oui (FR/AR) |
| **Documents**     | `/wp-json/wp/v2/documents`  | Statuts, Règlement, etc. | Oui (FR/AR) |

### Processus de création (Dashboard WordPress)

#### 1. Créer un Service

Dashboard → **Services → Ajouter un service**

**Remplir :**

- **Titre** : "Aide d'Urgence"
- **Contenu** : Description longue (affichée sur page détail)
- **Champs ACF :**
  - **Titre (FR)** : Aide d'Urgence
  - **Titre (AR)** : مساعدة الطوارئ
  - **Description (FR)** : Aide financière pour situations d'urgence
  - **Description (AR)** : مساعدة مالية في حالات الطوارئ
  - **URL Icône** : https://example.com/icons/aid.svg

**Répéter pour :** Prêt, Estivage, etc.

#### 2. Créer une Actualité

Dashboard → **Actualités → Ajouter une actualité**

**Remplir :**

- **Titre** : "Assemblée générale 2026"
- **Image mise en avant** : (Important pour l'affichage)
- **Contenu** : Texte riche de l'article
- **Champs ACF :**
  - **Titre (FR)** : Assemblée générale 2026
  - **Titre (AR)** : الجمعية العامة 2026
  - **Extrait (FR)** : Résumé court
  - **Extrait (AR)** : الملخص
  - **Slug** : assemblee-generale-2026

#### 3. Créer des Chiffres Clés

Dashboard → **Chiffres Clés → Ajouter**

**Exemples :**

```
1. Valeur: 5000
   Suffixe: "+"
   Label FR: "Membres Actifs"
   Label AR: "أعضاء نشطون"

2. Valeur: 150
   Suffixe: "M"
   Label FR: "Milliards en Aide"
   Label AR: "مليار في المساعدة"

3. Valeur: 25
   Suffixe: "ans"
   Label FR: "D'Expérience"
   Label AR: "سنة من الخبرة"
```

#### 4. Créer des Documents

Dashboard → **Documents → Ajouter**

**Exemples :**

```
1. Titre: "Statuts de l'Association"
   Fichier: statuts-aos.pdf
   Catégorie: Statuts

2. Titre: "Règlement Intérieur"
   Fichier: reglement-interieur.pdf
   Catégorie: Règlement
```

---

## 🔄 Intégration Frontend

### Configuration du Frontend (React App)

#### Étape 1 : Fichier `.env`

**Chemin :** `AOS-emploi/.env` (à créer)

```env
# API Backend
VITE_WP_API_URL=https://votredomaine.com/wp-json

# Mode mock (false = utiliser API réelle)
VITE_IS_MOCK=false

# Délai de simulation (en ms)
VITE_MOCK_DELAY=600
```

#### Étape 2 : Mise à jour des fichiers API

**Fichier :** `src/services/api.js`

```javascript
export const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";

const WP_BASE =
  import.meta.env.VITE_WP_API_URL || "https://votredomaine.com/wp-json";

export const wpApi = axios.create({
  baseURL: WP_BASE,
  timeout: 8000,
});

export const endpoints = {
  services: "/wp/v2/services",
  actualites: "/wp/v2/actualites",
  chiffres: "/wp/v2/chiffres",
  documents: "/wp/v2/documents",
  // Endpoints Auth
  register: "/aos/v1/register",
  login: "/aos/v1/login",
  me: "/aos/v1/me",
  demandes: "/aos/v1/demandes",
};
```

**Fichier :** `src/services/authAPI.js`

```javascript
export const IS_AUTH_MOCK = import.meta.env.VITE_IS_MOCK === "true";

// Lors d'appels réels :
export async function loginAdherent(credentials) {
  if (IS_AUTH_MOCK) {
    // Garder le mode mock
    return mockLogin(credentials);
  }

  const response = await authHttp.post("/aos/v1/login", credentials);
  return response.data;
}

export async function getDemandes(token) {
  if (IS_AUTH_MOCK) {
    return mockGetDemandes();
  }

  const response = await authHttp.get("/aos/v1/demandes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
```

#### Étape 3 : Déploiement du Frontend

**Option A : Build statique + Upload en cPanel**

```bash
# Dans le répertoire AOS-emploi
npm run build

# Cela génère un dossier 'dist/'
# Uploadez le contenu en FTP/SFTP :
# public_html/aos-frontend/ (ou votre chemin)
```

**Option B : Domaine séparé (Recommandé)**

Si vous avez un domaine séparé pour le frontend :

1. Créez un sous-domaine : `frontend.votredomaine.com`
2. Pointez le DocumentRoot vers le dossier `dist/`
3. Configurez CORS vers ce domaine

---

## ✅ Tests et Validation

### Checklist Pré-Production

#### ✓ Backend (API)

```bash
# 1. Test Inscription
curl -X POST https://votredomaine.com/wp-json/aos/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@emploi.gov.ma","nom":"Test User","telephone":"+212600000000","lieu_travail":"Test Dept"}'
# Réponse: {"success":true, "message":"..."}

# 2. Test Connexion (après approbation admin + clé générée)
curl -X POST https://votredomaine.com/wp-json/aos/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@emploi.gov.ma","unique_key":"AOS-2026-XXXX"}'
# Réponse: {"token":"...", "user":{...}}

# 3. Test Authenticated Route
TOKEN="<copié de la réponse login>"
curl -X GET https://votredomaine.com/wp-json/aos/v1/me \
  -H "Authorization: Bearer $TOKEN"
# Réponse: {"nom":"...", "email":"..."}

# 4. Test Récupération Services
curl https://votredomaine.com/wp-json/wp/v2/services
# Réponse: [{...services...}]
```

#### ✓ Frontend (React)

```bash
# 1. Build test
npm run build
# Vérifier qu'aucune erreur n'apparaît
# Taille du build attendue: ~150-200 KB (gzipped)

# 2. Test local
npm run dev
# Vérifier tous les liens et formulaires

# 3. Test Production
# Ouvrir le site en production
# Vérifier :
#   - Page d'accueil charge
#   - Actualités et services s'affichent
#   - Formulaire inscription fonctionne
#   - Authentification fonctionne
```

#### ✓ Bilingue (FR/AR)

- [ ] Accueil en FR
- [ ] Accueil en AR (bonne directionnalité RTL)
- [ ] Actualités FR/AR
- [ ] Services FR/AR
- [ ] Formulaires bilingual

#### ✓ Mobile

- [ ] Responsive sur petit écran
- [ ] Menu mobile fonctionne
- [ ] Espace adhérent accessible sur mobile

---

## 🚀 Mise en Production

### Avant le déploiement final

#### 1. Vérifier l'environnement

```bash
# cPanel : Vérifier PHP version (≥ 7.4)
# cPanel : Vérifier MySQL version (≥ 5.7)
# cPanel : Vérifier extensions PHP (json, gd, curl)
```

#### 2. Sauvegarder la BD

**cPanel → Bases de données → Sauvegardes**

```bash
# Ou en CLI
mysqldump -u username -p databasename > backup-2026-04-29.sql
```

#### 3. Configuration finale `.htaccess`

```apache
# Remplacer * par votre domaine frontend réel
Header set Access-Control-Allow-Origin "https://frontend.votredomaine.com"

# Ajouter compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache headers
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

#### 4. Configurer SSL (HTTPS)

**cPanel → SSL/TLS → Autofill by Domain**

- Vérifier que le certificat est actif
- Forcer le HTTPS (redirection HTTP → HTTPS)

#### 5. Tester les endpoints en production

```bash
# Depuis votre terminal local
curl -I https://votredomaine.com/wp-json/aos/v1/me

# Vérifier headers CORS
# Access-Control-Allow-Origin: https://frontend.votredomaine.com
```

---

## 🔧 Dépannage

### Problème 1 : CORS Error ("No 'Access-Control-Allow-Origin' header")

**Diagnostic :**

```bash
curl -I -X OPTIONS https://votredomaine.com/wp-json/aos/v1/me
```

**Vérifier :**

- Le header CORS est configuré dans `.htaccess` OU plugin
- L'URL du frontend est exactement correcte (avec https://)

**Solution :**

```apache
# Dans .htaccess
Header set Access-Control-Allow-Origin "https://frontend.votredomaine.com"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header set Access-Control-Allow-Headers "Authorization, Content-Type"
Header set Access-Control-Max-Age "3600"
```

---

### Problème 2 : Endpoint /aos/v1/register retourne 404

**Diagnostic :**

```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/register
```

**Cause probable :** Plugin non activé

**Solution :**

1. Dashboard WordPress → Plugins
2. Cherchez "AOS-Emploi Backend"
3. Cliquez **Activer**
4. Retestez

---

### Problème 3 : Services/Actualités ne s'affichent pas (REST API vide)

**Diagnostic :**

```bash
curl https://votredomaine.com/wp-json/wp/v2/services
```

**Cause probable :** Aucun contenu créé OU champs ACF non exposés

**Solution :**

1. Créez un service en Dashboard
2. Vérifiez que `show_in_rest: true` est configuré dans le plugin CPT
3. Assurez-vous que ACF expose les champs : Settings → ACF → REST API

---

### Problème 4 : Token Bearer invalide (401)

**Diagnostic :**

```bash
curl -X GET https://votredomaine.com/wp-json/aos/v1/me \
  -H "Authorization: Bearer invalid-token"
```

**Cause probable :** Token expiré (24h) OU format incorrect

**Solution :**

1. Relancez une connexion (`/aos/v1/login`)
2. Utilisez le nouveau token
3. Vérifiez le format : `Bearer <token>` (avec espace)

---

### Problème 5 : Frontend affiche "Mock Data" au lieu de données réelles

**Diagnostic :**

```bash
# Vérifier le .env du frontend
cat AOS-emploi/.env
```

**Cause probable :** `VITE_IS_MOCK=true`

**Solution :**

```env
# Changer en
VITE_IS_MOCK=false
VITE_WP_API_URL=https://votredomaine.com/wp-json

# Rebuild
npm run build
```

---

## 📋 Résumé des Tâches Superviseur

### Semaine 1 : Infrastructure

- [ ] Vérifier les 3 tables MySQL en phpMyAdmin
- [ ] Copier `aos-backend-plugin.php` → `wp-content/plugins/`
- [ ] Copier `aos-cpt-plugin.php` → `wp-content/plugins/`
- [ ] Copier `aos-rest-filters.php` → `wp-content/plugins/`
- [ ] Activer les 3 plugins en WordPress
- [ ] Tester `/aos/v1/register` en cURL

### Semaine 2 : Contenu + Tests

- [ ] Créer 5-10 Services en Dashboard
- [ ] Créer 5-10 Actualités en Dashboard
- [ ] Créer 3-4 Chiffres Clés
- [ ] Uploader 2-3 Documents (Statuts, Règlement)
- [ ] Tester `/wp/v2/services` en cURL
- [ ] Tester `/aos/v1/login` avec un compte test
- [ ] Approuver 2-3 demandes d'inscription (générer clés uniques)

### Semaine 3 : Déploiement

- [ ] Recevoir le build frontend (`dist/`)
- [ ] Uploader en `public_html/aos-frontend/`
- [ ] Configurer `.htaccess` CORS (domaine final)
- [ ] Tester le site en production (FR/AR)
- [ ] Vérifier authentification end-to-end
- [ ] Effectuer backup BD finale
- [ ] Go-Live ! 🚀

---

## 📞 Support & Contact

**En cas de problème :**

1. Consultez la section **Dépannage**
2. Vérifiez les logs WordPress : `wp-content/debug.log` (après activer `WP_DEBUG`)
3. Testez manuellement avec cURL
4. Contactez le développeur (Ilyas)

---

## 📝 Fichiers Clés

| Fichier        | Chemin                                                         | Description                         |
| -------------- | -------------------------------------------------------------- | ----------------------------------- |
| Plugin Backend | `wp-content/plugins/aos-emploi-backend/aos-backend-plugin.php` | API endpoints                       |
| CPT + ACF      | `wp-content/plugins/aos-cpt-plugin.php`                        | Custom Post Types                   |
| REST Filters   | `wp-content/plugins/aos-rest-filters.php`                      | Expose ACF fields                   |
| Frontend       | `dist/`                                                        | React build (upload en public_html) |
| Database       | `aos_*.sql`                                                    | 3 tables (déjà créées)              |
| Env Frontend   | `.env`                                                         | Configuration React                 |

---

## 🎓 Notes pour le Rapport de Stage

Cette intégration démontre :

- **Architecture fullstack** : Frontend React + Backend WordPress
- **Authentification sécurisée** : Tokens Bearer 24h avec whitelist
- **Bilingue (FR/AR)** : Support complet RTL
- **API RESTful** : Endpoints standardisés
- **Scalabilité** : Séparation frontend/backend permettant évolution indépendante

---

**Version finale : Avril 2026**  
**État : Production-Ready** ✅
