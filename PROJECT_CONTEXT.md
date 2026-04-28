# PROJECT CONTEXT DOCUMENT — AOS EMPLOI

---

## Section 0 — Résumé exécutif & État du Projet

**État actuel du Frontend :** 
L'application est en phase de **finalisation avancée**. Un audit UI/UX complet a été réalisé, suivi d'une phase d'optimisation majeure. Le code est désormais épuré, performant et conforme aux standards modernes de développement React.

**Réalisations récentes (Phase d'Optimisation) :**
- **Refonte UI/UX :** Amélioration de la cohérence visuelle, polissage des animations (Framer Motion) et optimisation de la responsivité mobile-first.
- **Support RTL (Arabe) :** Correction des problèmes d'affichage numérique et de directionnalité pour une expérience bilingue fluide.
- **Nettoyage Technique :** Suppression des dépendances inutiles (Flowbite, Hugeicons) pour un bundle plus léger et une maintenance simplifiée.
- **Design System :** Unification des composants (Navbar, Footer, Switchers) avec une esthétique "Premium Glassmorphism".

**Prochaine étape critique :** Transition du mode "Mock" vers l'intégration réelle du backend WordPress (API REST).

---

## Section 1 — État d'avancement & Livrables

### Tableau des pages (Architecture logicielle complète)

| Page                                  | Route                      | Statut   | Bilingue | Description Technique                                              |
| :------------------------------------ | :------------------------- | :------- | :------- | :------------------------------------------------------------------ |
| Accueil                               | `/`                        | Validé   | Oui      | Sections dynamiques : Hero, Chiffres Clés (animés), Actualités, Prestations. |
| Statuts                               | `/about/statuts`           | Validé   | Oui      | Gestion du contenu textuel complexe bilingue.                      |
| Règlement Intérieur                    | `/about/reglement`         | Validé   | Oui      | Structure hiérarchique optimisée pour la lecture.                 |
| Le Bureau                             | `/about/bureau`            | Validé   | Oui      | Grille interactive des membres avec animations d'entrée.           |
| Services                              | `/services`                | Validé   | Oui      | Catalogue de prestations avec filtres et recherche.               |
| Détail Service                        | `/services/:slug`          | Validé   | Oui      | Page dynamique générée via slug.                                   |
| Actualités                            | `/actualites`              | Validé   | Oui      | Flux d'informations avec gestion des fallbacks d'images.           |
| Détail Actualité                      | `/actualites/:slug`        | Validé   | Oui      | Article complet avec mise en page riche.                          |
| Contact                               | `/contact`                 | Validé   | Oui      | Formulaire avec validation et feedback utilisateur (Sonner).       |
| Authentification                      | `/auth`                    | Validé   | Oui      | Logique de connexion/inscription sécurisée.                        |
| Espace Adhérent                       | `/espace-adherent`         | Validé   | Oui      | Dashboard sécurisé, gestion de documents et profil.                |

### Stack Technique Optimisée

- **Framework :** React 18 (Vite)
- **Styling :** Tailwind CSS 3.4 (Architecture modulaire)
- **Animations :** Framer Motion (Transitions fluides et micro-interactions)
- **Icônes :** Lucide-React (Unified set)
- **Notifications :** Sonner (Notifications premium)
- **Routing :** React Router 7
- **Internationalisation :** LangContext (Custom hooks pour gestion RTL/LTR)

---

## Section 2 — Guide d'Intégration Backend

### Variables d'environnement (.env)
Le passage à la production nécessite la configuration suivante :
- `VITE_WP_API_URL` : URL de base de l'API WordPress.
- `VITE_IS_MOCK` : Basculer à `false` pour activer les données réelles.

### Configuration CORS (Nécessaire pour le domaine)
Le serveur WordPress doit autoriser les requêtes provenant du domaine frontend :
```php
header('Access-Control-Allow-Origin: https://votre-domaine-frontend.com');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
```

---

## Section 3 — Structure WordPress (ACF & CPT)

Le frontend est architecturé pour consommer des **Custom Post Types** spécifiques. Pour l'internat/rapport, voici la structure de données implémentée :

1. **CPT "Services"**
   - Champs : Icône (SVG/URL), Titre FR/AR, Description courte FR/AR, Contenu riche.
2. **CPT "Actualités"**
   - Champs : Image mise en avant, Date, Titre FR/AR, Corps de l'article FR/AR.
3. **CPT "Chiffres Clés"**
   - Champs : Valeur numérique, Suffixe, Label FR/AR.
4. **CPT "Documents"**
   - Champs : Fichier PDF, Catégorie, Titre FR/AR.

---

## Section 4 — Méthodologie & Qualité (Internship Focus)

*Cette section est cruciale pour le rapport de stage.*

- **Mobile-First Design :** Toute l'interface a été conçue pour garantir une accessibilité parfaite sur smartphone (Audit Lighthouse effectué).
- **Accessibilité (A11y) :** Utilisation de balises sémantiques HTML5, gestion des attributs `aria` et support complet de la navigation clavier.
- **Optimisation de la Performance :**
    - Suppression des bibliothèques redondantes.
    - Lazy loading des routes et images.
    - Utilisation de `useMemo` et `useCallback` pour stabiliser les rendus React.
- **Gestion des Erreurs :** Implémentation de "Skeleton Screens" pour le chargement et de "Fallbacks" pour les images manquantes ou erreurs API.

---

## Section 5 — Planning de Livraison Final

1. **Semaine 1 (Backend) :** Configuration cPanel, installation WordPress, création des CPTs/ACF.
2. **Semaine 2 (Intégration) :** Connexion des endpoints axios, tests de montée en charge.
3. **Semaine 3 (Déploiement) :** Build final, configuration `.htaccess`, mise en production.

---

**Note pour Claude/Internship Report :** Ce document résume l'effort d'ingénierie fourni pour transformer une maquette en une application web industrielle, bilingue et hautement performante.
