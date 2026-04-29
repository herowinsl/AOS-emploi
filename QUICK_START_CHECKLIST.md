# ⚡ AOS-Emploi Backend Setup - Quick Start (30 minutes)

**Fast-track checklist to get your CMS backend running**

---

## Phase 1: Database Setup (5 min)

### Step 1.1: Access phpMyAdmin
- [ ] Go to cPanel → phpMyAdmin
- [ ] Select your WordPress database

### Step 1.2: Import Schema
- [ ] Click "Import" tab
- [ ] Choose file: `backend-files/schema.sql`
- [ ] Click "Go"

**✓ Result:** 3 new tables created
```
aos_verified_employees
aos_adherents
aos_demandes
```

---

## Phase 2: WordPress Plugins (10 min)

### Step 2.1: Upload First Plugin (Backend System)
- [ ] Go to cPanel → File Manager
- [ ] Navigate to: `public_html/wp-content/plugins/`
- [ ] Create folder: `aos-emploi-backend`
- [ ] Upload: `aos-backend-plugin.php` into this folder

### Step 2.2: Upload Second Plugin (CPT + ACF)
- [ ] Stay in: `public_html/wp-content/plugins/`
- [ ] Upload: `aos-cpt-plugin.php` directly here

### Step 2.3: Upload Third Plugin (REST Filters)
- [ ] Stay in: `public_html/wp-content/plugins/`
- [ ] Upload: `aos-rest-filters.php` directly here

### Step 2.4: Activate All Plugins
- [ ] Go to WordPress Dashboard
- [ ] Go to: Plugins → Installed Plugins
- [ ] Find: "AOS-Emploi Backend System"
- [ ] Click: "Activate"
- [ ] Find: "AOS Custom Post Types & ACF Fields"
- [ ] Click: "Activate"
- [ ] Find: "AOS REST API Filters"
- [ ] Click: "Activate"

**✓ Result:** You should see new menu items in Dashboard:
- Services
- Actualités
- Chiffres Clés
- Documents

---

## Phase 3: CORS Configuration (5 min)

### Step 3.1: Edit .htaccess File
- [ ] Go to cPanel → File Manager
- [ ] Navigate to: `public_html/`
- [ ] Click gear icon → "Show Hidden Files"
- [ ] Edit or create `.htaccess`
- [ ] Add this code:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://your-frontend-domain.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
</IfModule>
```

**Important:** Replace `https://your-frontend-domain.com` with your actual domain (e.g., `https://aos-emploi.vercel.app`)

- [ ] Save file
- [ ] Wait 5-10 minutes for Apache to reload

---

## Phase 4: Create Test Content (10 min)

### Step 4.1: Create First Service
- [ ] Dashboard → Services → Add New
- [ ] Fill in:
  - Titre (FR): Aide d'Urgence
  - Titre (AR): مساعدة الطوارئ
  - Description: Financial emergency assistance
  - Slug: aide-urgence
- [ ] Click "Publish"

### Step 4.2: Create First Article
- [ ] Dashboard → Actualités → Add New
- [ ] Fill in:
  - Titre (FR): Assemblée Générale 2026
  - Titre (AR): الجمعية العامة 2026
  - Slug: ag-2026
- [ ] Upload featured image
- [ ] Click "Publish"

### Step 4.3: Create Statistics
- [ ] Dashboard → Chiffres Clés → Add New
- [ ] Fill in:
  - Valeur: 5000
  - Suffixe: +
  - Label (FR): Membres Actifs
  - Label (AR): أعضاء نشطون
- [ ] Click "Publish"

---

## Phase 5: Quick Testing (5 min)

### Test 5.1: Services API
Copy and run in terminal:
```bash
curl https://your-backend.com/wp-json/wp/v2/services | jq '.'
```

**Expected:** You should see your service with `acf` fields

### Test 5.2: CORS Headers
```bash
curl -I https://your-backend.com/wp-json/ \
  -H "Origin: https://your-frontend.com"
```

**Expected:** Should see `Access-Control-Allow-Origin` in headers

### Test 5.3: Test Registration
```bash
curl -X POST https://your-backend.com/wp-json/aos/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@emploi.gov.ma",
    "nom": "Test User",
    "telephone": "0600000000",
    "lieu_travail": "Casablanca"
  }'
```

**Expected:** Response should be:
```json
{
  "success": true,
  "message": "Demande envoyée."
}
```

---

## Phase 6: Update Frontend (5 min)

### Step 6.1: Update .env File
**File:** `/.env` in your React project

```env
VITE_WP_API_URL=https://your-backend.com/wp-json
VITE_AOS_API_URL=https://your-backend.com/wp-json/aos/v1
VITE_IS_MOCK=false
VITE_DEFAULT_LANG=fr
VITE_API_TIMEOUT=8000
```

Replace `your-backend.com` with your actual domain

### Step 6.2: Update API Client
**File:** `/src/services/api.js`

```javascript
import axios from "axios";

export const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';

const WP_BASE = import.meta.env.VITE_WP_API_URL;
const AOS_BASE = import.meta.env.VITE_AOS_API_URL;

export const wpApi = axios.create({
  baseURL: WP_BASE,
  timeout: 8000,
});

export const aosApi = axios.create({
  baseURL: AOS_BASE,
  timeout: 8000,
});

// Add token to requests
aosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('aos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Step 6.3: Restart Dev Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

- [ ] Open your frontend in browser
- [ ] Check if Services are loaded (not showing "Mock Data")
- [ ] Check browser console for errors (F12)

---

## ✅ Final Verification Checklist

- [ ] Database tables created (3 tables with `aos_` prefix)
- [ ] All 3 plugins installed and activated
- [ ] Dashboard shows new menus (Services, Actualités, etc.)
- [ ] At least 1 Service published
- [ ] At least 1 Actualité published
- [ ] At least 1 Chiffre Clé published
- [ ] `.htaccess` configured with correct domain
- [ ] Tested `/wp-json/wp/v2/services` endpoint
- [ ] Tested CORS headers with curl
- [ ] Frontend `.env` updated
- [ ] Frontend displaying real data (not mocks)
- [ ] No console errors in browser

---

## 🚨 Common Issues & Quick Fixes

### Issue: "CORS Error" in browser

**Fix:**
1. Edit `.htaccess` - verify exact domain (with https://)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Wait 10 minutes for Apache reload
4. Try curl test to verify CORS is set

### Issue: "Services not showing in API"

**Fix:**
1. Check plugins are activated: Dashboard → Plugins
2. Create at least 1 Service: Dashboard → Services → Add New
3. Verify with curl: `curl https://backend.com/wp-json/wp/v2/services`

### Issue: "Plugin not appearing after upload"

**Fix:**
1. Check path: `wp-content/plugins/aos-emploi-backend/aos-backend-plugin.php`
2. Verify file permissions (644 or 755)
3. Check WordPress error log: `wp-content/debug.log`

### Issue: "Frontend still showing Mock Data"

**Fix:**
1. Check `.env`: `VITE_IS_MOCK=false`
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Check browser console (F12) for API errors

---

## 📞 Need Help?

**Check these files for detailed information:**

1. **Full Setup Guide:** `backend-files/GUIDE_COMPLET_SETUP_FR.md` (120+ pages)
2. **Complete Inventory:** `BACKEND_FILES_INVENTORY.md` (this folder)
3. **Full Integration Guide:** `CMS_SETUP_GUIDE.md` (this folder)
4. **API Testing:** See "Testing & Validation" section in `CMS_SETUP_GUIDE.md`

---

## 📅 Timeline

```
Phase 1: Database              5 min  ✓
Phase 2: Plugins              10 min  ✓
Phase 3: CORS                  5 min  ✓
Phase 4: Content              10 min  ✓
Phase 5: Testing               5 min  ✓
Phase 6: Frontend              5 min  ✓
────────────────────────────────────────
Total:                         40 min  ✓
```

---

## 🎯 What You Have Now

After completing this checklist:

✅ Fully functional headless CMS  
✅ Custom authentication system  
✅ Bilingual content (FR/AR)  
✅ Service request management  
✅ Document management  
✅ Admin dashboard  
✅ REST API endpoints  
✅ React frontend integration  

**Ready to go live!** 🚀

---

**Version:** 1.0  
**Time to Complete:** 30-40 minutes  
**Last Updated:** April 2026

