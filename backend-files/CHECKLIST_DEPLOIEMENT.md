# ✅ CHECKLIST DE DÉPLOIEMENT — AOS-EMPLOI Frontend + Backend

**Date de déploiement prévue :** \_**\_/\_\_** / **\_\_**  
**Responsable :** ****\*\*****\_****\*\*****  
**Statut :** ⬜ En cours | ✅ Complété

---

## 📋 PHASE 1 : VÉRIFICATION INFRASTRUCTURE (Jour 1)

### Accès & Environnement

- [ ] Accès cPanel reçu et testé
- [ ] Connexion phpMyAdmin fonctionnelle
- [ ] Version PHP ≥ 7.4 confirmée (cPanel → PHP Configuration)
- [ ] Version MySQL ≥ 5.7 confirmée
- [ ] Extensions PHP requises : json, gd, curl (vérifier : PHP Info)

### Base de Données

- [ ] Les 3 tables existent dans phpMyAdmin :
  - [ ] `aos_verified_employees`
  - [ ] `aos_adherents`
  - [ ] `aos_demandes`
- [ ] Permissions MySQL accordées à l'utilisateur
- [ ] Donnée de test créées dans `aos_verified_employees`
- [ ] Sauvegarde BD effectuée

---

## 📦 PHASE 2 : INSTALLATION PLUGINS (Jour 1-2)

### Chargement des fichiers plugin

**Via FTP/cPanel File Manager :**

```
public_html/wp-content/plugins/
├── aos-emploi-backend/
│   └── aos-backend-system.php          ← Copier depuis backend-files/
├── aos-cpt-plugin.php                  ← Copier depuis backend-files/
└── aos-rest-filters.php                ← Copier depuis backend-files/
```

- [ ] Fichier `aos-backend-system.php` uploadé
  - [ ] Adapter la ligne CORS (~ligne 15) au domaine
- [ ] Fichier `aos-cpt-plugin.php` uploadé
- [ ] Fichier `aos-rest-filters.php` uploadé

### Activation des plugins

Dashboard WordPress → **Plugins**

- [ ] Plugin "AOS-Emploi Backend System" activé
- [ ] Plugin "AOS Custom Post Types & ACF Fields" activé
- [ ] Plugin "AOS REST API Filters" activé
- [ ] Aucune erreur d'activation affichée

### Test initial

```bash
# Terminal : Tester un endpoint
curl https://votredomaine.com/wp-json/aos/v1/register

# Doit retourner : {"code": "rest_invalid_param", ...}
# (pas d'erreur 404)
```

- [ ] ✅ Test passé (pas de 404)

---

## 🔐 PHASE 3 : CONFIGURATION CORS (Jour 2)

### Édition `.htaccess`

**Fichier :** `public_html/.htaccess`

```apache
# AJOUTER CES LIGNES (après les directives WordPress existantes)
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://frontend.votredomaine.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
    Header set Access-Control-Max-Age "3600"
</IfModule>
```

- [ ] `.htaccess` modifié et sauvegardé
- [ ] Domaine frontend remplacé (sans oublier `https://`)
- [ ] Apache rechargé (automatique)

### Test CORS

```bash
curl -I -X OPTIONS https://votredomaine.com/wp-json/aos/v1/me \
  -H "Origin: https://frontend.votredomaine.com"

# Vérifier que le header de réponse contient :
# Access-Control-Allow-Origin: https://frontend.votredomaine.com
```

- [ ] ✅ Header CORS présent

---

## 📝 PHASE 4 : CRÉATION CONTENU (Jour 2-3)

### 1️⃣ Créer Services (5-10 items)

Dashboard → **Services → Ajouter un service**

**Service 1 : Aide d'Urgence**

- [ ] Titre : "Aide d'Urgence"
- [ ] Contenu : [Texte descriptif]
- [ ] Image mise en avant : [Uploader image]
- [ ] **Champs ACF :**
  - [ ] Titre FR : "Aide d'Urgence"
  - [ ] Titre AR : "مساعدة الطوارئ"
  - [ ] Description FR : "Aide financière immédiate pour situations d'urgence..."
  - [ ] Description AR : "مساعدة مالية فورية لحالات الطوارئ..."
  - [ ] URL Icône : `https://votredomaine.com/images/icons/aid.svg`
  - [ ] Slug : `aide-urgence`
- [ ] **Publier**

**Service 2 : Prêt Personnel**

- [ ] [Répéter processus]
- [ ] Slug : `pret-personnel`

**Service 3 : Estivage**

- [ ] [Répéter processus]
- [ ] Slug : `estivage`

**Service 4 : Assistance Sociale**

- [ ] [Répéter processus]
- [ ] Slug : `assistance-sociale`

**Service 5 : Conseil Juridique**

- [ ] [Répéter processus]
- [ ] Slug : `conseil-juridique`

- [ ] ✅ Au moins 5 services créés

### 2️⃣ Créer Actualités (5-10 items)

Dashboard → **Actualités → Ajouter une actualité**

**Actualité 1 : Assemblée Générale 2026**

- [ ] Titre : "Assemblée générale de l'association 2026"
- [ ] Contenu : [Texte riche]
- [ ] Image : [Uploader]
- [ ] **Champs ACF :**
  - [ ] Titre FR : "Assemblée générale 2026"
  - [ ] Titre AR : "الجمعية العامة 2026"
  - [ ] Extrait FR : "Présentation des résultats et orientations..."
  - [ ] Extrait AR : "عرض النتائج والتوجهات..."
  - [ ] Slug : `assemblee-2026`
  - [ ] Auteur : "Administration"
  - [ ] Date : [Date actuelle]
- [ ] **Publier**

**Actualité 2 : Nouvelle Aide**

- [ ] [Répéter processus]
- [ ] Slug : `nouvelle-aide-2026`

**Actualité 3 : Partenariat**

- [ ] [Répéter processus]
- [ ] Slug : `nouveau-partenariat`

**Actualité 4 : Événement**

- [ ] [Répéter processus]
- [ ] Slug : `event-formation`

**Actualité 5 : Rapport Annuel**

- [ ] [Répéter processus]
- [ ] Slug : `rapport-annuel-2025`

- [ ] ✅ Au moins 5 actualités créées

### 3️⃣ Créer Chiffres Clés (3-4 items)

Dashboard → **Chiffres Clés → Ajouter**

**Chiffre 1 : Membres**

- [ ] Titre : "Membres"
- [ ] **Champs ACF :**
  - [ ] Valeur : `5000`
  - [ ] Suffixe : `+`
  - [ ] Label FR : "Membres Actifs"
  - [ ] Label AR : "أعضاء نشطون"
- [ ] **Publier**

**Chiffre 2 : Milliards**

- [ ] Titre : "Aide"
- [ ] Valeur : `150`
- [ ] Suffixe : `M`
- [ ] Label FR : "Milliards d'Aides"
- [ ] Label AR : "مليارات المساعدة"

**Chiffre 3 : Expérience**

- [ ] Titre : "Expérience"
- [ ] Valeur : `25`
- [ ] Suffixe : `ans`
- [ ] Label FR : "D'Expérience"
- [ ] Label AR : "سنة خبرة"

**Chiffre 4 : Satisfaction**

- [ ] Titre : "Satisfaction"
- [ ] Valeur : `98`
- [ ] Suffixe : `%`
- [ ] Label FR : "Taux de Satisfaction"
- [ ] Label AR : "نسبة الرضا"

- [ ] ✅ Au moins 4 chiffres créés

### 4️⃣ Créer Documents (2-3 items)

Dashboard → **Documents → Ajouter**

**Document 1 : Statuts**

- [ ] Titre : "Statuts"
- [ ] **Champs ACF :**
  - [ ] Fichier PDF : [Uploader statuts.pdf]
  - [ ] Catégorie : "Statuts"
  - [ ] Titre FR : "Statuts de l'Association"
  - [ ] Titre AR : "قواعس الجمعية"
  - [ ] Description FR : "Document officiel des statuts"
  - [ ] Description AR : "الوثيقة الرسمية للقواعس"
- [ ] **Publier**

**Document 2 : Règlement**

- [ ] Titre : "Règlement Intérieur"
- [ ] Fichier : reglement.pdf
- [ ] Catégorie : "Réglement"
- [ ] Titre FR/AR : [Complété]

**Document 3 : Rapport (Optionnel)**

- [ ] Titre : "Rapport Annuel"
- [ ] Fichier : rapport-2025.pdf
- [ ] Catégorie : "Rapports"

- [ ] ✅ Au moins 2 documents créés

---

## 🧪 PHASE 5 : TESTS API (Jour 3)

### Test 1 : Vérifier les endpoints content

```bash
# Services
curl https://votredomaine.com/wp-json/wp/v2/services | jq '.[0]'
# Doit retourner 1 service avec champs acf

# Actualités
curl https://votredomaine.com/wp-json/wp/v2/actualites | jq '.[0]'
# Doit retourner 1 actualité

# Chiffres
curl https://votredomaine.com/wp-json/wp/v2/chiffres | jq '.[0]'
# Doit retourner chiffres avec formatted

# Documents
curl https://votredomaine.com/wp-json/wp/v2/documents | jq '.[0]'
# Doit retourner documents avec URLs
```

- [ ] ✅ Services chargent correctement
- [ ] ✅ Actualités chargent correctement
- [ ] ✅ Chiffres chargent correctement
- [ ] ✅ Documents chargent correctement

### Test 2 : Test d'authentification

**2a. Inscription**

```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@emploi.gov.ma",
    "nom": "Test User",
    "telephone": "+212612345678",
    "lieu_travail": "Direction Test"
  }'

# Réponse attendue:
# {"success":true,"message":"Demande envoyée."}
```

- [ ] ✅ Inscription acceptée

**2b. Approuver la demande**

Dashboard → **Adhérents** (ou table als_adherents en phpMyAdmin)

- [ ] Trouver l'inscription test
- [ ] Changer status : `pending` → `approved`
- [ ] Générer clé unique : `AOS-2026-TEST-KEY1`
- [ ] Sauvegarder

**2c. Connexion**

```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@emploi.gov.ma",
    "unique_key": "AOS-2026-TEST-KEY1"
  }'

# Réponse attendue:
# {"token":"abc123def456...","user":{...}}
```

- [ ] ✅ Connexion réussie, token reçu

**2d. Requête authentifiée**

```bash
TOKEN="abc123def456..." # Copier du response précédent
curl -X GET https://votredomaine.com/wp-json/aos/v1/me \
  -H "Authorization: Bearer $TOKEN"

# Réponse attendue:
# {"nom":"Test User","email":"test@emploi.gov.ma",...}
```

- [ ] ✅ Route authentifiée fonctionne

### Test 3 : Demande (CREATE)

```bash
TOKEN="abc123def456..."
curl -X POST https://votredomaine.com/wp-json/aos/v1/demandes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "aid",
    "montant": 5000,
    "motif": "Test demande",
    "rib": "MA64012345678901234567890"
  }'

# Réponse attendue:
# {"success":true}
```

- [ ] ✅ Création demande fonctionne

### Test 4 : Demandes (LIST)

```bash
TOKEN="abc123def456..."
curl -X GET https://votredomaine.com/wp-json/aos/v1/demandes \
  -H "Authorization: Bearer $TOKEN"

# Réponse attendue:
# [{"id":"REQ-001","type":"aid","status":"pending","date":"2026-04-29"}]
```

- [ ] ✅ Listage demandes fonctionne

---

## 🚀 PHASE 6 : DÉPLOIEMENT FRONTEND (Jour 3-4)

### Frontend Build

Chez le développeur :

```bash
cd AOS-emploi
npm run build
# Génère le dossier dist/
```

- [ ] ✅ Build reçu (dossier `dist/`)

### Upload en cPanel

**Option A : Sous-dossier du site principal**

FTP/File Manager : `public_html/aos-frontend/`

- [ ] Uploader le contenu de `dist/` dans `public_html/aos-frontend/`
- [ ] Vérifier les fichiers `.html` et `assets/`

**Option B : Sous-domaine (Recommandé)**

cPanel → Addon Domains

- [ ] Créer sous-domaine : `frontend.votredomaine.com`
- [ ] Document Root : `public_html/aos-frontend/`
- [ ] Uploader `dist/` dedans

### Configuration `.env` Frontend

**Fichier local du développeur avant build :** `AOS-emploi/.env`

```env
VITE_WP_API_URL=https://votredomaine.com/wp-json
VITE_IS_MOCK=false
```

- [ ] ✅ `.env` configuré avant build
- [ ] ✅ Build effectué avec bonnes variables
- [ ] ✅ Frontend uploadé en cPanel

### SSL/HTTPS

cPanel → SSL/TLS

- [ ] Certificat SSL actif pour le domaine frontend
- [ ] Redirection HTTP → HTTPS configurée

---

## 🧪 PHASE 7 : TESTS INTÉGRATION (Jour 4)

### Test Frontend en production

Ouvrir : `https://frontend.votredomaine.com/`

**Page d'accueil (Accueil)**

- [ ] Page charge correctement
- [ ] Services visibles
- [ ] Actualités visibles
- [ ] Chiffres clés animés
- [ ] Pas de console errors

**Bilingue (FR/AR)**

- [ ] Switcher FR/AR fonctionne
- [ ] Tous les textes sont traduits
- [ ] Directionnalité RTL correcte en AR

**Services**

- [ ] Route `/services` charge
- [ ] Liste de services visible
- [ ] Clic sur service → détail page
- [ ] Infos s'affichent correctement

**Actualités**

- [ ] Route `/actualites` charge
- [ ] Articles visibles
- [ ] Clic sur article → détail
- [ ] Image featured affichée

**Contact**

- [ ] Formulaire visible
- [ ] Envoi fonctionne (email reçu ?)
- [ ] Notification success/error

**Authentification**

- [ ] Route `/auth` accessible
- [ ] Formulaire inscription visible
- [ ] Inscription test réussit
- [ ] Notification confirmation affichée
- [ ] Connexion après approbation réussit

**Espace Adhérent** (avec token valide)

- [ ] Route `/espace-adherent` protégée
- [ ] Dashboard charge
- [ ] Tabs (Overview, Profil, Documents, Demandes) clickables
- [ ] Infos profil correctes
- [ ] Documents téléchargeables
- [ ] Formulaire nouvelle demande fonctionne

### Tests Mobile

Ouvrir sur téléphone/responsiveness

- [ ] Menu mobile fonctionne
- [ ] Textes lisibles
- [ ] Formulaires remplissables
- [ ] Images responsive
- [ ] Pas de débordements

---

## ✅ PHASE 8 : FINAL (Jour 4)

### Checklist finale avant GO LIVE

**Backups**

- [ ] Sauvegarde BD complète effectuée
- [ ] Dossier `public_html` backupé
- [ ] Fichiers de config backupés

**Performance**

- [ ] Temps de chargement acceptable
- [ ] Pas d'erreurs console (F12)
- [ ] Images optimisées

**Sécurité**

- [ ] SSL/HTTPS actif
- [ ] CORS correctement configuré (pas \* en production)
- [ ] Pas de credentials en client-side
- [ ] Tokens gérés en localStorage (OK)

**Documentation**

- [ ] Guide GUIDE_COMPLET_SETUP_FR.md sauvegardé
- [ ] Mots de passe/tokens sécurisés (pas de GitHub)
- [ ] Contacts d'urgence notés

---

## 📊 RÉSUMÉ FINAL

| Composant          | Statut   |
| ------------------ | -------- |
| Backend Plugins    | ⬜ ⬜ ⬜ |
| CORS Configuration | ⬜       |
| Database Content   | ⬜       |
| API Tests          | ⬜       |
| Frontend Build     | ⬜       |
| Frontend Upload    | ⬜       |
| Integration Tests  | ⬜       |
| **GO LIVE**        | ⬜       |

---

## 🆘 CONTACTS & SUPPORT

**En cas de problème :**

1. Consultez [GUIDE_COMPLET_SETUP_FR.md](./GUIDE_COMPLET_SETUP_FR.md) Section "Dépannage"
2. Testez manuellement avec `curl` (voir exemples ci-dessus)
3. Vérifiez les logs WordPress : `wp-content/debug.log`
4. Contactez le développeur : **Ilyas Sennane**

---

**Bonne chance ! 🚀**
