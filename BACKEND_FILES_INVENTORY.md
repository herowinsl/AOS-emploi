# 📦 Backend Files Inventory for AOS-Emploi CMS

**Complete list of all backend files you have and what additional files to create**

---

## ✅ Files You Already Have (Ready to Use)

### Location: `/backend-files/` folder

#### 1. **schema.sql** - Database Structure
- **Status:** ✅ Complete & Ready
- **Purpose:** Creates 3 required database tables
- **Tables created:**
  - `aos_verified_employees` - Whitelist of authorized emails
  - `aos_adherents` - User accounts & profiles  
  - `aos_demandes` - Service requests/forms
- **To use:** Import into phpMyAdmin (cPanel)
- **Includes test data:** 5 sample employees

#### 2. **aos-backend-plugin.php** - Authentication & API System
- **Status:** ✅ Complete & Ready
- **Purpose:** Creates custom REST API endpoints for auth & requests
- **Size:** ~250 lines
- **Endpoints created:**
  ```
  POST   /aos/v1/register      - New user registration (whitelist checked)
  POST   /aos/v1/login         - User login (unique_key required)
  GET    /aos/v1/me            - Get current user profile (token required)
  POST   /aos/v1/demandes      - Create new request (token required)
  GET    /aos/v1/demandes      - List user's requests (token required)
  GET    /aos/v1/documents     - List available documents (token required)
  ```
- **Features:**
  - Bearer token authentication (24-hour sessions)
  - CORS support (set origin in code)
  - Request validation
  - JSON responses
- **To use:** Upload to `wp-content/plugins/aos-emploi-backend/` and activate

#### 3. **aos-cpt-plugin.php** - Content Management System
- **Status:** ✅ Complete & Ready
- **Purpose:** Creates 4 custom post types + ACF field groups
- **Size:** ~500 lines
- **Custom Post Types (CPTs):**
  1. **Services** (`aos_services`) - Prestations/Services offered
     - Fields: titre_fr, titre_ar, description_fr, description_ar, icone_url, slug
  2. **Actualités** (`aos_actualites`) - News articles
     - Fields: titre_fr, titre_ar, extrait_fr, extrait_ar, slug, author_name, article_date
  3. **Chiffres Clés** (`aos_chiffres`) - Statistics/Key numbers
     - Fields: valeur, suffixe, label_fr, label_ar
  4. **Documents** (`aos_documents`) - Downloadable PDFs
     - Fields: fichier_pdf, categorie, titre_fr, titre_ar, description_fr, description_ar

- **ACF Features:**
  - Bilingual support (French + Arabic)
  - Required field validation
  - Proper data types & placeholders
  - Easy WordPress admin interface
- **To use:** Upload to `wp-content/plugins/` and activate

#### 4. **aos-rest-filters.php** - API Response Formatting
- **Status:** ✅ Complete & Ready
- **Purpose:** Adds ACF fields to REST API responses
- **Size:** ~300 lines
- **What it does:**
  - Exposes ACF fields in `/wp-json/` responses
  - Formats data for frontend consumption
  - Adds computed fields (formatted values, slugs, etc.)
  - Enables featured images in actualités
- **Example:** Without this, ACF fields would be missing from API. With it:
  ```json
  {
    "id": 1,
    "title": "...",
    "acf": {
      "titre_fr": "Aide d'Urgence",
      "titre_ar": "مساعدة الطوارئ",
      ...
    },
    "slug": "aide-urgence"
  }
  ```
- **To use:** Upload to `wp-content/plugins/` and activate

---

## 📋 Documentation Files (Already Have)

Located in `/backend-files/` folder:

| File | Pages | Purpose |
|------|-------|---------|
| **README.md** | 8 | Overview of all backend files |
| **GUIDE_COMPLET_SETUP_FR.md** | 120+ | Detailed step-by-step setup guide (French) |
| **CHECKLIST_DEPLOIEMENT.md** | 8 | Day-by-day deployment checklist |
| **RÉSUMÉ_EXÉCUTIF_FINAL.md** | 4 | Executive summary |
| **RÉSUMÉ_LIVRAISON.md** | 3 | Delivery summary |
| **RAPPORT_FINAL_VERIFICATION.md** | 5 | Final verification report |
| **LIVRABLE_FINAL.md** | 3 | Final deliverables list |

---

## 🆕 Additional Backend Files to Create

These files will enhance your setup but are optional for basic functionality:

### Priority 1: Recommended for Production

#### 1. **.htaccess** - CORS & URL Rewriting
**Location:** `public_html/.htaccess` (on cPanel server)

**What to create:**
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://your-frontend.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
</IfModule>
```

**Why:** Allows frontend to communicate with backend without CORS errors

**Creation method:** 
- Via cPanel File Manager
- Via FTP
- Or use wp-config.php settings

---

#### 2. **wp-admin-user-management.php** - Admin Dashboard for Approvals
**Location:** `wp-content/plugins/aos-admin-management/` (optional plugin)

**What to create:** Custom admin page to:
- View pending user registrations
- Approve/reject users
- Generate unique_key for approved users
- Manage whitelist

**Example code snippet:**
```php
<?php
/**
 * Plugin Name: AOS Admin Management
 * Description: Admin page for managing user approvals and whitelist
 */

add_action('admin_menu', function() {
    add_menu_page(
        'AOS Gestion',
        'AOS Gestion',
        'manage_options',
        'aos-management',
        'aos_admin_page',
        'dashicons-admin-users'
    );
});

function aos_admin_page() {
    global $wpdb;
    
    // Display pending users
    $pending = $wpdb->get_results(
        "SELECT * FROM aos_adherents WHERE status = 'pending'"
    );
    
    // Display interface to approve/reject
    echo '<div class="wrap">';
    echo '<h1>Gestion Adhérents</h1>';
    // ... admin interface code ...
    echo '</div>';
}
```

**Benefit:** Makes user approval easier (instead of using phpMyAdmin)

---

#### 3. **environment-variables.md** - Configuration Reference
**Location:** `backend-files/environment-variables.md`

**What to create:** Document listing all env vars needed:

```markdown
# Environment Variables

## WordPress/Backend (wp-config.php)
- DB_NAME
- DB_USER  
- DB_PASSWORD
- DB_HOST
- DB_CHARSET
- DB_COLLATE

## Frontend (.env)
- VITE_WP_API_URL
- VITE_AOS_API_URL
- VITE_IS_MOCK
- VITE_DEFAULT_LANG

## CORS (in .htaccess or plugin)
- Access-Control-Allow-Origin
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers
```

---

#### 4. **database-backup-script.sh** - Automated Backups
**Location:** `scripts/backup-database.sh` (on cPanel server)

**What to create:** Bash script to automatically backup database

```bash
#!/bin/bash

BACKUP_DIR="/home/user/backups"
DB_NAME="aos_emploi"
DB_USER="user"
DB_PASSWORD="password"
DATE=$(date +%Y%m%d_%H%M%S)

mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > \
  $BACKUP_DIR/aos_backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "aos_backup_*.sql" -mtime +30 -delete
```

---

### Priority 2: Nice to Have

#### 5. **api-documentation.md** - Full API Reference
**Location:** `backend-files/api-documentation.md`

**What to create:** Complete API docs with:
- All endpoints listed
- Request/response examples
- Authentication flow
- Error codes
- Rate limits

---

#### 6. **testing-script.sh** - Automated Testing
**Location:** `scripts/test-apis.sh`

**What to create:** Bash script to test all endpoints:

```bash
#!/bin/bash

BACKEND="https://your-backend.com"

echo "Testing Services..."
curl "$BACKEND/wp-json/wp/v2/services" | jq '.'

echo "Testing Actualités..."
curl "$BACKEND/wp-json/wp/v2/actualites" | jq '.'

echo "Testing Registration..."
curl -X POST "$BACKEND/wp-json/aos/v1/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@emploi.gov.ma",...}'
```

---

#### 7. **migration-v2.sql** - Future Schema Updates
**Location:** `backend-files/migration-v2.sql`

**What to create:** Additional database changes (if needed later)

```sql
-- Example: Add new field to existing table
ALTER TABLE aos_adherents ADD COLUMN adresse VARCHAR(255);

-- Run in phpMyAdmin when needed
```

---

## 🚀 Quick Setup Summary

### To Get Started Immediately:

1. **Copy these 4 PHP files to cPanel:**
   - ✅ `aos-backend-plugin.php` → `wp-content/plugins/aos-emploi-backend/`
   - ✅ `aos-cpt-plugin.php` → `wp-content/plugins/`
   - ✅ `aos-rest-filters.php` → `wp-content/plugins/`

2. **Execute this SQL file:**
   - ✅ `schema.sql` → phpMyAdmin → Import

3. **Activate plugins:**
   - ✅ WordPress Dashboard → Plugins → Activate all 3

4. **Configure CORS:**
   - ✅ Edit `.htaccess` in `public_html/` 
   - ✅ Replace domain with your frontend URL

5. **Create content:**
   - ✅ Dashboard → Services → Add services
   - ✅ Dashboard → Actualités → Add articles
   - ✅ Dashboard → Documents → Upload PDFs

6. **Link frontend:**
   - ✅ Update `.env` in React project
   - ✅ Update `src/services/api.js`
   - ✅ Run frontend and test

### Files Summary Table

| # | File | Type | Status | Priority | Action |
|---|------|------|--------|----------|--------|
| 1 | schema.sql | SQL | ✅ Have | 🔴 Required | Execute in phpMyAdmin |
| 2 | aos-backend-plugin.php | PHP | ✅ Have | 🔴 Required | Upload & activate |
| 3 | aos-cpt-plugin.php | PHP | ✅ Have | 🔴 Required | Upload & activate |
| 4 | aos-rest-filters.php | PHP | ✅ Have | 🔴 Required | Upload & activate |
| 5 | .htaccess | Config | ⚠️ Need to create | 🔴 Required | Edit in cPanel |
| 6 | wp-admin-user-management.php | PHP Plugin | 🆕 Optional | 🟡 Recommended | Create for easier approvals |
| 7 | environment-variables.md | Docs | 🆕 Optional | 🟡 Recommended | Create for reference |
| 8 | api-documentation.md | Docs | 🆕 Optional | 🟢 Nice to have | Create for developers |
| 9 | database-backup-script.sh | Script | 🆕 Optional | 🟢 Nice to have | Create for safety |

---

## 📂 Complete File Structure (After Setup)

```
WordPress Installation (cPanel)
│
├── public_html/
│   ├── .htaccess ← CORS configuration (NEED TO CREATE)
│   ├── wp-config.php
│   ├── wp-content/
│   │   └── plugins/
│   │       ├── aos-emploi-backend/
│   │       │   └── aos-backend-plugin.php ✅ HAVE
│   │       ├── aos-cpt-plugin.php ✅ HAVE
│   │       └── aos-rest-filters.php ✅ HAVE
│   └── ... (WordPress standard files)
│
└── Database
    ├── wp_* (WordPress tables)
    ├── aos_verified_employees ✅ CREATED BY schema.sql
    ├── aos_adherents ✅ CREATED BY schema.sql
    └── aos_demandes ✅ CREATED BY schema.sql
```

---

## ⚡ Quick Links

- **Setup Guide:** `backend-files/GUIDE_COMPLET_SETUP_FR.md`
- **Deployment Checklist:** `backend-files/CHECKLIST_DEPLOIEMENT.md`
- **This Document:** `CMS_SETUP_GUIDE.md` (comprehensive guide I created)
- **Frontend Integration:** See section in CMS_SETUP_GUIDE.md

---

## ❓ FAQ

**Q: Do I need all the "Optional" files?**  
A: No, the 4 required files + .htaccess configuration are enough to get started. Optional files make management easier but aren't necessary for functionality.

**Q: How long to set up?**  
A: 
- Database setup: 5 min
- Plugin installation: 10 min
- CORS configuration: 5 min
- Content creation: 15 min
- Testing: 10 min
- **Total: ~45 minutes**

**Q: Can I skip any required files?**  
A: No. All 4 PHP files + schema.sql are necessary for the system to work.

**Q: What if I lose the PHP files?**  
A: You can download them from your WordPress plugins folder in cPanel, or keep a backup in your project's backend-files folder.

---

**Version:** 1.0  
**Last Updated:** April 2026  
**Created for:** AOS-Emploi CMS Backend Setup

