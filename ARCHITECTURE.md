# AOS-Emploi Registration System - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER BROWSER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            REACT FRONTEND (Vue/Page Layer)               │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ Registration Pages (Bilingual FR/AR)            │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │ • /register         - Registration Form         │    │   │
│  │  │ • /registration-    - Confirmation Page        │    │   │
│  │  │   pending                                       │    │   │
│  │  │ • /signin           - Sign-in Form             │    │   │
│  │  │ • /espace-adherent  - Protected Member Area    │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ State Management                                │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │ • useAuth Hook      - Auth state & logic       │    │   │
│  │  │ • LangContext       - Language (FR/AR)         │    │   │
│  │  │ • localStorage      - Token persistence        │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ API Service (api.js)                            │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │ • wpApi Instance    - Axios with interceptors   │    │   │
│  │  │ • Token Management  - Set/Get/Clear auth token │    │   │
│  │  │ • AOS Endpoints     - Registration API calls    │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│                            ↓↑                                     │
│                        HTTPS/REST                                │
│                            ↓↑                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    WORDPRESS SERVER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           AOS REGISTRATION PLUGIN (PHP)                  │   │
│  │    wp-content/plugins/aos-registration/                  │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ REST API Endpoints (endpoints.php)              │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │ POST   /aos/v1/register      - Register user    │    │   │
│  │  │ POST   /aos/v1/signin        - Sign in          │    │   │
│  │  │ POST   /aos/v1/approve/{id}  - Approve (admin)  │    │   │
│  │  │ POST   /aos/v1/reject/{id}   - Reject (admin)   │    │   │
│  │  │ GET    /aos/v1/pending       - Get pending      │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ Business Logic (utils.php, email.php)           │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │ • JWT Token Generation                          │    │   │
│  │  │ • Unique Key Generation (AOS-XXXX-XXXX)        │    │   │
│  │  │ • Email Notifications                           │    │   │
│  │  │ • Validation & Sanitization                     │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ Admin Interface (admin-page.php)                │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │ • /wp-admin/admin.php?page=aos-approvals       │    │   │
│  │  │ • List pending registrations                    │    │   │
│  │  │ • Approve/Reject with one click                 │    │   │
│  │  │ • Real-time status updates                      │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ Database Operations (database.php)              │    │   │
│  │  ├─────────────────────────────────────────────────┤    │   │
│  │  │ • Create/Read/Update/Delete operations          │    │   │
│  │  │ • Query building with parameterization          │    │   │
│  │  │ • Table migrations                              │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│                            ↓↑                                     │
│                       SQL Queries                                │
│                            ↓↑                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     MYSQL DATABASE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────┬──────────────────────────┐    │
│  │ wp_aos_verified_employees   │ wp_aos_adherents         │    │
│  ├─────────────────────────────┼──────────────────────────┤    │
│  │ id (INT)                    │ id (INT)                 │    │
│  │ email (VARCHAR, UNIQUE)     │ email (VARCHAR, UNIQUE)  │    │
│  │ nom (VARCHAR)               │ nom (VARCHAR)            │    │
│  │ lieu_de_travail (VARCHAR)   │ lieu_de_travail (VARCHAR)│    │
│  │ created_at (DATETIME)       │ tel (VARCHAR)            │    │
│  │                             │ status (ENUM)            │    │
│  │ HR Data Source              │ unique_key (VARCHAR)     │    │
│  │ (Pre-populated)             │ approved_by (INT)        │    │
│  │                             │ approved_at (DATETIME)   │    │
│  │                             │ created_at (DATETIME)    │    │
│  │                             │ updated_at (DATETIME)    │    │
│  │                             │                          │    │
│  │                             │ Registration Records     │    │
│  │                             │ (Dynamic)                │    │
│  └─────────────────────────────┴──────────────────────────┘    │
│                                                                   │
│  Other WP Tables (users, posts, etc.)                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Registration Flow
```
User fills form
      ↓
[Frontend] validate form
      ↓
POST /wp-json/aos/v1/register
      ↓
[Backend] receive & sanitize
      ↓
Check if email in verified_employees
      ├─ NO → 403 Forbidden
      └─ YES ↓
Create record in aos_adherents (status=pending)
      ↓
Send admin email notification
      ↓
[Frontend] redirect to /registration-pending
```

### Approval Flow
```
Admin views /wp-admin/admin.php?page=aos-approvals
      ↓
[Frontend] GET /wp-json/aos/v1/pending
      ↓
[Backend] Check admin capability
      ├─ Not admin → 403 Forbidden
      └─ Is admin ↓
Return list of pending registrations
      ↓
Admin clicks "Approve"
      ↓
POST /wp-json/aos/v1/approve/{id}
      ↓
[Backend] Generate unique key
      ↓
Update aos_adherents (status=approved, unique_key, approved_by)
      ↓
Send user approval email with key
      ↓
[Frontend] show success message, refresh list
```

### Sign-In Flow
```
User goes to /signin
      ↓
Fills email + access key
      ↓
POST /wp-json/aos/v1/signin
      ↓
[Backend] query aos_adherents
      ├─ Not found or status!=approved → 401 Unauthorized
      └─ Found ↓
Generate JWT token
      ↓
Return token + user data
      ↓
[Frontend] store token in localStorage
      ↓
Redirect to /espace-adherent
      ↓
useAuth hook detects token
      ↓
Show authenticated content
```

### Protected Page Access
```
User visits /espace-adherent
      ↓
Component renders
      ↓
useAuth hook checks for token
      ├─ No token → redirect to /signin
      └─ Has token ↓
Check token validity (JWT exp)
├─ Expired → redirect to /signin
└─ Valid ↓
Render protected content
      ↓
All API requests include token in header
```

---

## Technology Stack

### Frontend
- **Framework**: React 18+
- **Language**: JavaScript (ES6+)
- **HTTP Client**: Axios
- **Routing**: React Router v6+
- **State**: React Hooks + Context API
- **Styling**: Tailwind CSS
- **Localization**: Custom LangContext (FR/AR)

### Backend
- **Server**: WordPress (any modern version)
- **Language**: PHP 7.4+
- **Database**: MySQL/MariaDB
- **Authentication**: JWT (custom implementation)
- **API**: REST API (WordPress native)
- **Email**: WordPress mail system

### Security
- **Token**: JWT (JSON Web Tokens)
- **Auth**: Token-based with localStorage
- **Validation**: Server-side parameterized queries
- **CORS**: WordPress headers
- **Admin**: WordPress capability system

---

## Request/Response Examples

### Register Request
```http
POST /wp-json/aos/v1/register HTTP/1.1
Content-Type: application/json

{
  "nom": "John Doe",
  "email": "john@company.com",
  "lieu_de_travail": "Paris",
  "tel": "+33123456789"
}
```

### Register Response (Success)
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "Registration submitted successfully",
  "adherent_id": 1
}
```

### Sign-In Request
```http
POST /wp-json/aos/v1/signin HTTP/1.1
Content-Type: application/json

{
  "email": "john@company.com",
  "unique_key": "AOS-AB12-CD34"
}
```

### Sign-In Response (Success)
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "John Doe",
    "email": "john@company.com",
    "lieu_de_travail": "Paris",
    "tel": "+33123456789"
  }
}
```

### Protected Request (with token)
```http
GET /wp-json/aos/v1/pending HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Component Hierarchy

```
App
├── LangContext (Provider)
│   └── Routes
│       ├── HomePage
│       ├── AboutPage
│       ├── ... (other pages)
│       │
│       ├── RegistrationPage
│       │   ├── Form (nom, email, lieu, tel)
│       │   └── useContext(LangContext) for i18n
│       │
│       ├── RegistrationPendingPage
│       │   └── Confirmation message
│       │
│       ├── SignInPage
│       │   ├── Form (email, unique_key)
│       │   └── setAuthToken on success
│       │
│       └── EspaceAdherentPage
│           ├── useAuth hook (check authenticated)
│           ├── useNavigate for redirect
│           └── Conditional rendering:
│               ├── If not authenticated → redirect to /signin
│               └── If authenticated → show member content
└── Other providers
```

---

## Environment Variables

```
VITE_WP_API_URL=http://localhost:8000
```

This should point to your WordPress installation (where the REST API is available).

---

## Deployment Considerations

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static host
- Set environment variables in deployment platform

### Backend
- Host WordPress on standard PHP hosting
- Ensure MySQL/MariaDB database is available
- Enable WordPress REST API (enabled by default)
- Install plugin on WordPress installation

### Database
- Regular backups of both wp_aos_* tables
- Monitor wp_aos_verified_employees (grows with HR data)
- Archive old registrations periodically

---

## Scaling Considerations

- Add indexing on email and status columns for large datasets
- Consider pagination for pending approvals list
- Implement caching for verified_employees (less frequent changes)
- Use CDN for frontend assets
- Monitor email queue if high volume expected

---

**Architecture Version**: 1.0.0  
**Last Updated**: January 2024
