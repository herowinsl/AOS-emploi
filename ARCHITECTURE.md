# 🏗️ AOS-Emploi System Architecture

**Visual guide to how your CMS backend and React frontend work together**

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  REACT FRONTEND (Headless Client)                              │   │
│  │  • Home page with services                                      │   │
│  │  • News articles (actualités)                                   │   │
│  │  • User authentication forms                                    │   │
│  │  • Member dashboard                                             │   │
│  │  • Service request forms                                        │   │
│  │                                                                  │   │
│  │  Technology:                                                    │   │
│  │  • React + Vite                                                 │   │
│  │  • Bilingual (FR/AR)                                            │   │
│  │  • API client: Axios                                            │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                              ↕                                           │
│                   HTTP REST API Requests/Responses                       │
│                              ↕                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                    INTERNET (HTTPS Encrypted)
                                 │
┌─────────────────────────────────────────────────────────────────────────┐
│                      WORDPRESS BACKEND (CMS)                             │
│                     (Hosted on cPanel Server)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  REST API Endpoints (/wp-json/)                                 │  │
│  │                                                                   │  │
│  │  Public Endpoints (no auth):                                     │  │
│  │  • GET /wp/v2/services         → List all services              │  │
│  │  • GET /wp/v2/actualites       → List all news                  │  │
│  │  • GET /wp/v2/chiffres         → List statistics                │  │
│  │  • GET /wp/v2/documents        → List PDFs                      │  │
│  │                                                                   │  │
│  │  Auth Endpoints:                                                 │  │
│  │  • POST /aos/v1/register       → New user registration           │  │
│  │  • POST /aos/v1/login          → User login (unique_key)         │  │
│  │                                                                   │  │
│  │  Protected Endpoints (Bearer token required):                    │  │
│  │  • GET /aos/v1/me              → Get user profile               │  │
│  │  • POST /aos/v1/demandes       → Submit service request         │  │
│  │  • GET /aos/v1/demandes        → Get user requests              │  │
│  │  • GET /aos/v1/documents       → Get documents                  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                 ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  WordPress Plugins (PHP Code)                                   │  │
│  │                                                                   │  │
│  │  1. aos-backend-plugin.php                                      │  │
│  │     • Registers API endpoints                                    │  │
│  │     • Handles authentication                                     │  │
│  │     • Manages tokens                                             │  │
│  │     • Returns JSON responses                                     │  │
│  │                                                                   │  │
│  │  2. aos-cpt-plugin.php                                          │  │
│  │     • Creates Custom Post Types:                                │  │
│  │       - aos_services                                             │  │
│  │       - aos_actualites                                           │  │
│  │       - aos_chiffres                                             │  │
│  │       - aos_documents                                            │  │
│  │     • Registers ACF Fields (FR/AR bilingual)                    │  │
│  │     • Appears in WordPress Dashboard                             │  │
│  │                                                                   │  │
│  │  3. aos-rest-filters.php                                        │  │
│  │     • Formats ACF fields for API                                │  │
│  │     • Adds computed data                                         │  │
│  │     • Returns featured images                                    │  │
│  │                                                                   │  │
│  │  4. aos-admin-management-plugin.php (Optional)                  │  │
│  │     • Admin dashboard for user approvals                         │  │
│  │     • Manage whitelist                                           │  │
│  │     • Generate unique keys                                       │  │
│  │     • Track requests                                             │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                 ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  WordPress Admin Dashboard                                      │  │
│  │                                                                   │  │
│  │  Admin Interface to:                                             │  │
│  │  • Create/Edit Services                                          │  │
│  │  • Create/Edit Articles (Actualités)                             │  │
│  │  • Create Statistics (Chiffres Clés)                             │  │
│  │  • Upload Documents (PDFs)                                       │  │
│  │  • Approve/Reject users (with management plugin)                │  │
│  │  • Generate unique access keys                                   │  │
│  │  • View service requests                                         │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                 ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Database (MySQL/MariaDB)                                       │  │
│  │                                                                   │  │
│  │  WordPress Tables (wp_*):                                        │  │
│  │  • wp_posts          → Content items                             │  │
│  │  • wp_postmeta       → Custom field data                         │  │
│  │  • wp_users          → WordPress admin users                     │  │
│  │                                                                   │  │
│  │  AOS Custom Tables (aos_*):                                      │  │
│  │  • aos_verified_employees → Email whitelist                      │  │
│  │  • aos_adherents           → User accounts                       │  │
│  │  • aos_demandes            → Service requests                    │  │
│  │                                                                   │  │
│  │  Storage:                                                         │  │
│  │  • utf8mb4 encoding (supports Arabic)                            │  │
│  │  • Foreign keys for data integrity                               │  │
│  │  • Indexes for fast queries                                      │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Service Display Flow

```
Frontend User         Frontend App         WordPress API      Database
    │                     │                      │                 │
    │  Browse site        │                      │                 │
    └────────────────────→│                      │                 │
    │                     │  GET /wp/v2/services │                 │
    │                     │─────────────────────→│                 │
    │                     │                      │  SELECT * FROM  │
    │                     │                      │  wp_posts where │
    │                     │                      │  post_type =    │
    │                     │                      │  'aos_services' │
    │                     │                      ├────────────────→│
    │                     │                      │  ← Results      │
    │                     │  ← JSON Response     │←────────────────┤
    │  ← Display services │  with ACF fields     │                 │
    │←────────────────────│                      │                 │
    │                     │                      │                 │

Response Example:
{
  "id": 1,
  "title": { "rendered": "..." },
  "acf": {
    "titre_fr": "Aide d'Urgence",
    "titre_ar": "مساعدة الطوارئ",
    "description_fr": "...",
    "description_ar": "...",
    "icone_url": "..."
  },
  "slug": "aide-urgence"
}
```

### 2. Authentication Flow

```
User                Frontend            WordPress API       Database
 │                      │                      │                 │
 │  Enter email & key   │                      │                 │
 └─────────────────────→│                      │                 │
 │                      │  POST /aos/v1/login  │                 │
 │                      │─────────────────────→│                 │
 │                      │                      │  Verify email   │
 │                      │                      │  & unique_key   │
 │                      │                      │                 │
 │                      │                      │  SELECT * FROM  │
 │                      │                      │  aos_adherents  │
 │                      │                      │  WHERE email = ?│
 │                      │                      ├────────────────→│
 │                      │                      │  ← User record  │
 │                      │                      │←────────────────┤
 │                      │                      │                 │
 │                      │                      │  Generate token │
 │                      │                      │  Save to DB     │
 │                      │                      │                 │
 │                      │                      │  UPDATE         │
 │                      │                      │  aos_adherents  │
 │                      │                      │  SET token=?... │
 │                      │                      ├────────────────→│
 │                      │  ← Token + User data │←────────────────┤
 │  ← Login successful  │←────────────────────│                 │
 │ Store token locally  │                      │                 │
 │←────────────────────→│                      │                 │

Response:
{
  "token": "a1b2c3d4e5...",
  "user": {
    "id": 1,
    "nom": "John Doe",
    "email": "john@emploi.gov.ma",
    "lieu_travail": "Casablanca"
  }
}
```

### 3. Service Request Submission Flow

```
Authenticated User   Frontend            API              Database
       │                 │                │                    │
       │  Fill form      │                │                    │
       └────────────────→│                │                    │
       │                 │  POST /aos/v1/ │                    │
       │                 │  demandes      │                    │
       │                 │ + Bearer token │                    │
       │                 │────────────────→│                    │
       │                 │                │ Verify token       │
       │                 │                │ (check expiry)     │
       │                 │                │                    │
       │                 │                │ SELECT * FROM      │
       │                 │                │ aos_adherents      │
       │                 │                │ WHERE token = ?    │
       │                 │                ├───────────────────→│
       │                 │                │ ← User found       │
       │                 │                │←───────────────────┤
       │                 │                │                    │
       │                 │                │ INSERT INTO        │
       │                 │                │ aos_demandes       │
       │                 │                │ (form_data...)     │
       │                 │                ├───────────────────→│
       │                 │  ← Success      │←───────────────────┤
       │  ← Request sent │←────────────────│                    │
       │                 │                │                    │

Request Example:
POST /aos/v1/demandes
Authorization: Bearer a1b2c3d4e5...
Content-Type: application/json

{
  "type": "aid",
  "sujet": "Emergency Financial Assistance",
  "rib": "...",
  "montant": 5000,
  "raison": "..."
}

Response:
{
  "success": true,
  "id": "REQ-001"
}
```

---

## File Organization

### Frontend Structure
```
react-project/
├── src/
│   ├── components/
│   │   ├── Home/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ServicesSection.jsx (← fetches from /wp/v2/services)
│   │   │   ├── ActualitesSection.jsx (← fetches from /wp/v2/actualites)
│   │   │   └── ChiffresCles.jsx (← fetches from /wp/v2/chiffres)
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx (← calls POST /aos/v1/login)
│   │   │   └── RegisterForm.jsx (← calls POST /aos/v1/register)
│   │   │
│   │   └── espace-adherent/
│   │       ├── DemandesSection.jsx (← calls /aos/v1/demandes)
│   │       └── DocumentsSection.jsx (← calls /aos/v1/documents)
│   │
│   ├── services/
│   │   ├── api.js (← Base URL configuration)
│   │   └── authAPI.js (← Auth endpoints)
│   │
│   ├── context/
│   │   └── AuthContext.jsx (← Manages user state)
│   │
│   ├── hooks/
│   │   ├── usePosts.js
│   │   ├── useServices.js
│   │   ├── usePosts.js
│   │   └── useAuth.js
│   │
│   └── .env (← Configuration)
│       ├── VITE_WP_API_URL=https://backend.com/wp-json
│       └── VITE_AOS_API_URL=https://backend.com/wp-json/aos/v1
│
```

### Backend Structure (cPanel)
```
public_html/
├── .htaccess (← CORS headers)
│
├── wp-config.php
│   ├── DB_NAME
│   ├── DB_USER
│   └── DB_PASSWORD
│
├── wp-content/
│   └── plugins/
│       ├── aos-emploi-backend/
│       │   └── aos-backend-plugin.php (← Auth & Demandes)
│       │
│       ├── aos-cpt-plugin.php (← Content types)
│       │
│       ├── aos-rest-filters.php (← API formatting)
│       │
│       └── aos-admin-management-plugin.php (← Admin dashboard)
│
└── (WordPress standard files)

Database (phpMyAdmin):
├── wp_* tables (WordPress)
│   ├── wp_posts
│   ├── wp_postmeta
│   └── wp_users
│
└── aos_* tables (Custom)
    ├── aos_verified_employees (Email whitelist)
    ├── aos_adherents (User accounts)
    └── aos_demandes (Service requests)
```

---

## API Request/Response Examples

### Example 1: Fetch Services
```bash
# Request
GET https://backend.com/wp-json/wp/v2/services

# Response
[
  {
    "id": 1,
    "title": { "rendered": "Aide d'Urgence" },
    "acf": {
      "titre_fr": "Aide d'Urgence",
      "titre_ar": "مساعدة الطوارئ",
      "description_fr": "Assistance financière en urgence",
      "description_ar": "المساعدة المالية العاجلة",
      "icone_url": "https://...",
      "slug": "aide-urgence"
    },
    "featured_image": "https://..."
  }
]
```

### Example 2: User Registration
```bash
# Request
POST https://backend.com/wp-json/aos/v1/register
Content-Type: application/json

{
  "email": "user@emploi.gov.ma",
  "nom": "Mohamed Ali",
  "telephone": "+212600000000",
  "lieu_travail": "Casablanca"
}

# Response (Success)
{
  "success": true,
  "message": "Demande envoyée."
}

# Response (Error - not in whitelist)
{
  "code": "access_denied",
  "message": "Email non autorisé."
}
```

### Example 3: User Login
```bash
# Request
POST https://backend.com/wp-json/aos/v1/login
Content-Type: application/json

{
  "email": "user@emploi.gov.ma",
  "unique_key": "AOS-2026-ABC123"
}

# Response (Success)
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "nom": "Mohamed Ali",
    "email": "user@emploi.gov.ma",
    "lieu_travail": "Casablanca"
  }
}

# Response (Error)
{
  "code": "auth_failed",
  "message": "Identifiants incorrects."
}
```

### Example 4: Get Protected Resource (with token)
```bash
# Request
GET https://backend.com/wp-json/aos/v1/me
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

# Response
{
  "nom": "Mohamed Ali",
  "email": "user@emploi.gov.ma",
  "lieu_travail": "Casablanca",
  "unique_key": "AOS-2026-ABC123",
  "status": "approved"
}
```

---

## Technology Stack

### Frontend
```
React 18+
├── UI Framework
├── Vite (build tool)
├── React Router (navigation)
├── Axios (HTTP requests)
├── Tailwind CSS (styling)
└── Bilingual Support (FR/AR)
```

### Backend
```
WordPress 6.0+
├── PHP 7.4+
├── MySQL/MariaDB
├── ACF Pro (Advanced Custom Fields)
├── Custom REST API
└── Plugins (PHP)
    ├── aos-backend-plugin.php
    ├── aos-cpt-plugin.php
    ├── aos-rest-filters.php
    └── aos-admin-management-plugin.php
```

### Hosting
```
cPanel Server
├── Apache/Nginx
├── PHP
├── MySQL/MariaDB
├── SSL/HTTPS
└── File Manager & phpMyAdmin
```

---

## Security Architecture

```
Security Layers:

┌─────────────────────────────────────────┐
│  Layer 1: HTTPS Encryption               │
│  All API calls encrypted in transit       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Layer 2: CORS Protection                │
│  Only allow requests from authorized     │
│  frontend domains                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Layer 3: Email Whitelist                │
│  Only whitelisted emails can register    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Layer 4: Bearer Token Auth              │
│  Protected endpoints require valid token │
│  24-hour session expiry                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Layer 5: Database Validation            │
│  Input sanitization & SQL parameterized │
│  Foreign key constraints                 │
└─────────────────────────────────────────┘
```

---

## Deployment Architecture

```
Production Setup:

┌──────────────────────────────────────────────────┐
│          Internet / Domain Names                  │
├──────────────────────────────────────────────────┤
│  frontend.yourdomaine.com ─→ Frontend Hosting    │
│  backend.yourdomaine.com ──→ cPanel Server       │
└──────────────────────────────────────────────────┘
         ↓                            ↓
┌────────────────────────┐  ┌────────────────────────┐
│  Frontend Deployment   │  │   cPanel Server        │
├────────────────────────┤  ├────────────────────────┤
│ • React Build          │  │ • WordPress            │
│ • Static files (HTML,  │  │ • Database (MySQL)     │
│   CSS, JS)             │  │ • Plugins (PHP)        │
│ • .env configuration   │  │ • Mail server          │
│ • API calls to         │  │ • File storage         │
│   backend.yourdomaine  │  │ • SSL certificate      │
└────────────────────────┘  └────────────────────────┘
         ↓                            ↓
    Browser Cache             Database Backups
    CDN (optional)            Regular updates
    Analytics                 Monitoring
```

---

## Summary

**Your AOS-Emploi system is:**
- ✅ **Headless CMS** - Content managed in WordPress, displayed anywhere
- ✅ **Bilingual** - Full FR/AR support in all content
- ✅ **Secure** - Multiple authentication layers
- ✅ **Scalable** - REST API can serve multiple frontends
- ✅ **Maintainable** - Easy admin interface in WordPress Dashboard
- ✅ **Production-ready** - All components tested and documented

---

**Version:** 1.0  
**Last Updated:** April 2026  
**For:** AOS-Emploi CMS Architecture

