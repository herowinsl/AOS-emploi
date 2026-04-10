# PROJECT_CONTEXT.md
# AOS Emploi — Website Modernization
> Cursor AI context file — read this before writing any code in this project.
> Last updated: April 2026

---

## 🧭 What This Project Is

**AOS Emploi** (aosemploi.com) is the official web portal of **AOS** — a social welfare
association serving the staff (fonctionnaires) of Morocco's Ministry of Employment.

This is NOT a job portal. It is an **institutional association website**.
Tone: formal, bilingual (French + Arabic), trustworthy.

The project modernizes an outdated PHP site into a **headless WordPress + React** architecture.

**Two developers:**
- **Ilyas** — owns 100% of the React frontend
- **Teammate** — owns WordPress setup, CPT registration, ACF fields, CORS, cPanel deployment

**Timeline:** 1 month. Deadline is strict.

---

## 🛠️ Confirmed Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Frontend framework | React | 18.3.1 | NOT React 19 |
| Build tool | Vite | 5.4.x | NOT Vite 6/7/8 |
| Styling | Tailwind CSS | 3.4.x | NOT v4 |
| Component library | Flowbite React | 0.12.x | Sole component library |
| Routing | React Router | v7 (v6 API) | Use classic component routing only |
| HTTP client | Axios | ^1.14 | Centralized in api.js |
| Forms | React Hook Form | ^7.72 | Contact form only |
| Notifications | Sonner | ^2.0 | Toast only |
| Animation | Framer Motion | ^11 | Chiffres Clés scroll counter ONLY |
| Icons | Lucide React | ^1.7 | All icons from here |
| Global state | React Context | — | LangContext only, no Redux |
| CMS | WordPress (headless) | — | Teammate manages |
| Database | MySQL | — | Shared with WP |

### ❌ Not In This Project
- Laravel (evaluated and dropped — WP REST API is sufficient)
- Redux Toolkit (overkill — React Context is enough)
- Tailwind v4 (breaks Flowbite)
- React 19 (breaks Framer Motion v11 + Flowbite peer deps)
- TypeScript (future goal — introduce progressively if asked)
- Dark mode (not in scope)
- shadcn/ui, MUI, Chakra (Flowbite React is the sole component library)
- `tailwindcss-rtl` plugin (Tailwind 3.4 has native logical properties)

---

## 📁 Folder Structure

```
aos-emploi/
├── public/
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageWrapper.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── SectionTitle.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorBanner.jsx
│   │   ├── home/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ActualitesSection.jsx
│   │   │   └── ChiffresClés.jsx       ← Framer Motion lives HERE only
│   │   ├── blog/
│   │   │   ├── PostCard.jsx
│   │   │   └── PostList.jsx
│   │   ├── services/
│   │   │   └── ServiceCard.jsx
│   │   ├── contact/
│   │   │   └── ContactForm.jsx        ← React Hook Form + Sonner
│   │   └── espace-adherent/
│   │       └── (TBD — scope not defined yet)
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── PortfolioPage.jsx
│   │   ├── BlogPage.jsx
│   │   ├── BlogPostPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── EspaceAdherentPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── hooks/
│   │   ├── usePosts.js
│   │   ├── usePage.js
│   │   └── useServices.js
│   │
│   ├── context/
│   │   └── LangContext.jsx            ← RTL/LTR + lang toggle
│   │
│   ├── services/
│   │   └── api.js                     ← Axios instance + IS_MOCK flag
│   │
│   ├── mocks/
│   │   ├── posts.json
│   │   ├── services.json
│   │   ├── chiffres.json
│   │   └── actualites.json
│   │
│   ├── routes/
│   │   └── index.jsx                  ← All routes defined here
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── .env
├── .env.example
└── package.json
```

---

## 🌍 Bilingual System (Critical — Read Carefully)

The site is bilingual: **French (LTR)** and **Arabic (RTL)**.

### How it works

1. `LangContext` holds `lang` state (`'fr'` | `'ar'`) and `toggleLang()`
2. On lang change, `useEffect` sets `dir` and `lang` attributes on `<html>`
3. Font swap is handled **purely in CSS** — no JavaScript involved

```css
/* index.css */
[dir="ltr"] body { font-family: 'DM Sans', sans-serif; }
[dir="rtl"] body { font-family: 'Cairo', sans-serif; }
```

### Tailwind RTL rules
- **Always** use logical properties, never physical directional classes
- ✅ Use: `ms-4`, `me-4`, `ps-4`, `pe-4`, `text-start`, `text-end`
- ❌ Never use: `ml-4`, `mr-4`, `pl-4`, `pr-4`, `text-left`, `text-right`
- ✅ Use: `rounded-s-lg`, `border-e`, `start-0`, `end-0`
- ❌ Never use: `rounded-l-lg`, `border-r`, `left-0`, `right-0`

### Fonts
- **DM Sans** — French/LTR
- **Cairo** — Arabic/RTL
- Loaded via Google Fonts in `index.css`

### Content structure
Every translatable string must support both languages.
Use this pattern in components:

```jsx
const { lang } = useLang()
const t = lang === 'fr' ? fr : ar
```

---

## 🎨 Design System

### Brand Colors (Tailwind tokens)
```js
navy: {
  DEFAULT: '#1B2A4A',   // Primary — main UI color
  light:   '#2D4270',   // Hover states, secondary nav
  dark:    '#121E35',   // Footer backgrounds
}
brand: {
  orange: '#F26522',    // ⚠️ PENDING M. KHALISSI APPROVAL — may change
}
'gray-soft': '#F4F6F9'  // Page backgrounds, card backgrounds
```

> ⚠️ Action Orange (`#F26522`) is flagged as potentially too bold for an
> institutional association site. Do not hardcode it everywhere.
> Use `brand-orange` token so it can be swapped in one place if rejected.

### Typography
- Heading scale: `text-3xl font-bold` → `text-5xl font-bold` (French)
- Body: `text-base` / `text-sm` for captions
- Arabic headings: Cairo renders heavier — reduce `font-bold` to `font-semibold` for Arabic

### Spacing
- Use Tailwind scale religiously. No arbitrary values like `mt-[23px]`
- Section vertical padding: `py-16` (mobile) → `py-24` (desktop)
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Institutional Tone Rules
- No playful animations — only purposeful transitions
- No bright gradients — navy + white + soft gray is the base
- Cards: `bg-white rounded-2xl shadow-sm border border-gray-100`
- Buttons: solid navy primary, orange secondary (pending approval)

---

## 🔌 API Layer

### `src/services/api.js` — The Central File

```js
export const IS_MOCK = true  // ← flip to false when WP API is ready

const WP_BASE = import.meta.env.VITE_WP_API_URL

export const wpApi = axios.create({
  baseURL: WP_BASE,
  timeout: 8000,
})

export const endpoints = {
  posts:     '/wp/v2/posts',
  pages:     '/wp/v2/pages',
  services:  '/wp/v2/services',     // CPT — registered by teammate
  portfolio: '/wp/v2/portfolio',    // CPT — registered by teammate
  media:     '/wp/v2/media',
}
```

### Mock-first Development
While `IS_MOCK = true`, all hooks return data from `src/mocks/*.json`.
This lets the frontend run completely independently before WordPress is live.

### Data Fetching — Always Use Custom Hooks
Never call `wpApi` directly in a page component. Always go through a hook.

```js
// ✅ Correct
const { posts, loading, error } = usePosts(3)

// ❌ Wrong
useEffect(() => { wpApi.get('/wp/v2/posts') }, [])
```

### Hook Pattern (all hooks follow this exact shape)
```js
const usePosts = (perPage = 3) => {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        if (IS_MOCK) {
          await new Promise(r => setTimeout(r, 400)) // simulate latency
          setPosts(mockData.slice(0, perPage))
        } else {
          const res = await wpApi.get(endpoints.posts, {
            params: { per_page: perPage, _embed: true }
          })
          setPosts(res.data)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [perPage])

  return { posts, loading, error }
}
```

---

## 📄 Pages × Data Map

| Page | Route | WP Endpoint | CPT | Status |
|---|---|---|---|---|
| Home | `/` | `/wp/v2/pages?slug=home` + `/wp/v2/posts?per_page=3` | — | Stub |
| About | `/about` | `/wp/v2/pages?slug=about` | — | Stub |
| Services | `/services` | `/wp/v2/services` | `services` | Stub |
| Portfolio | `/portfolio` | `/wp/v2/portfolio` | `portfolio` | Stub (rename TBD) |
| Blog list | `/blog` | `/wp/v2/posts?per_page=9` | — | Stub |
| Blog post | `/blog/:slug` | `/wp/v2/posts?slug={slug}` | — | Stub |
| Contact | `/contact` | Static form only | — | Stub |
| Espace Adhérent | `/espace-adherent` | TBD | TBD | Stub |
| 404 | `*` | Static | — | Stub |

---

## 🧩 Component Rules

### Every component must have:
1. Full imports at top
2. JSDoc props documentation
3. Local state declared and named clearly
4. Handlers separated from JSX
5. Loading + error states if it fetches data
6. Default export at bottom

### Loading states
Use `SkeletonCard` for card-based content. Never show a blank white space.

### Error states
Use `ErrorBanner` with a retry button. Never swallow errors silently.

### Empty states
Use `EmptyState` with a message. Never show an empty list without explanation.

---

## ⚡ Animation Rules (Framer Motion)

Framer Motion is **installed but restricted to one use case only**:
- `ChiffresClés.jsx` — scroll-triggered number counter animation

Do NOT add Framer Motion to:
- Page transitions
- Navbar
- Cards (use Tailwind `transition-*` instead)
- Any other component unless explicitly asked

For hover/focus interactions on cards and buttons, use Tailwind:
```jsx
className="transition-shadow duration-200 hover:shadow-md"
className="transition-colors duration-150 hover:bg-navy-light"
```

---

## 🚫 Hard Rules — Never Violate These

1. **Never use `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`** — use logical properties
2. **Never call wpApi directly in a page** — always use a hook
3. **Never hardcode Arabic/French text outside a translation object**
4. **Never add a new state management solution** — LangContext is the only context
5. **Never import from `flowbite-react/tailwind`** — that subpath was removed in v0.12
6. **Never use `require()` in config files** — the project is ESM (`"type": "module"`)
7. **Never add Framer Motion to components other than ChiffresClés**
8. **Never write inline styles** — Tailwind classes only
9. **Never use arbitrary Tailwind values** like `mt-[23px]` — use the scale
10. **Never import shadcn, MUI, Chakra or any other component library**

---

## 🔧 Config Files Reference

### `tailwind.config.js`
```js
import typography from '@tailwindcss/typography'
import flowbite from 'flowbite/plugin'

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './node_modules/flowbite-react/dist/**/*.js',
  ],
  theme: { extend: { colors: { navy: {...}, brand: {...} }, fontFamily: {...} } },
  plugins: [typography, flowbite],
}
```

### `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: 'dist' },
})
```

### `.env`
```
VITE_WP_API_URL=https://aosemploi.com/wp-json
```

---

## 👥 Team Responsibilities

| Area | Ilyas (Frontend) | Teammate (WordPress) |
|---|---|---|
| React app | ✅ | — |
| All 8 pages + components | ✅ | — |
| LangContext + RTL | ✅ | — |
| Mock data layer | ✅ | — |
| WordPress install | — | ✅ |
| CPT registration (services, portfolio) | — | ✅ |
| ACF field setup | — | ✅ |
| CORS configuration | — | ✅ |
| cPanel deployment + `.htaccess` | — | ✅ |

---

## 📅 Development Phases

### Phase 1 — Shell (current)
- [x] Vite + React 18 scaffolded
- [x] All dependencies installed and compatible
- [x] Tailwind + Flowbite configured
- [x] LangContext wired
- [x] Router with 9 routes
- [x] api.js with IS_MOCK flag
- [ ] Navbar + Footer
- [ ] Mock JSON files created

### Phase 2 — Core Pages
- [ ] HomePage (Hero + Actualités + ChiffresClés)
- [ ] ServicesPage
- [ ] AboutPage

### Phase 3 — Content Pages
- [ ] BlogPage + BlogPostPage
- [ ] PortfolioPage
- [ ] ContactPage (React Hook Form + Sonner)

### Phase 4 — Polish + Integration
- [ ] Connect real WP API (IS_MOCK = false)
- [ ] Espace Adhérent (scope TBD with supervisor)
- [ ] NotFoundPage
- [ ] Responsive audit (375px, 768px, 1280px, 1920px)
- [ ] cPanel deployment

---

## 📌 Open Decisions (Pending Supervisor)

| Item | Status |
|---|---|
| Action Orange `#F26522` — too bold for institutional? | ⏳ Awaiting M. KHALISSI |
| "Portfolio" page — rename or change content direction? | ⏳ Awaiting M. KHALISSI |
| Espace Adhérent — authentication? gated content? | ⏳ Scope undefined |

---

*Context file for Cursor AI — AOS Emploi project, Internship 2026*
*Developer: Ilyas Sennane*
