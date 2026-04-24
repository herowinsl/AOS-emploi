# PROJECT CONTEXT DOCUMENT

---

## Section 0 — Résumé exécutif

**État actuel du Frontend:** Le frontend est 100% prêt à être déployé, avec toutes les pages et fonctionnalités initiales implémentées comme spécifié.

**Étape manquante critique:** La connexion au backend WordPress et la configuration des API.

**Durée estimée pour les étapes restantes:**
-   Intégration du backend: [À définir, ex: 1 semaine]
-   Tests complets et débogage: [À définir, ex: 3 jours]
-   Déploiement final: [À définir, ex: 1 jour]

**Rôle de chacun pour la finalisation:**
-   **Frontend Developer (moi):** Assurer la bonne intégration avec les API, ajuster le frontend si nécessaire suite aux données réelles.
-   **Backend Developer (vous/votre équipe):** Fournir les URL cPanel, les identifiants, le domaine, configurer le serveur WordPress, créer les CPTs, ACF, implémenter les 7 endpoints REST API, et gérer les plugins.
-   **Client:** Saisir le contenu bilingue dans WordPress pour les actualités, photos, PDFs, etc.

---

## Section 1 — État d'avancement

### Tableau des pages (12 pages complètes + bilingues)

| Page                                  | Route                      | Statut   | Bilingue | Notes                                                               |
| :------------------------------------ | :------------------------- | :------- | :------- | :------------------------------------------------------------------ |
| Accueil                               | `/`                        | Complet  | Oui      |                                                                     |
| Statuts                               | `/about/statuts`           | Complet  | Oui      | Contenu statique, géré par le code.                                 |
| Règlement Intérieur                    | `/about/reglement`         | Complet  | Oui      | Contenu statique, géré par le code.                                 |
| Le Bureau                             | `/about/bureau`            | Complet  | Oui      | Contenu statique, géré par le code.                                 |
| Services                              | `/services`                | Complet  | Oui      | Liste les services, données mockées.                                |
| Détail Service                        | `/services/:slug`          | Complet  | Oui      | Affiche le détail d'un service, données mockées.                    |
| Actualités                            | `/actualites`              | Complet  | Oui      | Liste les actualités, données mockées.                              |
| Détail Actualité                      | `/actualites/:slug`        | Complet  | Oui      | Affiche le détail d'une actualité, données mockées.                 |
| Contact                               | `/contact`                 | Complet  | Oui      | Formulaire de contact fonctionnel.                                  |
| Authentification (Connexion/Inscription) | `/auth`                    | Complet  | Oui      | Formulaires de connexion et d'inscription.                          |
| Espace Adhérent                       | `/espace-adherent`         | Complet  | Oui      | Page protégée, affichant les documents et informations de profil.   |
| Page Non Trouvée (404)                | `*`                        | Complet  | Oui      |                                                                     |

### Checklist des fonctionnalités livrées (10+ fonctionnalités)

-   [x] Navigation dynamique (Navbar)
-   [x] Gestion du contenu bilingue (`LangContext`)
-   [x] Affichage des services (liste et détail)
-   [x] Affichage des actualités (liste et détail)
-   [x] Formulaire de contact (envoi simulé, backend à connecter)
-   [x] Authentification utilisateur (connexion, inscription - simulée, backend à connecter)
-   [x] Routage protégé pour l'espace adhérent
-   [x] Affichage des documents dans un tableau responsive (Espace Adhérent)
-   [x] Recherche de documents
-   [x] Affichage d'un panneau d'information (HeroInfoPanel)
-   [x] Sections Accueil (Hero, Services, Actualités, Chiffres Clés, CTA)
-   [x] Gestion des états de chargement et d'erreur (SkeletonCard, ErrorBanner)

---

## Section 2 — Ce qui manque

**Accès cPanel & Informations de Domaine:**
-   URL d'accès au cPanel: `[À remplir par le développeur backend]`
-   Identifiants cPanel (nom d'utilisateur, mot de passe): `[À remplir par le développeur backend]`
-   Nom de domaine du site (ex: `www.aosemploi.com`): `[À remplir par le développeur backend]`

**Variables d'environnement (.env):**
Les variables suivantes devront être définies dans le fichier `.env` à la racine du projet (ou configurées sur le serveur cPanel) pour la connexion au backend WordPress:

-   `VITE_WP_API_URL`: L'URL de base de l'API REST de WordPress (ex: `https://www.aosemploi.com/wp-json/wp/v2/`).
-   `VITE_WP_AUTH_URL`: L'URL de l'endpoint d'authentification WordPress (si différente de l'API principale).
-   `VITE_APP_URL`: L'URL front-end de votre application (ex: `https://www.aosemploi.com`).

---

## Section 3 — Configuration CORS

Pour permettre au frontend (hébergé sur un domaine différent ou un sous-domaine) de communiquer avec l'API WordPress, la configuration CORS (Cross-Origin Resource Sharing) est essentielle. Le code suivant doit être ajouté au fichier `functions.php` de votre thème WordPress actif (ou dans un plugin d'extension pour une meilleure gestion):

```php
<?php
/**
 * Allow CORS (Cross-Origin Resource Sharing) for WordPress REST API.
 */
function allow_cors_rest_api() {
    // Replace with your actual frontend domain(s)
    $allowed_origins = [
        'http://localhost:5173', // For local development
        'https://www.aosemploi.com' // Your production frontend URL
    ];

    if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 600'); // Cache preflight response for 10 minutes

    // Handle preflight OPTIONS requests
    if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
        status_header(200);
        exit();
    }
}
add_action('rest_api_init', 'allow_cors_rest_api');
add_action('init', 'allow_cors_rest_api'); // For non-REST API requests if needed

// Optionally, you might need to adjust .htaccess for OPTIONS requests as well
// <IfModule mod_headers.c>
//   RewriteEngine On
//   RewriteCond %{REQUEST_METHOD} OPTIONS
//   RewriteRule ^(.*)$ $1 [R=200,L,E=END_CORS:1]
//   Header always set Access-Control-Allow-Origin "*" env=END_CORS
//   Header always set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" env=END_CORS
//   Header always set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" env=END_CORS
//   Header always set Access-Control-Allow-Credentials "true" env=END_CORS
//   Header always set Access-Control-Max-Age "600" env=END_CORS
// </IfModule>
?>
```

---

## Section 4 — Structure WordPress

Ce frontend est conçu pour consommer une API WordPress. La structure suivante est **attendue** côté backend pour un fonctionnement optimal :

### Custom Post Types (CPTs) à créer:
-   **Services:** Pour gérer la liste et les détails des services proposés.
    -   Champs ACF (ex: `service_icon`, `service_description_fr`, `service_description_ar`, `service_slug`).
-   **Actualites:** Pour gérer les articles d'actualités.
    -   Champs ACF (ex: `actuality_image`, `actuality_date`, `actuality_content_fr`, `actuality_content_ar`, `actuality_slug`).
-   **Documents:** Pour gérer les documents téléchargeables de l'espace adhérent.
    -   Champs ACF (ex: `document_file` (type fichier), `document_type`, `document_size`, `document_title_fr`, `document_title_ar`).
-   **Slides:** Pour le carrousel de la section Hero (si dynamique).
    -   Champs ACF (ex: `slide_image`, `slide_title_fr`, `slide_title_ar`, `slide_description_fr`, `slide_description_ar`).
-   **Chiffres Cles:** Pour les données affichées dans la section "Chiffres Clés".
    -   Champs ACF (ex: `chiffre_value`, `chiffre_label_fr`, `chiffre_label_ar`).

### Champs ACF (Advanced Custom Fields) avec leur type et description:
Le frontend attend des données structurées. Voici une proposition basée sur les composants existants :

**CPT "Services":**
-   `service_icon` (Type: Image/URL, Description: Icône représentative du service)
-   `service_title_fr` (Type: Texte, Description: Titre du service en français)
-   `service_title_ar` (Type: Texte, Description: Titre du service en arabe)
-   `service_short_description_fr` (Type: Texte court, Description: Courte description en français)
-   `service_short_description_ar` (Type: Texte court, Description: Courte description en arabe)
-   `service_full_description_fr` (Type: Éditeur WYSIWYG, Description: Description complète en français)
-   `service_full_description_ar` (Type: Éditeur WYSIWYG, Description: Description complète en arabe)
-   `service_slug` (Type: Texte, Description: Slug unique pour l'URL de détail du service)

**CPT "Actualites":**
-   `actuality_image` (Type: Image/URL, Description: Image principale de l'actualité)
-   `actuality_date` (Type: Date, Description: Date de publication de l'actualité)
-   `actuality_title_fr` (Type: Texte, Description: Titre de l'actualité en français)
-   `actuality_title_ar` (Type: Texte, Description: Titre de l'actualité en arabe)
-   `actuality_content_fr` (Type: Éditeur WYSIWYG, Description: Contenu de l'actualité en français)
-   `actuality_content_ar` (Type: Éditeur WYSIWYG, Description: Contenu de l'actualité en arabe)
-   `actuality_slug` (Type: Texte, Description: Slug unique pour l'URL de détail de l'actualité)

**CPT "Documents":**
-   `document_file` (Type: Fichier, Description: Le fichier PDF téléchargeable)
-   `document_type` (Type: Texte/Sélection, Description: Type du document (ex: PDF))
-   `document_size` (Type: Texte, Description: Taille du document (ex: 1.2 MB))
-   `document_title_fr` (Type: Texte, Description: Titre du document en français)
-   `document_title_ar` (Type: Texte, Description: Titre du document en arabe)

**CPT "Chiffres Cles":**
-   `chiffre_value` (Type: Nombre, Description: Valeur numérique du chiffre clé)
-   `chiffre_label_fr` (Type: Texte, Description: Label du chiffre clé en français)
-   `chiffre_label_ar` (Type: Texte, Description: Label du chiffre clé en arabe)

### Endpoints REST API (7 endpoints attendus avec le format):
Le frontend s'attend à consommer les endpoints suivants via l'API REST de WordPress:

1.  **GET /wp-json/wp/v2/pages?slug=home**: Récupérer le contenu de la page d'accueil (sections dynamiques).
    -   **Format attendu:** `{ id, title.rendered, content.rendered, acf: { ... } }`
2.  **GET /wp-json/wp/v2/services**: Récupérer la liste de tous les services.
    -   **Format attendu:** `[{ id, title.rendered, acf: { service_icon, service_title_fr, service_title_ar, service_short_description_fr, service_short_description_ar, service_slug } }, ...]`
3.  **GET /wp-json/wp/v2/services?slug=<service_slug>**: Récupérer les détails d'un service spécifique par son slug.
    -   **Format attendu:** `{ id, title.rendered, content.rendered, acf: { service_icon, service_title_fr, service_title_ar, service_full_description_fr, service_full_description_ar, service_slug } }`
4.  **GET /wp-json/wp/v2/actualites**: Récupérer la liste de toutes les actualités.
    -   **Format attendu:** `[{ id, title.rendered, date, acf: { actuality_image, actuality_title_fr, actuality_title_ar, actuality_content_fr, actuality_content_ar, actuality_slug } }, ...]`
5.  **GET /wp-json/wp/v2/actualites?slug=<actuality_slug>**: Récupérer les détails d'une actualité spécifique par son slug.
    -   **Format attendu:** `{ id, title.rendered, date, content.rendered, acf: { actuality_image, actuality_title_fr, actuality_title_ar, actuality_content_fr, actuality_content_ar, actuality_slug } }`
6.  **GET /wp-json/wp/v2/documents**: Récupérer la liste des documents pour l'espace adhérent.
    -   **Format attendu:** `[{ id, title.rendered, acf: { document_file, document_type, document_size, document_title_fr, document_title_ar } }, ...]`
7.  **GET /wp-json/wp/v2/chiffres-cles**: Récupérer les chiffres clés.
    -   **Format attendu:** `[{ id, title.rendered, acf: { chiffre_value, chiffre_label_fr, chiffre_label_ar } }, ...]`

**(Authentification):** Pour l'authentification (connexion/inscription), le frontend s'attend à utiliser un plugin JWT (JSON Web Token) pour WordPress.
-   **POST /wp-json/jwt-auth/v1/token**: Pour obtenir un jeton JWT après connexion.
    -   **Format attendu (réponse):** `{ token, user_email, user_nicename, user_display_name }`
-   **POST /wp-json/wp/v2/users/register**: (Si l'inscription est gérée par l'API WP, sinon un autre endpoint).

---

## Section 5 — Contenu bilingue

### Contenu déjà codé (Frontend / Fichiers statiques)
Le contenu suivant est actuellement géré directement dans le code du frontend via des fichiers JavaScript dédiés et le `LangContext`. Il ne nécessite pas de saisie via WordPress, sauf si une modification dynamique est souhaitée à l'avenir.

-   **`src/data/cadreAssociatifContent.js`**: Contenu des pages "Statuts", "Règlement Intérieur", "Le Bureau".
-   **`src/components/espace-adherent/dashboardContent.js`**: Contenu et traductions spécifiques au tableau de bord de l'espace adhérent.
-   **`src/components/Home/heroContent.js`**: Contenu textuel de la section Hero sur la page d'accueil.
-   **`src/data/servicesDetails.js`**: Descriptions détaillées et autres informations pour les services.
-   **`src/context/LangContext.jsx`**: Gère le basculement linguistique et fournit les traductions.

### Contenu à saisir par le client dans WordPress
Le contenu suivant est dynamiquement affiché par le frontend et doit être géré et saisi par le client via l'interface d'administration de WordPress, en utilisant les CPTs et ACF décrits dans la Section 4.

-   **Actualités:** Titres, images, dates et contenus (en français et en arabe).
-   **Services:** Titres, icônes, descriptions courtes et longues (en français et en arabe).
-   **Documents:** Fichiers PDF, titres, types et tailles (en français et en arabe).
-   **Chiffres Clés:** Valeurs numériques et labels (en français et en arabe).
-   **Images/Médias:** Toutes les images utilisées dans les sections dynamiques (actualités, slides, icônes de services).
-   **Paramètres du site:** Peut inclure des informations de contact, liens sociaux, etc., qui pourraient être gérés via une page d'options ACF.

---

## Section 6 — Déploiement cPanel

Voici les étapes générales pour déployer l'application React sur un cPanel. Les chemins spécifiques peuvent varier.

1.  **Préparation du Build:**
    -   Assurez-vous que l'application est prête pour la production.
    -   Exécutez la commande de build dans le terminal de votre environnement de développement :
        ```bash
        npm run build
        ```
    -   Cela créera un dossier `dist` (par défaut pour Vite) contenant tous les fichiers optimisés et minifiés.

2.  **Connexion au cPanel:**
    -   Connectez-vous à votre interface cPanel via l'URL fournie.
    -   Accédez au "Gestionnaire de fichiers" (File Manager).

3.  **Téléchargement des fichiers:**
    -   Naviguez vers le répertoire `public_html` (ou le sous-répertoire de votre domaine).
    -   Supprimez tous les fichiers existants dans ce répertoire (sauf `index.php` ou d'autres fichiers essentiels de WordPress si vous déployez le frontend dans un sous-dossier de WordPress).
    -   Téléchargez le contenu du dossier `dist` (pas le dossier `dist` lui-même, mais son *contenu*) dans `public_html`. Vous pouvez le compresser en `.zip` localement et le décompresser sur cPanel pour faciliter le transfert.

4.  **Configuration du fichier `.htaccess` pour SPA (Single Page Application):**
    -   Créez ou modifiez le fichier `.htaccess` dans le répertoire `public_html`. Ce fichier est crucial pour que toutes les routes du frontend soient gérées par l'application React et non par le serveur.
    -   Ajoutez le code suivant :
        ```apache
        <IfModule mod_rewrite.c>
          RewriteEngine On
          RewriteBase /
          RewriteRule ^index\.html$ - [L]
          RewriteCond %{REQUEST_FILENAME} !-f
          RewriteCond %{REQUEST_FILENAME} !-d
          RewriteCond %{REQUEST_FILENAME} !-l
          RewriteRule . /index.html [L]
        </IfModule>
        ```

5.  **Configuration des Variables d'Environnement (VITE_):**
    -   Pour les variables `VITE_WP_API_URL`, `VITE_WP_AUTH_URL`, etc., elles sont "baked in" au moment du build avec Vite. Si elles doivent être modifiées après le build sans re-déployer, il faut les gérer via une API ou un fichier JSON dynamique, ce qui n'est pas le cas ici.
    -   Assurez-vous que les valeurs de ces variables sont correctes dans le fichier `.env` **avant** d'exécuter `npm run build`.

6.  **Switch `IS_MOCK = false`:**
    -   Si vous utilisez une variable d'environnement comme `VITE_IS_MOCK` pour basculer entre des données mockées et réelles, assurez-vous qu'elle est définie sur `false` (ou équivalent) dans votre `.env` de production avant le build.
    -   Exemple : `VITE_IS_MOCK=false`

**Checklist Post-Déploiement:**
-   [ ] Vider le cache du navigateur.
-   [ ] Tester toutes les pages du frontend.
-   [ ] Vérifier la connexion à l'API WordPress (consulter la console du navigateur pour les erreurs CORS ou réseau).
-   [ ] Tester l'authentification et l'accès à l'espace adhérent.
-   [ ] Vérifier le comportement de téléchargement des documents.
-   [ ] S'assurer que le contenu bilingue s'affiche correctement.

---

## Section 7 — Plugins

**Plugins WordPress prioritaires pour le backend:**
-   **ACF (Advanced Custom Fields):** Essentiel pour créer les champs personnalisés des CPTs.
-   **WP REST API (Core):** Pour exposer les données via l'API REST.
-   **JWT Authentication for WP REST API:** Pour gérer l'authentification sécurisée des utilisateurs du frontend.
-   **CPT UI (Custom Post Type UI):** Pour créer et gérer facilement les Custom Post Types.
-   **WP REST API Cache:** Pour améliorer les performances de l'API.
-   **WP Super Cache / LiteSpeed Cache:** Pour la mise en cache globale du site WordPress.
-   **Smush / Imagify:** Pour l'optimisation des images.

**Code JWT à ajouter dans `wp-config.php`:**
Pour la sécurité et la configuration du plugin JWT, vous devrez ajouter les lignes suivantes à votre fichier `wp-config.php` de WordPress:

```php
/**
 * JWT Authentication for WP REST API
 */
define('JWT_AUTH_SECRET_KEY', 'YOUR_SUPER_STRONG_SECRET_KEY_HERE_CHANGE_THIS');
define('JWT_AUTH_CORS_ENABLE', true);
```
**N'oubliez pas de remplacer `YOUR_SUPER_STRONG_SECRET_KEY_HERE_CHANGE_THIS` par une clé secrète unique et très forte.**

---

## Section 8 — Planning semaine 3

**Qui fait quoi:**
-   **Développeur Backend (votre équipe):**
    -   Mettre en place le serveur WordPress sur cPanel.
    -   Installer et configurer les plugins (ACF, CPT UI, JWT Auth, etc.).
    -   Créer tous les CPTs et les champs ACF listés dans la Section 4.
    -   Implémenter les 7 endpoints REST API avec le format attendu.
    -   Configurer le CORS dans `functions.php` (Section 3).
    -   Fournir les URL et identifiants cPanel, le domaine et les valeurs `.env` (Section 2).
-   **Développeur Frontend (moi):**
    -   Mettre à jour les `downloadLink` dans le code avec les URLs réelles des documents.
    -   Connecter les services frontend aux endpoints API WordPress réels.
    -   Effectuer des tests d'intégration.
    -   Déployer l'application React sur cPanel une fois le backend prêt.
-   **Client:**
    -   Saisir le contenu bilingue dans WordPress via le tableau de bord (actualités, services, documents, etc.).

**Durée estimée pour les tâches backend (estimation brute):**
-   Mise en place WP et plugins: 0.5 jour
-   Création CPTs et ACFs: 1 jour
-   Implémentation Endpoints API: 2-3 jours
-   Configuration CORS et JWT: 0.5 jour
-   Tests et ajustements: 1 jour
**Total estimé Backend: ~5-6 jours**

**Point de synchronisation obligatoire:**
-   Organiser un point de synchronisation quotidien ou bi-quotidien (ex: 15-30 minutes) entre le développeur Frontend et le développeur Backend pour discuter de l'avancement, résoudre les blocages et valider les formats de données API. Une réunion hebdomadaire plus longue pour un bilan général et le planning à venir.

---
