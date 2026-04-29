# 🚀 GUIDE COMPLET POUR SUPERVISEUR — AOS-EMPLOI

**Déploiement en 4 jours sur cPanel + WordPress Headless + React Frontend**

**Version:** 2.0 Final  
**Date:** Avril 2026  
**Responsable:** Superviseur cPanel WordPress  
**Langue:** Français  
**Public Cible:** Personnes avec accès cPanel (admin niveau)

---

## 📑 Table des Matières Rapide

1. [Vue d'ensemble - 5 min](#vue-densemble)
2. [Jour 1 - Infrastructure & Préparation - 2h](#jour-1)
3. [Jour 2 - Installation Backend & CORS - 2h](#jour-2)
4. [Jour 3 - Contenu & Tests - 3h](#jour-3)
5. [Jour 4 - Frontend & Go Live - 2h](#jour-4)
6. [Checklist Finale](#checklist-finale)
7. [FAQ & Dépannage](#faq)

---

## 🎯 Vue d'Ensemble

### Qu'est-ce que vous allez faire?

Vous allez déployer une **plateforme web bilingue** (Français/Arabe) avec:

- **Authentification sécurisée** pour employés (email + clé unique)
- **Gestion des demandes** (Aide, Prêts, Estivage)
- **CMS pour gérer le contenu** (Services, Actualités, Documents)
- **API REST pour alimenter** une React app (frontend)

### Architecture en 3 étages

```
┌─────────────────────────────────────┐
│ REACT APP (Frontend Headless)       │ ← Ce que les utilisateurs voient
│ https://frontend.votredomaine.com   │
└──────────────────┬──────────────────┘
                   │ API REST calls
                   ↓
┌─────────────────────────────────────┐
│ WORDPRESS (Backend CMS)             │ ← Ce que vous gérez en cPanel
│ https://votredomaine.com/wp-admin   │
│ + 3 Plugins PHP                     │
└──────────────────┬──────────────────┘
                   │ SQL queries
                   ↓
┌─────────────────────────────────────┐
│ MYSQL DATABASE                      │ ← Données stockées en cPanel
│ 3 Tables: adherents, demandes...    │
└─────────────────────────────────────┘
```

### Ce que vous avez déjà

✅ 3 fichiers PHP plugins (prêts à copier)  
✅ Base de données structure (déjà créée)  
✅ React frontend (prêt à déployer)  
✅ Documentation complète (ce guide)

### Ce que vous allez faire (étape par étape)

| Jour | Tâche | Durée | Clics |
|------|-------|-------|-------|
| 1 | Vérifier cPanel + BD | 2h | 10 |
| 2 | Copier 3 plugins + Activer | 2h | 15 |
| 3 | Créer contenu (Services, etc) + Tester | 3h | 30 |
| 4 | Uploader Frontend + Tests finaux | 2h | 20 |

**Total:** 9 heures de travail, spread over 4 days

---

## ⏱️ JOUR 1 — Infrastructure & Préparation (2 heures)

### Objectif du Jour 1
- ✅ Vérifier accès cPanel
- ✅ Vérifier WordPress installé
- ✅ Vérifier base de données existe
- ✅ Préparer fichiers à copier

---

### Étape 1.1 — Accès cPanel ⏱️ 10 min

**Vous allez faire:**
1. Ouvrir `https://votredomaine.com:2083` (ou lien reçu par email)
2. Entrer identifiants (username + password)

**Ce qui doit s'afficher:**

```
cPanel - Accueil
├─ Files/FTP
├─ Databases / phpMyAdmin
├─ Domains
├─ Email
├─ Software
│  └─ WordPress Manager
└─ ...
```

**Si vous ne voyez pas WordPress Manager?**  
→ Passer à Étape 1.2 directement

**Status:** ✅ Vous avez accès

---

### Étape 1.2 — Vérifier WordPress ⏱️ 10 min

**Vous allez faire:**

Ouvrir `https://votredomaine.com/wp-admin`

**Identifiants:**
- Username: [Reçu au départ]
- Password: [Reçu au départ]

**Ce qui doit s'afficher:**

```
WordPress Dashboard
├─ 📰 Posts
├─ 🎨 Appearance
├─ 🔌 Plugins ← Important!
├─ 📊 Settings
└─ Users
```

**Important:** Allez à **Plugins** → Vous devez voir:

```
☐ AOS-Emploi Backend System (PAS ENCORE activé)
☐ AOS Custom Post Types (PAS ENCORE activé)
☐ AOS REST API Filters (PAS ENCORE activé)
```

**Status:** ✅ WordPress fonctionne

---

### Étape 1.3 — Vérifier Base de Données ⏱️ 15 min

**Vous allez faire:**

1. cPanel → **Databases → phpMyAdmin**

2. Dans la colonne de gauche, cherchez votre base de données (ex: `wp_aos`)

3. Cliquer dessus pour l'ouvrir

**Ce qui doit s'afficher:**

```
Tables (Left sidebar)
├─ wp_commentmeta
├─ wp_comments
├─ wp_links
├─ wp_options
├─ wp_postmeta
├─ wp_posts
├─ wp_posts
├─ wp_term_relationships
├─ wp_term_taxonomy
├─ wp_terms
├─ wp_usermeta
├─ wp_users
├─ aos_adherents        ← Doit exister!
├─ aos_demandes         ← Doit exister!
├─ aos_verified_employees ← Doit exister!
```

**Si vous ne voyez pas les tables `aos_*`:**

→ **C'est normal, elles seront créées par les plugins**

**Status:** ✅ Database structure OK

---

### Étape 1.4 — Télécharger les Fichiers à Copier ⏱️ 10 min

**Ce que vous allez recevoir:**

3 fichiers PHP:

1. `aos-backend-system-final.php` (107 KB)
2. `aos-cpt-plugin-final.php` (45 KB)
3. `aos-rest-filters-final.php` (12 KB)

**Sauvegardez ces fichiers** quelque part sur votre ordinateur (Desktop, Téléchargements, etc)

**Status:** ✅ Fichiers prêts

---

### Étape 1.5 — Mémoriser les Domaines ⏱️ 5 min

**Écrivez (ou sauvegardez) ces domaines:**

```
Domaine Backend:  https://votredomaine.com
Domaine Frontend: https://frontend.votredomaine.com (ou sous-domaine)

Chemin WordPress: /wp-admin (gardez-le!)
Chemin API:       /wp-json/aos/v1 (important)
```

**Status:** ✅ Jour 1 complété!

---

## ⏱️ JOUR 2 — Installation Backend & Configuration CORS (2 heures)

### Objectif du Jour 2
- ✅ Copier 3 plugins en FTP
- ✅ Activer les plugins en WordPress
- ✅ Configurer CORS (autoriser frontend)

---

### Étape 2.1 — Ouvrir File Manager cPanel ⏱️ 10 min

**Vous allez faire:**

1. cPanel → **Files → File Manager**

2. Cliquer sur **public_html** (dossier principal du site)

3. Vous devez voir:

```
public_html/
├─ .htaccess
├─ index.php
├─ wp-config.php
├─ wp-content/    ← Important!
├─ wp-includes/
├─ wp-admin/
├─ wp-load.php
└─ ... (autres fichiers WordPress)
```

**Status:** ✅ File Manager ouvert

---

### Étape 2.2 — Créer Dossier pour Plugins ⏱️ 5 min

**Vous allez faire:**

1. Double-cliquer sur **wp-content** (dossier)

2. Vous voir:

```
wp-content/
├─ plugins/     ← Ouvrir ce dossier
├─ themes/
├─ uploads/
└─ ... (fichiers cache)
```

3. Double-cliquer sur **plugins**

**Status:** ✅ Vous êtes dans wp-content/plugins/

---

### Étape 2.3 — Uploader le Plugin 1 (Backend System) ⏱️ 10 min

**Vous allez faire:**

1. Dans File Manager, vous êtes dans `wp-content/plugins/`

2. Cliquer sur **+ (Upload)** button (en haut)

3. Sélectionner le fichier **`aos-backend-system-final.php`**

4. Attendre que le fichier upload (status: 100%)

5. Le fichier doit maintenant apparaître:

```
wp-content/plugins/
├─ aos-backend-system-final.php ← ✅ Uploader!
├─ akismet/
├─ hello.php
└─ ...
```

**Status:** ✅ Plugin 1 copié

---

### Étape 2.4 — Uploader le Plugin 2 (CPT) ⏱️ 5 min

**Vous allez faire (même procédure):**

1. Upload **`aos-cpt-plugin-final.php`**

2. Attendre upload 100%

```
wp-content/plugins/
├─ aos-backend-system-final.php ✅
├─ aos-cpt-plugin-final.php      ← ✅ Nouveau!
├─ akismet/
└─ ...
```

**Status:** ✅ Plugin 2 copié

---

### Étape 2.5 — Uploader le Plugin 3 (REST Filters) ⏱️ 5 min

**Même procédure:**

1. Upload **`aos-rest-filters-final.php`**

```
wp-content/plugins/
├─ aos-backend-system-final.php ✅
├─ aos-cpt-plugin-final.php     ✅
├─ aos-rest-filters-final.php   ← ✅ Nouveau!
├─ akismet/
└─ ...
```

**Status:** ✅ Les 3 plugins uploadés!

---

### Étape 2.6 — Activer les Plugins en WordPress ⏱️ 15 min

**Vous allez faire:**

1. Aller à **https://votredomaine.com/wp-admin**

2. Aller à **Plugins** (menu gauche)

3. Vous verrez:

```
Installed Plugins

☐ AOS-Emploi Backend System (Inactive) ← Cliquer "Activate"
☐ AOS Custom Post Types & ACF Fields (Inactive) ← Cliquer "Activate"
☐ AOS REST API Filters (Inactive) ← Cliquer "Activate"
```

**Cliquer sur "Activate" pour chaque (3 fois)**

**Après activation:**

```
✅ AOS-Emploi Backend System (Active)
✅ AOS Custom Post Types & ACF Fields (Active)
✅ AOS REST API Filters (Active)
```

**Status:** ✅ Les 3 plugins activés!

---

### Étape 2.7 — Configurer CORS (Important!) ⏱️ 15 min

**Qu'est-ce que CORS?**

CORS = Permission pour votre frontend d'appeler votre backend API

Sans ça, vous verrez une erreur:
```
Error: No 'Access-Control-Allow-Origin' header
```

**Vous allez faire:**

1. File Manager → Aller à `public_html/` (dossier principal)

2. Chercher et **cliquer avec le bouton droit** sur `.htaccess`

3. Cliquer **"Edit"**

4. Vous verrez du texte (configuration Apache):

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

5. **AVANT** la ligne `# BEGIN WordPress`, ajouter:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://frontend.votredomaine.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
    Header set Access-Control-Max-Age "3600"
</IfModule>

```

6. **REMPLACER** `https://frontend.votredomaine.com` par **votre vrai domaine frontend**

**Exemple si votre frontend est sur le même domaine:**

```apache
Header set Access-Control-Allow-Origin "https://votredomaine.com"
```

7. Cliquer **Save** (button en bas)

**Status:** ✅ CORS configuré!

---

### ✅ Fin Jour 2

**Vous avez fait:**
- ✅ Uploadé 3 plugins
- ✅ Activé 3 plugins
- ✅ Configuré CORS pour frontend

**Les plugins ont créé:**
- 4 nouveaux menus WordPress (Services, Actualités, etc)
- 3 nouveaux endpoints API (`/aos/v1/register`, etc)
- 3 nouvelles tables BD (seront créées auto à la première utilisation)

**Prochain:** Jour 3 — Créer contenu!

---

## ⏱️ JOUR 3 — Contenu & Tests (3 heures)

### Objectif du Jour 3
- ✅ Créer des Services (5 items)
- ✅ Créer des Actualités (5 items)
- ✅ Créer des Chiffres Clés (3 items)
- ✅ Créer des Documents (2 items)
- ✅ Tester les APIs

---

### Étape 3.1 — Créer les Services ⏱️ 45 min

**Allez à:** https://votredomaine.com/wp-admin

**Menu:** Dashboard → **Services** (nouveau menu!)

**Cliquer:** "Add New Service"

---

#### Service 1: Aide d'Urgence

**Remplir:**

```
Post Title: "Aide d'Urgence"

Contenu (Éditeur):
Aide financière immédiate pour personnes en situation d'urgence.
Notre équipe évalue votre dossier en 48h.

Image mise en avant: [Cliquer "Set featured image"]

Champs ACF (en bas):
├─ Titre (Français): "Aide d'Urgence"
├─ Titre (العربية): "مساعدة الطوارئ"
├─ Description Courte (FR): "Aide financière pour urgences"
├─ Description Courte (AR): "مساعدة مالية للحالات الطارئة"
├─ URL de l'Icône: "https://votredomaine.com/images/aid.svg"
└─ Slug: "aide-urgence"

[Publier]
```

---

#### Service 2: Prêt Personnel

```
Title: "Prêt Personnel"
Contenu: "Prêt sans intérêt pour projets personnels..."
Champs ACF:
├─ Titre FR: "Prêt Personnel"
├─ Titre AR: "قرض شخصي"
├─ Description: "..." 
├─ Icon: "https://votredomaine.com/images/loan.svg"
└─ Slug: "pret-personnel"
[Publier]
```

---

#### Service 3: Estivage

```
Title: "Estivage"
Contenu: "Aide pour vacances d'été..."
Champs ACF:
├─ Titre FR: "Estivage"
├─ Titre AR: "التنزه الصيفي"
├─ Description: "..."
├─ Icon: "https://votredomaine.com/images/vacation.svg"
└─ Slug: "estivage"
[Publier]
```

---

#### Service 4: Assistance Sociale

```
[Répéter procédure - remplir les détails]
Slug: "assistance-sociale"
```

---

#### Service 5: Conseil Juridique

```
[Répéter procédure]
Slug: "conseil-juridique"
```

**Status:** ✅ 5 Services créés

---

### Étape 3.2 — Créer les Actualités ⏱️ 45 min

**Menu:** Dashboard → **Actualités** (nouveau menu!)

**Cliquer:** "Add New"

---

#### Actualité 1: Assemblée Générale 2026

```
Title: "Assemblée générale 2026"
Contenu: 
  "Vous êtes convié(e) à l'assemblée générale ordinaire
  de notre association. Au programme: 
  - Présentation des résultats 2025
  - Élection du conseil d'administration
  - Questions de l'assemblée"

Image mise en avant: [Uploader image]

Champs ACF:
├─ Titre (FR): "Assemblée générale 2026"
├─ Titre (AR): "الجمعية العامة 2026"
├─ Extrait (FR): "Présentation des résultats et orientations..."
├─ Extrait (AR): "عرض النتائج والتوجهات..."
├─ Slug: "assemblee-2026"
├─ Auteur: "Direction"
└─ Date d'article: 2026-04-29

[Publier]
```

---

#### Actualité 2: Nouvelle Aide Disponible

```
[Répéter procédure]
Title: "Nouvelle aide lancée"
Slug: "nouvelle-aide-2026"
```

#### Actualités 3, 4, 5: [Répéter 3 fois]

**Status:** ✅ 5 Actualités créées

---

### Étape 3.3 — Créer les Chiffres Clés ⏱️ 20 min

**Menu:** Dashboard → **Chiffres Clés** (nouveau menu!)

**Cliquer:** "Add New"

---

#### Chiffre 1: Membres Actifs

```
Title: "Membres"

Champs ACF:
├─ Valeur Numérique: 5000
├─ Suffixe: "+"
├─ Label (FR): "Membres Actifs"
└─ Label (AR): "أعضاء نشطون"

[Publier]
```

#### Chiffre 2: Montant Aide

```
Title: "Aide"
Champs ACF:
├─ Valeur: 150
├─ Suffixe: "M"
├─ Label FR: "Millions d'aides"
├─ Label AR: "ملايين المساعدة"
[Publier]
```

#### Chiffre 3: Années d'expérience

```
Title: "Expérience"
Champs ACF:
├─ Valeur: 25
├─ Suffixe: "ans"
├─ Label FR: "D'Expérience"
├─ Label AR: "سنة خبرة"
[Publier]
```

**Status:** ✅ 3 Chiffres créés

---

### Étape 3.4 — Créer les Documents ⏱️ 20 min

**Menu:** Dashboard → **Documents** (nouveau menu!)

**Cliquer:** "Add New"

---

#### Document 1: Statuts

```
Title: "Statuts"

Champs ACF:
├─ Fichier PDF: [Cliquer "Upload file" → statuts.pdf]
├─ Catégorie: "Statuts" (dropdown)
├─ Titre (FR): "Statuts de l'Association"
├─ Titre (AR): "قواعس الجمعية"
├─ Description (FR): "Document officiel des statuts et règles"
└─ Description (AR): "الوثيقة الرسمية للقواعس والقوانين"

[Publier]
```

#### Document 2: Règlement Intérieur

```
Title: "Règlement"
Champs ACF:
├─ Fichier PDF: [reglement.pdf]
├─ Catégorie: "Réglement"
├─ Titre FR/AR: [Complété]
[Publier]
```

**Status:** ✅ 2+ Documents créés

---

### Étape 3.5 — Test 1: Vérifier les Données ⏱️ 15 min

**Ouvrir un terminal** (ou utiliser cURL en ligne en ligne)

**Test:** Services créés

```bash
curl https://votredomaine.com/wp-json/wp/v2/services | jq '.[0]'
```

**Vous devez voir:**
```json
{
  "id": 1,
  "title": { "rendered": "Aide d'Urgence" },
  "acf": {
    "titre_fr": "Aide d'Urgence",
    "titre_ar": "مساعدة الطوارئ",
    "description_fr": "...",
    "icone_url": "https://..."
  }
}
```

**Si vous voyez ça:** ✅ Backend fonctionne!

---

### Étape 3.6 — Test 2: Tester l'Authentification ⏱️ 20 min

**Test:** Registration

```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@emploi.gov.ma",
    "nom": "Test User",
    "telephone": "+212612345678",
    "lieu_travail": "Direction Test"
  }'
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Demande envoyée."
}
```

**Ou erreur:**
```json
{
  "code": "access_denied",
  "message": "Email non autorisé."
}
```

**Explication:** Vous devez d'abord ajouter cet email à la whitelist!

---

**Ajouter l'email à la whitelist:**

1. cPanel → **phpMyAdmin**

2. Base de données → Table **`aos_verified_employees`**

3. Cliquer **"Insert"** (ajouter ligne)

4. Remplir:
```
id: [AUTO - laisser vide]
email: test@emploi.gov.ma
added_date: [AUTO]
```

5. **Insert**

6. Relancer le test registration → Doit réussir maintenant!

---

**Test:** Login

```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@emploi.gov.ma",
    "unique_key": "AOS-2026-TEST-KEY1"
  }'
```

**Erreur attendue:**
```
"Compte en attente de validation"
```

**Pourquoi?** Parce que le compte est `pending`, pas `approved`.

---

**Approuver le compte:**

1. cPanel → **phpMyAdmin**

2. Table **`aos_adherents`**

3. Cliquer sur la ligne `test@emploi.gov.ma`

4. Changer:
```
status: pending → approved
unique_key: [Générer] AOS-2026-TEST-KEY1
```

5. **Update/Save**

---

**Relancer login:**

```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@emploi.gov.ma",
    "unique_key": "AOS-2026-TEST-KEY1"
  }'
```

**Réponse réussie:**
```json
{
  "token": "abc123def456...",
  "user": {
    "id": 1,
    "nom": "Test User",
    "email": "test@emploi.gov.ma"
  }
}
```

**Status:** ✅ Jour 3 complété!

---

## ⏱️ JOUR 4 — Frontend & Go Live (2 heures)

### Objectif du Jour 4
- ✅ Uploader le build React
- ✅ Configurer SSL
- ✅ Tests finaux
- ✅ 🚀 Go Live!

---

### Étape 4.1 — Préparer le Build React ⏱️ 10 min

**Le superviseur reçoit:** dossier **`dist/`**

(Généré par le développeur avec `npm run build`)

**Ce dossier contient:**
```
dist/
├─ index.html
├─ assets/
│  ├─ js/ (JavaScript compilé)
│  ├─ css/ (Styles compilés)
│  └─ img/ (Images)
└─ ...
```

**Status:** ✅ Build reçu

---

### Étape 4.2 — Créer Sous-Domaine Frontend ⏱️ 10 min

**Vous allez faire:**

1. cPanel → **Domains → Addon Domains**

2. Cliquer **"Add Domain"**

3. Remplir:

```
New Domain Name: frontend.votredomaine.com
(ou votre_nouveau_domaine.com)

Document Root: public_html/aos-frontend/
(le système créera ce dossier)

Click "Add Domain"
```

**Status:** ✅ Sous-domaine créé

---

### Étape 4.3 — Uploader le Frontend ⏱️ 15 min

**Vous allez faire:**

1. File Manager → Aller à `public_html/`

2. Dossier **`aos-frontend/`** doit exister (créé à l'étape 4.2)

3. Double-cliquer pour ouvrir

4. **Upload** tous les fichiers du `dist/`:
   - `index.html`
   - dossier `assets/`
   - autres fichiers

5. Attendre 100%

**Status:** ✅ Frontend uploadé

---

### Étape 4.4 — Configurer .htaccess pour React Router ⏱️ 5 min

**Important:** React Router a besoin de .htaccess

**Vous allez faire:**

1. File Manager → `public_html/aos-frontend/`

2. **Créer nouveau fichier:** `.htaccess`

3. Copier ce contenu:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

4. **Sauvegarder**

**Ce que ça fait:**  
→ Redirige toutes les URLs vers `index.html` (pour React Router)

**Status:** ✅ .htaccess configuré

---

### Étape 4.5 — Activer SSL/HTTPS ⏱️ 10 min

**Vous allez faire:**

1. cPanel → **SSL/TLS Status**

2. Chercher votre domaine `frontend.votredomaine.com`

3. Si ❌ (Not Installed):
   - Cliquer **Install**
   - Attendre 10 min

4. Si ✅ (Installed):
   - C'est bon!

5. Chercher aussi votre domaine principal `votredomaine.com`

6. Vérifier que SSL est ✅

**Status:** ✅ SSL/HTTPS actif

---

### Étape 4.6 — Test 3: Ouvrir le Frontend ⏱️ 5 min

**Vous allez faire:**

1. Ouvrir dans votre navigateur:

```
https://frontend.votredomaine.com
```

2. Vous devez voir:

```
┌─────────────────────────────────┐
│ AOS-EMPLOI Logo                 │ Navbar avec:
│ [FR ▼] [AR ▼]                   │ - Accueil
│                                 │ - Services
├─────────────────────────────────┤ - Actualités
│                                 │ - Contact
│ Bienvenue sur AOS-EMPLOI!       │ - Se connecter
│                                 │
│ Nos Services:                   │
│ [Aide] [Prêt] [Estivage] [...]  │
│                                 │
│ Actualités Récentes:            │
│ [Article 1] [Article 2] [...]   │
│                                 │
└─────────────────────────────────┘
```

**Si vous voyez ça:** ✅ Frontend fonctionne!

---

### Étape 4.7 — Test 4: Authentification Frontend ⏱️ 15 min

**Tester:**

1. Cliquer **"Se connecter"** (navbar)

2. Remplir:
```
Email: test@emploi.gov.ma
Clé unique: AOS-2026-TEST-KEY1
Cliquer "Connexion"
```

3. Vous devez voir:

```
✅ Connexion réussie!

Bienvenue [Nom]
├─ Mon Profil
├─ Mes Demandes
├─ Mes Documents
└─ Faire une demande
```

**Si vous voyez ça:** ✅ Authentification fonctionne!

---

### Étape 4.8 — Test 5: Bilingue ⏱️ 5 min

**Tester:**

1. Cliquer sur **"AR"** (navbar top droit)

2. Tous les textes doivent passer en Arabe

3. Direction du texte passe en RTL (droite → gauche)

4. Cliquer **"FR"** → retour au Français

**Si ça fonctionne:** ✅ Bilingue OK!

---

### ✅ Jour 4 Complété!

**Vous avez fait:**
- ✅ Uploadé React app
- ✅ Configuré sous-domaine
- ✅ Activé SSL/HTTPS
- ✅ Testé authentification

---

## ✅ CHECKLIST FINALE

**Avant de dire "C'est fini!":**

### Backend

- [ ] 3 plugins uploadés et activés
- [ ] CORS configuré avec bon domaine
- [ ] Services créés (5+)
- [ ] Actualités créées (5+)
- [ ] Chiffres clés créés (3+)
- [ ] Documents créés (2+)
- [ ] Tests API passés (curl)
- [ ] Authentification testée

### Frontend

- [ ] React app uploadée en `public_html/aos-frontend/`
- [ ] .htaccess créé pour React Router
- [ ] SSL/HTTPS actif
- [ ] Domaine accessible en HTTPS
- [ ] Page d'accueil charge
- [ ] Bilingue fonctionne (FR/AR)
- [ ] Authentification fonctionne
- [ ] Responsive (mobile + desktop)

### Sécurité

- [ ] CORS limité (pas de `*`)
- [ ] SSL/HTTPS obligatoire
- [ ] Tokens gérés correctement
- [ ] Base de données sauvegardée
- [ ] Pas de credentials en client-side

### Documentation

- [ ] Ce guide sauvegardé
- [ ] Mots de passe sécurisés (LastPass, Bitwarden, etc)
- [ ] Contacts d'urgence notés

---

## ❓ FAQ & Dépannage

### Q1: "Les plugins n'apparaissent pas en wp-admin"

**Réponse:** Vérifier le chemin exact:

```
✅ Correct: public_html/wp-content/plugins/aos-backend-system-final.php
❌ Faux: public_html/wp-content/aos-backend-system-final.php
```

**Solution:** Déplacer le fichier dans le bon dossier

---

### Q2: "Erreur CORS: No 'Access-Control-Allow-Origin'"

**Réponse:** Votre .htaccess n'est pas bon

**Vérifier:**

1. Domaine exact (avec `https://`)
2. Pas de typo
3. Le .htaccess est sauvegardé (pas en upload)
4. Attendre 10min (Apache redémarrage)
5. Vider cache navigateur (Ctrl+Shift+Delete)

---

### Q3: "Les Services ne s'affichent pas en JSON"

**Réponse:** Vérifier que les 3 plugins sont activés

Dashboard → Plugins → Tous ✅ doivent être actifs

---

### Q4: "Registration email dit 'Non autorisé'"

**Réponse:** L'email n'est pas en whitelist

**Solution:**

1. phpMyAdmin → Table `aos_verified_employees`
2. Ajouter l'email
3. Relancer registration

---

### Q5: "Login dit 'Compte en attente de validation'"

**Réponse:** C'est normal! Le compte n'est pas approuvé

**Solution:**

1. phpMyAdmin → Table `aos_adherents`
2. Trouver la ligne (email)
3. Changer `status` de `pending` à `approved`
4. Relancer login

---

### Q6: "Frontend dit 'Cannot reach API'"

**Réponse:** Vérifier que:

1. `.env` du frontend a le bon `VITE_WP_API_URL`
   ```
   VITE_WP_API_URL=https://votredomaine.com/wp-json
   ```

2. Build recompilé avec `npm run build`

3. CORS est configuré

4. Frontend et Backend sont en HTTPS

---

### Q7: "Le frontend affiche blanc (erreur 500)"

**Réponse:** Vérifier les logs navigateur

1. Appuyer **F12** (Dev Tools)
2. Tab **Console**
3. Chercher erreur rouge
4. Lire le message

**Causes courantes:**
- .htaccess manquant → Créer .htaccess
- API inaccessible → Vérifier CORS
- Bug JavaScript → Contacter développeur

---

### Q8: "Base de données n'a pas les tables aos_*"

**Réponse:** Elles seront créées automatiquement

Les tables `aos_*` se créent quand:
1. Premier appel à `/aos/v1/register`
2. Les plugins génèrent les tables si manquantes

**Ou créer manuellement via phpMyAdmin** (voir guide complet)

---

### Q9: "J'ai oublié le mot de passe cPanel"

**Réponse:** Contactez votre hébergeur

Fournir: Domaine principal, email associé

---

### Q10: "Dois-je installer ACF Pro?"

**Réponse:** Non, c'est optionnel

Les plugins créent les champs ACF par code (via `acf_add_local_field_group`)

Avantage de ACF Pro: UI plus facile dans WordPress (mais pas obligatoire)

---

## 📞 Support & Contacts

**Si vous êtes bloqué:**

1. **Consulter ce guide** (section FAQ)
2. **Tester manuellement** avec cURL
3. **Vérifier les logs:**
   - cPanel: `public_html/wp-content/debug.log`
   - Navigateur: F12 → Console tab

4. **Contacter le développeur** (contact email)

---

## 📊 Résumé Travail

| Jour | Tâche | Fait ✅ |
|------|-------|--------|
| 1 | Vérifier infrastructure | ☐ |
| 2 | Installer plugins + CORS | ☐ |
| 3 | Créer contenu + Tester | ☐ |
| 4 | Frontend + Go Live | ☐ |

**Durée totale:** 9 heures  
**Difficulté:** Facile (clickable, pas code)  
**Risques:** Minimes (tout peut être undone)  

---

## 🎉 Conclusion

Vous avez maintenant une **plateforme bilingue complète** avec:

✅ Authentification sécurisée (email + clé)  
✅ Gestion des demandes  
✅ CMS pour contenu (Services, Actualités, etc)  
✅ API REST (backend)  
✅ React app (frontend)  
✅ Base de données (MySQL)  
✅ SSL/HTTPS  
✅ Architecture headless (scalable)  

**La plateforme est maintenant en production!**

---

**Bonne chance! 🚀**

Pour questions: [Email support]
