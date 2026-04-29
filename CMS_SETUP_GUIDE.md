# 🚀 AOS-Emploi CMS Backend Setup Guide

**Complete guide for setting up the WordPress CMS backend and linking it to your React headless frontend**

---

## 📋 Table of Contents

1. [Backend Architecture Overview](#backend-architecture-overview)
2. [Files You Already Have](#files-you-already-have)
3. [Additional Backend Files to Create](#additional-backend-files-to-create)
4. [Step-by-Step Setup Instructions](#step-by-step-setup-instructions)
5. [Frontend Integration](#frontend-integration)
6. [Testing & Validation](#testing--validation)
7. [Troubleshooting](#troubleshooting)

---

## Backend Architecture Overview

Your AOS-Emploi project uses a **headless CMS architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vue.js)                   │
│         Handles UI, routing, and user interactions            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP REST API calls
                     ↓
┌─────────────────────────────────────────────────────────────┐
│         WORDPRESS CMS BACKEND (Headless)                      │
│  • Custom REST APIs for Auth & Demandes                       │
│  • Custom Post Types (Services, Actualités, Documents)        │
│  • ACF Fields for bilingual content (FR/AR)                   │
│  • Database for adherents, whitelist, requests                │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- ✅ Bilingual content (French + Arabic)
- ✅ Custom authentication with token-based sessions
- ✅ Demandes (requests) management system
- ✅ Document management for PDFs
- ✅ Easy admin interface (WordPress Dashboard)

---

## Files You Already Have

### ✅ Backend Files in `/backend-files/` folder:

| File | Purpose | Status |
|------|---------|--------|
| `schema.sql` | Database tables setup | ✅ Ready |
| `aos-backend-plugin.php` | Auth API + Demandes endpoints | ✅ Ready |
| `aos-cpt-plugin.php` | Custom Post Types + ACF fields | ✅ Ready |
| `aos-rest-filters.php` | Expose ACF fields to REST API | ✅ Ready |

### ✅ Frontend Integration Files:

| File | Purpose | Status |
|------|---------|--------|
| `src/services/api.js` | API client configuration | ✅ Ready |
| `src/context/AuthContext.jsx` | Auth state management | ✅ Ready |
| `src/hooks/useAuth.js` | Auth hook | ✅ Ready |
| `src/hooks/usePosts.js` | Fetch blog posts | ✅ Ready |
| `src/hooks/useServices.js` | Fetch services | ✅ Ready |

---

## Additional Backend Files to Create

Based on your current setup, here are the **recommended additional files** to create for production:

### 1. **`.htaccess` (CORS Configuration)**
Location: `public_html/.htaccess`

This file controls CORS headers and rewrites for your WordPress installation.

**Create new file:**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# CORS Headers for Headless CMS
<IfModule mod_headers.c>
    # Replace YOUR_FRONTEND_DOMAIN with your actual frontend URL
    Header set Access-Control-Allow-Origin "https://frontend.yourdomaine.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With, Accept"
    Header set Access-Control-Max-Age "3600"
    Header set Access-Control-Allow-Credentials "true"
</IfModule>
```

**Edit in cPanel:**
- File Manager → public_html
- Create/Edit `.htaccess`
- Replace `YOUR_FRONTEND_DOMAIN` with your actual domain

---

### 2. **`wp-config-production.php` (Optional - for production)**
Location: `public_html/wp-config-production.php`

Alternate configuration for production environment with added security settings.

**Create new file:**

```php
<?php
/**
 * Production Configuration for AOS-Emploi
 * Copy relevant settings to wp-config.php when deploying
 */

// Database Configuration (from cPanel)
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_db_user');
define('DB_PASSWORD', 'your_db_password');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', 'utf8mb4_unicode_ci');

// Security
define('AUTH_KEY',         'put your unique phrase here');
define('SECURE_AUTH_KEY',  'put your unique phrase here');
define('LOGGED_IN_KEY',    'put your unique phrase here');
define('NONCE_KEY',        'put your unique phrase here');
define('AUTH_SALT',        'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT',   'put your unique phrase here');
define('NONCE_SALT',       'put your unique phrase here');

// Debug (set to false in production)
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// REST API
define('REST_API_ENABLED', true);

// WordPress table prefix
$table_prefix = 'wp_';
```

---

### 3. **`admin-setup-manual.md` (Admin Setup Instructions)**
Location: `backend-files/admin-setup-manual.md`

Detailed checklist for WordPress admin to create content after plugin installation.

---

### 4. **`migration-script.sql` (Optional - for updating existing DB)**
Location: `backend-files/migration-v2.sql`

If you need to add new tables or fields later, use migration files instead of modifying schema.sql.

---

### 5. **`environment-variables.md` (Documentation)**
Location: `backend-files/environment-variables.md`

Documents all environment variables needed for full integration.

**Create new file:**

```markdown
# Environment Variables for AOS-Emploi

## Frontend (.env)

```env
# CMS API
VITE_WP_API_URL=https://backend.yourdomaine.com/wp-json
VITE_AOS_API_URL=https://backend.yourdomaine.com/wp-json/aos/v1

# Features
VITE_IS_MOCK=false
VITE_ENABLE_AUTH=true

# Language
VITE_DEFAULT_LANG=fr

# API Timeouts
VITE_API_TIMEOUT=8000
```

## Backend (wp-config.php)

```php
// Database
define('DB_NAME', 'database_name');
define('DB_USER', 'db_user');
define('DB_PASSWORD', 'db_password');
define('DB_HOST', 'localhost');

// CORS Origin (update in .htaccess)
// Header set Access-Control-Allow-Origin "https://your-frontend.com"

// REST API
define('REST_API_ENABLED', true);
```

## cPanel Settings

- **Database:** aos_* prefix for custom tables
- **SSL:** Enabled (https://)
- **PHP Version:** 7.4+ (supports ACF plugins)
- **Apache Modules:** mod_headers, mod_rewrite enabled
```

---

## Step-by-Step Setup Instructions

### Phase 1: Database Setup (5 minutes)

#### 1.1 Execute schema.sql

```bash
1. Go to cPanel → phpMyAdmin
2. Select your WordPress database
3. Click "Import" tab
4. Upload backend-files/schema.sql
5. Click "Go"
```

**Verify Tables Created:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema='your_database' AND table_name LIKE 'aos_%';
```

Expected output:
- `aos_adherents`
- `aos_demandes`
- `aos_verified_employees`

---

### Phase 2: Install WordPress Plugins (10 minutes)

#### 2.1 Upload Backend Plugin

**Option A: Via FTP/File Manager**

```
1. Extract/prepare: aos-backend-plugin.php
2. Create folder: wp-content/plugins/aos-emploi-backend/
3. Upload file to: wp-content/plugins/aos-emploi-backend/aos-backend-plugin.php
```

**Option B: Via Dashboard**

```
1. WordPress Dashboard → Plugins → Add New
2. Upload Plugin (manually upload aos-backend-plugin.php)
3. Activate Plugin
```

#### 2.2 Upload CPT Plugin

```
1. File Manager → wp-content/plugins/
2. Upload aos-cpt-plugin.php directly here
3. Dashboard → Plugins → Activate "AOS Custom Post Types & ACF Fields"
```

#### 2.3 Upload REST Filters Plugin

```
1. File Manager → wp-content/plugins/
2. Upload aos-rest-filters.php directly here
3. Dashboard → Plugins → Activate "AOS REST API Filters"
```

#### 2.4 Verify Plugins Are Active

Go to Dashboard → Plugins and confirm these 3 are enabled:
- ✅ AOS-Emploi Backend System
- ✅ AOS Custom Post Types & ACF Fields
- ✅ AOS REST API Filters

---

### Phase 3: Configure CORS (5 minutes)

#### 3.1 Edit .htaccess

**In cPanel File Manager:**

```
1. Go to: public_html/
2. Show Hidden Files (gear icon → Show Hidden Files)
3. Edit .htaccess (or create if doesn't exist)
4. Replace/add these lines:

<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://your-frontend-url.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
</IfModule>
```

**Replace:** `https://your-frontend-url.com` with your actual frontend URL (with https://)

#### 3.2 Test CORS

```bash
curl -I https://your-backend.com/wp-json/ \
  -H "Origin: https://your-frontend.com"
```

Look for in response:
```
Access-Control-Allow-Origin: https://your-frontend.com
```

---

### Phase 4: Create Content (15 minutes)

#### 4.1 Add Services

```
Dashboard → Services → Add New Service
- Titre (FR): Aide d'Urgence
- Titre (AR): مساعدة الطوارئ
- Description (FR): Assistance financière d'urgence
- Description (AR): مساعدة مالية طارئة
- URL Icône: https://example.com/icons/aid.svg
- Slug: aide-urgence
- Publish
```

Repeat for: Prêt, Estivage, Autres services

#### 4.2 Add Actualités (Articles)

```
Dashboard → Actualités → Add New
- Titre (FR): Assemblée Générale 2026
- Titre (AR): الجمعية العامة 2026
- Extrait (FR): Participez à notre AG annuelle
- Slug: ag-2026
- Auteur: Admin
- Date: [Choose date]
- Featured Image: [Upload image]
- Publish
```

#### 4.3 Add Chiffres Clés (Statistics)

```
Dashboard → Chiffres Clés → Add New
- Valeur: 5000
- Suffixe: +
- Label (FR): Membres Actifs
- Label (AR): أعضاء نشطون
- Publish
```

#### 4.4 Add Documents

```
Dashboard → Documents → Add New
- Fichier PDF: [Upload PDF]
- Catégorie: Statuts
- Titre (FR): Statuts de l'AOS
- Titre (AR): قواعس الجمعية
- Description (FR): Statuts officiels
- Publish
```

---

### Phase 5: Test Backend APIs (10 minutes)

#### 5.1 Test Services Endpoint

```bash
curl "https://your-backend.com/wp-json/wp/v2/services" | jq '.[0]'
```

Expected response:
```json
{
  "id": 1,
  "title": "Service Title",
  "acf": {
    "titre_fr": "Aide d'Urgence",
    "titre_ar": "مساعدة الطوارئ",
    "description_fr": "...",
    "description_ar": "...",
    "icone_url": "..."
  }
}
```

#### 5.2 Test Registration (Create User)

```bash
curl -X POST "https://your-backend.com/wp-json/aos/v1/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@emploi.gov.ma",
    "nom": "Test User",
    "telephone": "0600000000",
    "lieu_travail": "Casablanca"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Demande envoyée."
}
```

#### 5.3 Test Login

First, admin must approve user and generate unique_key in Dashboard.

```bash
curl -X POST "https://your-backend.com/wp-json/aos/v1/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@emploi.gov.ma",
    "unique_key": "AOS-2026-ABC123"
  }'
```

**Response:**
```json
{
  "token": "a1b2c3d4e5...",
  "user": {
    "id": 1,
    "nom": "Test User",
    "email": "test@emploi.gov.ma"
  }
}
```

#### 5.4 Test Protected Endpoint (Get Profile)

```bash
TOKEN="a1b2c3d4e5..."

curl "https://your-backend.com/wp-json/aos/v1/me" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Frontend Integration

### Update Your React Frontend `.env`

**File:** `.env` in your React project root

```env
# CMS API Configuration
VITE_WP_API_URL=https://your-backend.com/wp-json
VITE_AOS_API_URL=https://your-backend.com/wp-json/aos/v1

# Feature Flags
VITE_IS_MOCK=false
VITE_ENABLE_AUTH=true

# Default Language
VITE_DEFAULT_LANG=fr

# API Settings
VITE_API_TIMEOUT=8000
```

### Update Your API Client

**File:** `src/services/api.js`

```javascript
import axios from "axios";

// Check if using mock data
export const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';

const WP_BASE = import.meta.env.VITE_WP_API_URL;
const AOS_BASE = import.meta.env.VITE_AOS_API_URL;

// WordPress API client (for posts, services, etc.)
export const wpApi = axios.create({
  baseURL: WP_BASE,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '8000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// AOS Custom API client (for auth, demandes)
export const aosApi = axios.create({
  baseURL: AOS_BASE,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '8000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
aosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('aos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  // WordPress standard endpoints
  services: "/wp/v2/services",
  actualites: "/wp/v2/actualites",
  chiffres: "/wp/v2/chiffres",
  documents: "/wp/v2/documents",
  
  // AOS custom endpoints
  auth: {
    register: "/aos/v1/register",
    login: "/aos/v1/login",
    me: "/aos/v1/me",
  },
  demandes: {
    list: "/aos/v1/demandes",
    create: "/aos/v1/demandes",
  },
};
```

### Update Auth Context

**File:** `src/context/AuthContext.jsx`

```jsx
import { createContext, useState, useCallback } from 'react';
import { aosApi } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (email, nom, telephone, lieu_travail) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aosApi.post('/aos/v1/register', {
        email,
        nom,
        telephone,
        lieu_travail,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, unique_key) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aosApi.post('/aos/v1/login', {
        email,
        unique_key,
      });
      
      // Store token
      localStorage.setItem('aos_token', response.data.token);
      
      // Store user
      setUser(response.data.user);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aos_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Testing & Validation

### Checklist Before Going Live

- [ ] Database tables created (3 tables with aos_ prefix)
- [ ] All 3 WordPress plugins installed and activated
- [ ] CORS configured in .htaccess with correct domain
- [ ] At least 5 Services created
- [ ] At least 5 Actualités created
- [ ] At least 3 Chiffres Clés created
- [ ] At least 2 Documents uploaded
- [ ] All API endpoints tested with curl
- [ ] Frontend .env file configured
- [ ] Frontend can fetch services endpoint
- [ ] Registration endpoint works
- [ ] Login endpoint works (after admin approval)
- [ ] Token-based authentication works
- [ ] Frontend displays real data (not mocks)

### Quick Test Script

```bash
#!/bin/bash

BACKEND="https://your-backend.com"
FRONTEND="https://your-frontend.com"

echo "Testing Services endpoint..."
curl -s "$BACKEND/wp-json/wp/v2/services" | jq '.[] | {title: .title.rendered, slug: .slug}'

echo "Testing Actualités endpoint..."
curl -s "$BACKEND/wp-json/wp/v2/actualites" | jq '.[] | {title: .title.rendered}'

echo "Testing Chiffres Clés endpoint..."
curl -s "$BACKEND/wp-json/wp/v2/chiffres" | jq '.[] | {value: .acf.valeur, label: .acf.label_fr}'

echo "Testing CORS..."
curl -I "$BACKEND/wp-json/" \
  -H "Origin: $FRONTEND" | grep "Access-Control-Allow-Origin"
```

---

## Troubleshooting

### ❌ "Services not showing in API response"

**Solution:**
1. Verify all 3 plugins are activated: Dashboard → Plugins
2. Ensure at least 1 Service is published: Dashboard → Services
3. Test endpoint: `https://backend.com/wp-json/wp/v2/services`
4. Check if ACF fields are showing: Look for `"acf"` object in response

### ❌ "CORS Error: Access-Control-Allow-Origin header is missing"

**Solution:**
1. Edit `.htaccess` in public_html
2. Verify exact domain is specified (with https://)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Wait 10 minutes for Apache to reload
5. Test again with curl:
```bash
curl -H "Origin: https://your-frontend.com" \
  -H "Access-Control-Request-Method: GET" \
  https://backend.com/wp-json/
```

### ❌ "Plugin not appearing in Dashboard after upload"

**Solution:**
1. Verify correct path: `wp-content/plugins/aos-emploi-backend/aos-backend-plugin.php`
2. Check file permissions: Should be 644 or 755
3. Ensure PHP syntax is correct: No syntax errors in PHP file
4. Check WordPress error log: `wp-content/debug.log`

### ❌ "Login returns 'Email not in whitelist'"

**Solution:**
1. Add email to whitelist: Dashboard → phpmyadmin → aos_verified_employees
2. Or use phpMyAdmin:
```sql
INSERT INTO aos_verified_employees (email, nom, type) 
VALUES ('newemail@emploi.gov.ma', 'User Name', 'actif');
```

### ❌ "Login works but 'unique_key' not found"

**Solution:**
1. Admin must manually set unique_key after registration
2. In Dashboard, find the adherent in a custom admin page (you may need to create this)
3. Or use phpMyAdmin directly:
```sql
UPDATE aos_adherents 
SET unique_key = 'AOS-2026-ABC123', status = 'approved'
WHERE email = 'user@email.com';
```

### ❌ "Frontend still showing 'Mock Data'"

**Solution:**
1. Check `.env` file: `VITE_IS_MOCK=false`
2. Check `src/services/api.js`: Verify `IS_MOCK` is correctly reading from env
3. Restart dev server: `npm run dev` (or `yarn dev`, `pnpm dev`)
4. Clear browser cache
5. Check browser console for API errors

---

## Next Steps

1. **Set up database** → Execute schema.sql
2. **Install plugins** → Upload 3 PHP files and activate
3. **Configure CORS** → Edit .htaccess
4. **Create content** → Add Services, Actualités, etc.
5. **Test APIs** → Use curl commands above
6. **Update frontend** → Set .env and api.js
7. **Deploy frontend** → Upload React build to hosting

---

## Additional Resources

- **Full Setup Guide:** See `backend-files/GUIDE_COMPLET_SETUP_FR.md`
- **Deployment Checklist:** See `backend-files/CHECKLIST_DEPLOIEMENT.md`
- **Database Schema:** See `backend-files/schema.sql`
- **API Documentation:** See endpoint examples in testing section above

---

## Support & Debugging

If you encounter issues:

1. **Check error logs:**
   - cPanel → Error Logs
   - WordPress error log: `wp-content/debug.log`

2. **Enable debug mode in wp-config.php:**
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```

3. **Test endpoints with Postman or curl** before debugging frontend

4. **Verify database connectivity:**
   - cPanel → phpMyAdmin → Select database
   - Run: `SELECT * FROM aos_adherents LIMIT 1;`

---

**Last Updated:** April 2026  
**Version:** 1.0 Final  
**Created for:** AOS-Emploi Headless CMS

