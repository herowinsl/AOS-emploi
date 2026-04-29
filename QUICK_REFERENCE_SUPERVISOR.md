# 🎯 Quick Reference Card — AOS-EMPLOI Deploy

**Print this page!** Keep it next to you during deployment.

---

## 4 Days, 4 Steps

| Day | Task | Duration | Clicks |
|-----|------|----------|--------|
| 1 | Infrastructure Setup | 2h | 10 |
| 2 | Plugins + CORS | 2h | 15 |
| 3 | Content + Test | 3h | 30 |
| 4 | Frontend + Go Live | 2h | 20 |

---

## Day 1 Checklist

```
☐ 1. cPanel → File Manager → public_html
☐ 2. cPanel → phpMyAdmin → Check tables
☐ 3. Check WordPress at votredomaine.com/wp-admin
☐ 4. Download 3 PHP files to your computer
☐ 5. Write down domains:
     Backend: https://votredomaine.com
     Frontend: https://frontend.votredomaine.com
```

---

## Day 2 Checklist

```
☐ 1. cPanel → File Manager → public_html/wp-content/plugins/
☐ 2. Upload: aos-backend-system-final.php
☐ 3. Upload: aos-cpt-plugin-final.php
☐ 4. Upload: aos-rest-filters-final.php
☐ 5. Dashboard → Plugins → Activate all 3
☐ 6. Edit .htaccess, add CORS:

<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://frontend.votredomaine.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
</IfModule>
```

---

## Day 3 Checklist

```
☐ 1. Dashboard → Services → Add 5 items
   - Aide d'Urgence (slug: aide-urgence)
   - Prêt Personnel (slug: pret-personnel)
   - Estivage (slug: estivage)
   - Assistance Sociale (slug: assistance-sociale)
   - Conseil Juridique (slug: conseil-juridique)

☐ 2. Dashboard → Actualités → Add 5 items

☐ 3. Dashboard → Chiffres Clés → Add 3 items
   - 5000+ Membres
   - 150M Aide
   - 25 ans Expérience

☐ 4. Dashboard → Documents → Add 2+ PDFs

☐ 5. Test API (terminal):
   curl https://votredomaine.com/wp-json/wp/v2/services | jq '.[0]'

☐ 6. Test Registration:
   curl -X POST https://votredomaine.com/wp-json/aos/v1/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@emploi.gov.ma",
       "nom": "Test",
       "telephone": "+212612345678",
       "lieu_travail": "Test"
     }'

☐ 7. Add email to whitelist (phpMyAdmin → aos_verified_employees)

☐ 8. Test Login (after approving account in aos_adherents)
```

---

## Day 4 Checklist

```
☐ 1. Receive dist/ folder from developer

☐ 2. cPanel → Addon Domains → Add:
     frontend.votredomaine.com → public_html/aos-frontend/

☐ 3. File Manager → public_html/aos-frontend/ → Upload dist/

☐ 4. Create .htaccess in public_html/aos-frontend/:
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

☐ 5. cPanel → SSL/TLS Status → Install for both domains

☐ 6. Open https://frontend.votredomaine.com in browser

☐ 7. Test: Click "Se connecter" → Use test@emploi.gov.ma + key

☐ 8. Test: Click FR/AR toggle
```

---

## Critical Settings

### CORS in .htaccess
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://frontend.votredomaine.com"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With"
</IfModule>
```

**Change:** `https://frontend.votredomaine.com` to your actual domain!

### React .htaccess
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

---

## Plugin Activation Order

1. **aos-backend-system-final.php** (API endpoints)
2. **aos-cpt-plugin-final.php** (Content types)
3. **aos-rest-filters-final.php** (API response formatting)

All 3 MUST be active!

---

## New WordPress Menus After Activation

After plugins activate, Dashboard will show:

```
Dashboard
├─ Posts
├─ Services              ← NEW
├─ Actualités            ← NEW
├─ Chiffres Clés         ← NEW
├─ Documents             ← NEW
├─ Pages
└─ Plugins
```

---

## Test Commands (Terminal/cURL)

### Test 1: Services
```bash
curl https://votredomaine.com/wp-json/wp/v2/services | jq
```

### Test 2: Register
```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@emploi.gov.ma","nom":"Test","telephone":"+212612345678","lieu_travail":"Test"}'
```

### Test 3: Login
```bash
curl -X POST https://votredomaine.com/wp-json/aos/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@emploi.gov.ma","unique_key":"AOS-2026-TEST-KEY1"}'
```

### Test 4: Auth Request
```bash
TOKEN="..." # from login response
curl https://votredomaine.com/wp-json/aos/v1/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## File Paths to Remember

```
Backend API:
https://votredomaine.com/wp-json/aos/v1/

WordPress Admin:
https://votredomaine.com/wp-admin/

Frontend:
https://frontend.votredomaine.com

Plugins Location:
public_html/wp-content/plugins/

Frontend Upload:
public_html/aos-frontend/

Database:
cPanel → phpMyAdmin
```

---

## Common Issues & Quick Fixes

### Issue: "No 'Access-Control-Allow-Origin' header"
**Fix:** Check CORS in .htaccess, wait 10min for Apache restart

### Issue: "Services not showing"
**Fix:** Verify all 3 plugins are ✅ Active

### Issue: "Can't login"
**Fix:** Check aos_adherents table - status must be "approved"

### Issue: "Frontend shows blank page"
**Fix:** Create .htaccess in aos-frontend/ folder

### Issue: "Page not found on refresh"
**Fix:** Create .htaccess with RewriteRules

---

## Final Checklist Before Go Live

```
☐ All 3 plugins active
☐ CORS configured with correct domain
☐ 5+ Services created
☐ 5+ Actualités created
☐ 3+ Chiffres Clés created
☐ 2+ Documents created
☐ API tests passed
☐ Auth tests passed
☐ Frontend uploads
☐ Frontend .htaccess created
☐ SSL/HTTPS active
☐ Frontend accessible
☐ Bilingue working (FR/AR)
☐ Database backed up
```

---

## Contact & Support

**Stuck?**
1. Check SUPERVISEUR_GUIDE_COMPLET.md (full guide)
2. Try test commands above
3. Check cPanel logs: public_html/wp-content/debug.log
4. Contact developer

---

**Print this! Keep it handy! 🚀**
