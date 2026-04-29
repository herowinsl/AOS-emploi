# 📚 README — Fichiers Backend AOS-EMPLOI

**Version:** 1.0 Final  
**Date:** Avril 2026  
**Responsable:** Superviseur cPanel

---

## 🎯 Vue d'ensemble

Ce dossier `backend-files/` contient tous les fichiers et documentation nécessaires pour configurer l'infrastructure backend d'AOS-EMPLOI sur un serveur cPanel avec WordPress.

**Structure du dossier :**

```
backend-files/
├── schema.sql                       ← 📊 Structure BD (déjà créée)
├── aos-backend-plugin.php           ← 🔌 Plugin API principal
├── aos-cpt-plugin.php               ← 🔌 Custom Post Types + ACF
├── aos-rest-filters.php             ← 🔌 Filtres REST API
├── GUIDE_COMPLET_SETUP_FR.md        ← 📖 Guide complet (120+ pages)
├── CHECKLIST_DEPLOIEMENT.md         ← ✅ Checklist jour par jour
└── README.md                        ← 📄 Ce fichier
```

---

## 📋 Fichiers détaillés

### 1. `schema.sql` — Base de Données ✅ CRÉÉE

**Statut :** ✅ Déjà exécutée sur cPanel

**Contenu :**

- Table `aos_verified_employees` : Whitelist d'emails
- Table `aos_adherents` : Comptes adhérents
- Table `aos_demandes` : Historique demandes

**Qu'en faire :**

- ✅ Rien à faire (déjà créée)
- Référence utile si migration/recréation

**Exemple données test (incluses) :**

```sql
ilyas@emploi.gov.ma
ahmed@emploi.gov.ma
fatima@emploi.gov.ma
hassan@emploi.gov.ma
khadija@emploi.gov.ma
```

---

### 2. `aos-backend-plugin.php` — API Principal 🔌 À INSTALLER

**Statut :** ⬜ À copier et activer

**Cheminement cPanel :**

```
public_html/
└── wp-content/
    └── plugins/
        └── aos-emploi-backend/
            └── aos-backend-plugin.php  ← Copier ce fichier
```

**Responsabilités :**

- Routes REST `/aos/v1/*`
- Authentification (Login/Register/Me)
- Demandes (Create/List)
- Documents (List)
- CORS configuration
- Token Bearer generation

**Endpoints créés :**

```
POST   /aos/v1/register      — Inscription (whitelist)
POST   /aos/v1/login         — Connexion (clé unique)
GET    /aos/v1/me            — Profil utilisateur (🔒 Token)
GET    /aos/v1/demandes      — Lister demandes (🔒 Token)
POST   /aos/v1/demandes      — Créer demande (🔒 Token)
GET    /aos/v1/documents     — Lister documents (🔒 Token)
```

**Modification REQUISE :**

**Ligne ~15 :** Remplacez l'URL CORS

```php
// AVANT
header('Access-Control-Allow-Origin: *');

// APRÈS (Remplacer par votre domaine)
header('Access-Control-Allow-Origin: https://frontend.votredomaine.com');
```

**Activation :**

1. Dashboard WordPress → Plugins
2. Cherchez "AOS-Emploi Backend System"
3. Cliquez "Activer"

---

### 3. `aos-cpt-plugin.php` — Custom Post Types + ACF 🔌 À INSTALLER

**Statut :** ⬜ À copier et activer

**Cheminement cPanel :**

```
public_html/
└── wp-content/
    └── plugins/
        └── aos-cpt-plugin.php  ← Copier ce fichier directement
```

**Responsabilités :**

- Enregistre 4 Custom Post Types :
  - `aos_services` → Services/Prestations
  - `aos_actualites` → Articles/Actualités
  - `aos_chiffres` → Statistiques
  - `aos_documents` → Documents téléchargeables

- Enregistre 4 Field Groups ACF :
  - Champs bilingues FR/AR pour chaque CPT
  - Validation (required fields)
  - Types de données optimisés

**CPTs créés :**

| CPT              | Slug REST           | Champs                                                                      | Description  |
| ---------------- | ------------------- | --------------------------------------------------------------------------- | ------------ |
| `aos_services`   | `/wp/v2/services`   | titre_fr, titre_ar, description_fr, description_ar, icone_url, slug         | Prestations  |
| `aos_actualites` | `/wp/v2/actualites` | titre_fr, titre_ar, extrait_fr, extrait_ar, slug, author_name, article_date | Articles     |
| `aos_chiffres`   | `/wp/v2/chiffres`   | valeur, suffixe, label_fr, label_ar                                         | Statistiques |
| `aos_documents`  | `/wp/v2/documents`  | fichier_pdf, categorie, titre_fr, titre_ar, description_fr, description_ar  | Docs         |

**Activation :**

1. Dashboard → Plugins
2. Cherchez "AOS Custom Post Types"
3. Cliquez "Activer"

**Après activation :**

- Nouveau menu "Services" apparaît
- Nouveau menu "Actualités" apparaît
- Nouveau menu "Chiffres Clés" apparaît
- Nouveau menu "Documents" apparaît

---

### 4. `aos-rest-filters.php` — REST API Filters 🔌 À INSTALLER

**Statut :** ⬜ À copier et activer

**Cheminement cPanel :**

```
public_html/
└── wp-content/
    └── plugins/
        └── aos-rest-filters.php  ← Copier ce fichier directement
```

**Responsabilités :**

- Expose les champs ACF dans les réponses REST
- Ajoute champs calculés/formatés
- Gère les données de rendu frontend

**Exemple :** Sans ce plugin, une requête `/wp/v2/services/1` retournerait :

```json
{
  "id": 1,
  "title": { "rendered": "Aide d'Urgence" },
  "content": { "rendered": "..." }
  // ❌ Pas de champs ACF !
}
```

**Avec ce plugin :**

```json
{
  "id": 1,
  "title": { "rendered": "Aide d'Urgence" },
  "content": { "rendered": "..." },
  "acf": {                              // ✅ Champs ACF
    "titre_fr": "Aide d'Urgence",
    "titre_ar": "مساعدة الطوارئ",
    "description_fr": "...",
    "description_ar": "...",
    "icone_url": "https://...",
    "slug": "aide-urgence"
  },
  "formatted": { ... },                 // Champs calculés
  "slug": "aide-urgence"                // Pour URLs dynamiques
}
```

**Activation :**

1. Dashboard → Plugins
2. Cherchez "AOS REST API Filters"
3. Cliquez "Activer"

---

### 5. `GUIDE_COMPLET_SETUP_FR.md` — Guide Complet 📖 À LIRE

**Taille :** ~120 pages (format Markdown)

**Contenu :**

- Vue d'ensemble du projet (Architecture, Stack, Flux auth)
- Guide installation étape par étape
- Configuration CORS détaillée
- Installation plugins (avec explications)
- Configuration contenu (Services, Actualités, etc.)
- Tests et validation (avec exemples cURL)
- Intégration frontend React
- Mise en production
- Dépannage (12+ cas d'erreur courants)

**Quand l'utiliser :**

- **Phase 1-2 :** Lire complètement avant de commencer
- **Phase 3 :** Consulter selon les sections (ex: CORS)
- **Phase 4 :** Référence pour création contenu
- **Problème :** Consulter section Dépannage

**Format :**

- Markdown lisible
- Code examples pour copy-paste
- Tableau récapitulatifs
- Notes de mise en garde ⚠️

**À imprime r:** Oui, environ 40 pages imprimées

---

### 6. `CHECKLIST_DEPLOIEMENT.md` — Checklist Jour par Jour ✅ À IMPRIMER

**Taille :** ~8 pages

**Structure :** 8 phases de déploiement

1. Vérification infrastructure
2. Installation plugins
3. Configuration CORS
4. Création contenu
5. Tests API
6. Déploiement frontend
7. Tests intégration
8. Finalisation

**Format :**

- Cases à cocher ☐
- Exemples de tests
- Timeframes (Jour 1, 2, 3, etc.)
- Références au guide complet

**Quand l'utiliser :**

- **Jour 1 :** Imprimer + Avoir à côté
- Cocher chaque item complété
- Référence rapide (ne pas relire le guide complet)

**À imprimer :** OUI, format A4 possible

---

## 🚀 Mode d'emploi rapide

### POUR LE SUPERVISEUR

#### Jour 1 : Installation

```bash
# 1. Copier les 3 plugins en FTP
scp aos-backend-plugin.php superviseur@serveur:/public_html/wp-content/plugins/aos-emploi-backend/
scp aos-cpt-plugin.php superviseur@serveur:/public_html/wp-content/plugins/
scp aos-rest-filters.php superviseur@serveur:/public_html/wp-content/plugins/

# 2. Dashboard WordPress
# → Plugins → Activer les 3

# 3. Éditer CORS
# → Éditer public_html/.htaccess
# → Remplacer * par domaine frontend
```

#### Jour 2 : Contenu

```
Dashboard → Services → Ajouter
  Remplir : Titre FR/AR, Description, Icône, etc.

Dashboard → Actualités → Ajouter
  Remplir : Titre FR/AR, Contenu, Image, etc.

Dashboard → Chiffres Clés → Ajouter
  Remplir : Valeur, Suffixe, Label FR/AR

Dashboard → Documents → Ajouter
  Uploader PDF, Remplir métadonnées
```

#### Jour 3 : Tests

```bash
# Vérifier services
curl https://votredomaine.com/wp-json/wp/v2/services | jq '.[0]'

# Tester authentification
curl -X POST https://votredomaine.com/wp-json/aos/v1/register ...

# Tester token
TOKEN="..." && curl -X GET https://votredomaine.com/wp-json/aos/v1/me -H "Authorization: Bearer $TOKEN"
```

#### Jour 4 : Frontend

```bash
# Upload build React
# FTP → dist/ → public_html/aos-frontend/

# Tester
# Ouvrir https://frontend.votredomaine.com

# ✅ Done !
```

---

## 📊 Résumé fichiers à créer

| #   | Fichier                     | Chemin cPanel                            | Action                | Urgent |
| --- | --------------------------- | ---------------------------------------- | --------------------- | ------ |
| 1   | `aos-backend-plugin.php`    | `wp-content/plugins/aos-emploi-backend/` | Copier + Activer      | 🔴     |
| 2   | `aos-cpt-plugin.php`        | `wp-content/plugins/`                    | Copier + Activer      | 🔴     |
| 3   | `aos-rest-filters.php`      | `wp-content/plugins/`                    | Copier + Activer      | 🔴     |
| 4   | `dist/` (Frontend React)    | `public_html/aos-frontend/`              | Uploader              | 🟠     |
| 5   | `.htaccess` (Modifier)      | `public_html/`                           | Ajouter CORS          | 🔴     |
| 6   | `wp-config.php` (Optionnel) | `public_html/`                           | Constants (optionnel) | 🟢     |

---

## ❓ FAQ

### Q: J'ai uploadé le plugin mais il n'apparaît pas ?

**R:** Vérifier le chemin exact :

```
✅ wp-content/plugins/aos-emploi-backend/aos-backend-plugin.php
❌ wp-content/plugins/aos-backend-plugin.php  (Mauvais)
```

---

### Q: L'erreur CORS persiste ?

**R:** Vérifier :

1. Le domaine dans .htaccess (exact + https://)
2. Apache rechargé (automatique, mais attendre 10min)
3. Navigateur cache (Ctrl+Shift+Delete pour purger)

---

### Q: Mes Services ne s'affichent pas en REST ?

**R:** Vérifier activés les 3 plugins :

```
Dashboard → Plugins
☑ AOS-Emploi Backend System
☑ AOS Custom Post Types & ACF Fields
☑ AOS REST API Filters
```

---

### Q: Authentification ne fonctionne pas ?

**R:** Vérifier :

1. L'email existe dans `aos_verified_employees`
2. La demande d'adhésion est approuvée (status = 'approved')
3. Une clé unique a été générée
4. Test avec la clé exacte

---

### Q: Le frontend dit "Mock Data" ?

**R:** Vérifier `.env` du frontend :

```env
VITE_IS_MOCK=false        ✅ Correct
VITE_IS_MOCK=true         ❌ Utilise mock
```

---

## 📞 Support

**En cas de problème :**

1. **Consulter la section "Dépannage"** du GUIDE_COMPLET_SETUP_FR.md
2. **Tester manuellement** avec cURL (voir exemples du guide)
3. **Vérifier les logs** : `wp-content/debug.log`
4. **Contacter le développeur** : Ilyas Sennane

---

## ✅ Checklist Finale (Avant GO LIVE)

- [ ] Les 3 plugins installés et activés
- [ ] CORS configuré avec bon domaine
- [ ] Au moins 5 Services créés
- [ ] Au moins 5 Actualités créées
- [ ] Au moins 3 Chiffres clés créés
- [ ] Au moins 2 Documents créés
- [ ] Tests API manuels passés
- [ ] Frontend uploadé et accessible
- [ ] Tests intégration réussis
- [ ] BD sauvegardée
- [ ] SSL/HTTPS actif

---

**Bonne chance ! 🚀**

Pour toute question : Consultez le **GUIDE_COMPLET_SETUP_FR.md**
