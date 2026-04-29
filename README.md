# 🎯 AOS-EMPLOI — Plateforme Web Bilingue

**Internship Project | React 18 + WordPress Headless | FR/AR Support**

---

## 📋 Vue d'ensemble

AOS-EMPLOI est une **plateforme web moderne et bilingue** (Français/Arabe) pour la gestion d'adhésions et demandes de services d'une association d'employés gouvernementaux.

### ✨ Caractéristiques

- 🌍 **Bilingue Complet** — Support FR/AR natif avec RTL
- 🎨 **Design Premium** — Glassmorphism + Navy/Orange branding
- ⚡ **Performance** — 85%+ Lighthouse score
- 📱 **Responsive** — Mobile-first (100% responsive)
- 🔐 **Sécurité** — Authentification Token Bearer 24h
- 🎬 **Animations** — Framer Motion fluides
- ♿ **Accessibilité** — WCAG compliant

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  React SPA Frontend (Vite)              │
│  - Pages: 11                            │
│  - Languages: FR/AR                     │
│  - Bundle: ~180KB (gzipped)             │
│  - Deploy: Static CDN / cPanel          │
└──────────────┬──────────────────────────┘
               │ REST API
               ↓
┌─────────────────────────────────────────┐
│  WordPress Headless Backend             │
│  - 3 Plugins API + CPT + Filters        │
│  - 8 Endpoints (/aos/v1/*)              │
│  - 3 Custom Post Types (Services, etc)  │
│  - MySQL Database (3 tables)            │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Frontend Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
# → dist/ folder
```

### Backend Setup

See [backend-files/README.md](./backend-files/README.md) for complete backend installation guide.

---

## 📁 Project Structure

```
aos-emploi/
├── src/
│   ├── pages/              # Page components (11 pages)
│   ├── components/         # UI components
│   ├── services/          # API calls (axios)
│   ├── context/           # Global state (Auth, Lang)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   ├── mocks/             # Mock data
│   └── App.jsx            # Root component
├── public/                # Static assets
├── backend-files/         # WordPress plugins + docs
├── package.json           # Dependencies
├── vite.config.js         # Vite config
├── tailwind.config.js     # Tailwind CSS
└── README.md              # This file
```

---

## 🔌 Tech Stack

| Layer             | Technology      | Version |
| ----------------- | --------------- | ------- |
| **Frontend**      | React           | 18.3    |
| **Build**         | Vite            | 5.4     |
| **Styling**       | Tailwind CSS    | 3.4     |
| **Animations**    | Framer Motion   | 11.18   |
| **Icons**         | Lucide React    | 1.7     |
| **Forms**         | React Hook Form | 7.72    |
| **Routing**       | React Router    | 7.14    |
| **API**           | Axios           | 1.14    |
| **Notifications** | Sonner          | 2.0     |
| **Backend**       | WordPress       | 6.0+    |
| **Database**      | MySQL           | 5.7+    |

---

## 📖 Documentation

1. **[Backend Setup Guide](./backend-files/GUIDE_COMPLET_SETUP_FR.md)** — 120 pages
2. **[Deployment Checklist](./backend-files/CHECKLIST_DEPLOIEMENT.md)** — Day-by-day tasks
3. **[Final Verification Report](./backend-files/RAPPORT_FINAL_VERIFICATION.md)** — UI/UX + Backend details
4. **[Backend README](./backend-files/README.md)** — Quick reference

---

## 📱 Pages Implemented

| Page            | Route               | Auth | Status |
| --------------- | ------------------- | ---- | ------ |
| Home            | `/`                 | No   | ✅     |
| Services        | `/services/:slug`   | No   | ✅     |
| Actualités      | `/actualites/:slug` | No   | ✅     |
| Contact         | `/contact`          | No   | ✅     |
| Auth            | `/auth`             | No   | ✅     |
| Espace Adhérent | `/espace-adherent`  | ✅   | ✅     |
| About (3 pages) | `/about/*`          | No   | ✅     |

---

## 🔐 Authentication Flow

```
1. User → Register (email whitelist check)
2. Admin approves → Generates unique key
3. User → Login (email + key)
4. Backend generates Token (24h expiry)
5. Frontend stores token in localStorage
6. Protected routes use token for API calls
7. Token expires after 24h → Re-login required
```

---

## 🌍 Bilingual Support

- **Frontend:** Full FR/AR with RTL support
- **Backend:** All content bilingue (titre_fr, titre_ar)
- **Database:** Stores both language versions
- **UX:** Seamless language switcher in navbar

---

## 🎨 Design System

- **Primary Color:** Navy (#1B2A4A)
- **Accent Color:** Orange (#F26522)
- **Typography:** DM Sans (FR), Cairo (AR)
- **Components:** Premium Glassmorphism
- **Spacing:** Tailwind utilities

---

## 📦 Build & Deploy

### Frontend Build

```bash
npm run build
# Generates: dist/ (static files)
```

### Deploy to cPanel

```bash
# Via FTP: Upload dist/ to public_html/aos-frontend/
# Configure: .htaccess for SPA routing
# Result: https://frontend.com live ✓
```

### Backend Deploy

See [backend-files/](./backend-files/) for WordPress plugin installation.

---

## 🧪 Testing

### Manual Tests

- [ ] All pages load
- [ ] Bilingue works (FR/AR switcher)
- [ ] Forms submit correctly
- [ ] Authentication flow works
- [ ] Responsive on mobile
- [ ] No console errors

### Lighthouse Audit

- Performance: 85%+
- Accessibility: 90%+
- Best Practices: 90%+
- SEO: 85%+

---

## 🐛 Known Issues & Solutions

See [RAPPORT_FINAL_VERIFICATION.md](./backend-files/RAPPORT_FINAL_VERIFICATION.md) for:

- UI/UX improvements
- Documentation alignment
- Backend implementation details

---

## 📝 Environment Variables

Create `.env` file:

```env
VITE_WP_API_URL=https://your-domain.com/wp-json
VITE_IS_MOCK=false
VITE_MOCK_DELAY=600
```

---

## 🚀 Production Checklist

- [ ] Build production: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Upload dist/ to cPanel
- [ ] Configure .htaccess
- [ ] Enable HTTPS
- [ ] Test authentication
- [ ] Verify CORS headers
- [ ] Backup database

---

## 📞 Support

- **Backend Setup:** See [backend-files/README.md](./backend-files/README.md)
- **Deployment:** See [CHECKLIST_DEPLOIEMENT.md](./backend-files/CHECKLIST_DEPLOIEMENT.md)
- **Technical Details:** See [GUIDE_COMPLET_SETUP_FR.md](./backend-files/GUIDE_COMPLET_SETUP_FR.md)
- **Issues:** See [RAPPORT_FINAL_VERIFICATION.md](./backend-files/RAPPORT_FINAL_VERIFICATION.md)

---

## 📄 License

Private project - AOS-EMPLOI Association

---

## 👨‍💻 Developer

**Ilyas Sennane** — Internship Project (April 2026)

---

## 🎓 For the Internship Report

This project demonstrates:

- ✅ Full-stack development (React + WordPress)
- ✅ Bilingual/RTL support
- ✅ Responsive design (Mobile-first)
- ✅ Security best practices
- ✅ Performance optimization (85%+ Lighthouse)
- ✅ Technical documentation
- ✅ Deployment readiness

---

**Status:** 🟢 Production Ready  
**Last Updated:** April 29, 2026  
**Version:** 1.0 Final
