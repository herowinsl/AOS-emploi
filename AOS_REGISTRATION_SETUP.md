# AOS-Emploi Registration & Approval System

Complete implementation guide for the verification-gated registration system with admin approval and unique access keys.

## 📋 Overview

The system provides a three-step registration workflow:
1. **User Registration**: Employee submits registration form (name, email, workplace, phone)
2. **Admin Approval**: Admin verifies email against HR database and approves registration
3. **User Sign-in**: User logs in with email + unique access key

---

## 🏗️ Architecture

### Backend (WordPress Plugin)
- **Location**: `/wp-content/plugins/aos-registration/`
- **Language**: PHP
- **REST API Endpoints**: 5 custom endpoints
- **Database Tables**: 2 tables (verified_employees, aos_adherents)
- **Admin Interface**: Custom WordPress admin page

### Frontend (React)
- **Location**: `/src/`
- **Language**: JavaScript/React
- **New Pages**: 3 pages (Registration, Pending, Sign-in)
- **Auth System**: Token-based (JWT)
- **Localization**: Bilingual (FR/AR)

---

## 🗄️ Database Schema

### Table: `wp_aos_verified_employees`
Stores the HR employee list (imported from HR system)

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| email | VARCHAR | Employee email (UNIQUE) |
| nom | VARCHAR | Employee name |
| lieu_de_travail | VARCHAR | Workplace |
| created_at | DATETIME | Creation timestamp |

### Table: `wp_aos_adherents`
Stores user registration records with approval status

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| email | VARCHAR | User email (UNIQUE) |
| nom | VARCHAR | User name |
| lieu_de_travail | VARCHAR | Workplace |
| tel | VARCHAR | Phone number |
| status | ENUM | 'pending', 'approved', 'rejected' |
| unique_key | VARCHAR | Access key (AOS-XXXX-XXXX) |
| approved_by | INT | Admin WP user ID |
| approved_at | DATETIME | Approval timestamp |
| created_at | DATETIME | Registration timestamp |
| updated_at | DATETIME | Last update timestamp |

---

## 🔌 REST API Endpoints

### 1. Register User
**Endpoint**: `POST /wp-json/aos/v1/register`

**Request Body**:
```json
{
  "nom": "John Doe",
  "email": "john@example.com",
  "lieu_de_travail": "Paris",
  "tel": "+33 1 23 45 67 89"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Registration submitted successfully",
  "adherent_id": 1
}
```

**Error Cases**:
- 400: Invalid email or phone format
- 403: Email not in verified employees list
- 409: Email already registered

---

### 2. Approve Registration (Admin Only)
**Endpoint**: `POST /wp-json/aos/v1/approve/{id}`

**Authentication**: WordPress admin capability (`manage_options`)

**Response** (200):
```json
{
  "success": true,
  "message": "Registration approved",
  "unique_key": "AOS-1ABC-2DEF"
}
```

**Response** (404):
```json
{
  "code": "not_found",
  "message": "Registration not found"
}
```

---

### 3. Reject Registration (Admin Only)
**Endpoint**: `POST /wp-json/aos/v1/reject/{id}`

**Authentication**: WordPress admin capability (`manage_options`)

**Response** (200):
```json
{
  "success": true,
  "message": "Registration rejected"
}
```

---

### 4. Get Pending Approvals (Admin Only)
**Endpoint**: `GET /wp-json/aos/v1/pending`

**Response** (200):
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "nom": "John Doe",
      "lieu_de_travail": "Paris",
      "tel": "+33 1 23 45 67 89",
      "status": "pending",
      "created_at": "2024-01-15 10:30:00"
    }
  ]
}
```

---

### 5. User Sign-in
**Endpoint**: `POST /wp-json/aos/v1/signin`

**Request Body**:
```json
{
  "email": "john@example.com",
  "unique_key": "AOS-1ABC-2DEF"
}
```

**Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "nom": "John Doe",
    "email": "john@example.com",
    "lieu_de_travail": "Paris",
    "tel": "+33 1 23 45 67 89"
  }
}
```

**Response** (401):
```json
{
  "code": "invalid_credentials",
  "message": "Invalid email or access key"
}
```

---

## 📁 File Structure

### Backend
```
wp-content/plugins/aos-registration/
├── aos-registration.php                 # Main plugin file
├── includes/
│   ├── database.php                    # Database operations
│   ├── endpoints.php                   # REST API endpoints
│   ├── email.php                       # Email notifications
│   ├── admin-page.php                  # Admin approval interface
│   └── utils.php                       # Utility functions
├── admin/
│   ├── aos-admin.js                    # Admin UI JavaScript
│   └── aos-admin.css                   # Admin UI styles
└── scripts/
    └── seed-verified-employees.php     # Employee data seeding script
```

### Frontend
```
src/
├── pages/
│   ├── RegistrationPage.jsx            # Registration form
│   ├── RegistrationPendingPage.jsx     # Confirmation page
│   ├── SignInPage.jsx                  # Sign-in form
│   └── EspaceAdherentPage.jsx          # Protected member area
├── hooks/
│   └── useAuth.js                      # Authentication hook
├── services/
│   └── api.js                          # API service (updated)
└── routes/
    └── index.jsx                       # Routes (updated)
```

---

## 🚀 Setup Instructions

### Step 1: Activate WordPress Plugin

1. Copy the plugin folder to: `/wp-content/plugins/aos-registration/`
2. Login to WordPress admin
3. Go to **Plugins** menu
4. Find "AOS Registration & Approval System"
5. Click **Activate**
6. The tables will be created automatically

### Step 2: Seed Employee Data

1. Go to WordPress admin
2. Create sample employee data in `wp_aos_verified_employees` table:
   - Using phpMyAdmin or similar tool
   - Or run the seeding script (see Development section)

### Step 3: Configure Frontend

1. Ensure `VITE_WP_API_URL` environment variable is set (already configured in `.env`)
2. Install dependencies: `npm install` or `pnpm install`
3. Start dev server: `npm run dev`

### Step 4: Create Admin User

The plugin uses WordPress `manage_options` capability for admin functions. Ensure at least one admin user exists in WordPress.

---

## 📧 Email Notifications

### Admin Notification (on Registration)
- **To**: WordPress admin email
- **Subject**: `[AOS-Emploi] Nouvelle inscription à approuver`
- **Content**: User details + link to approval dashboard

### User Approval Notification
- **To**: User email
- **Subject**: `[AOS-Emploi] Votre clé d'accès`
- **Content**: Unique access key + sign-in instructions

### User Rejection Notification
- **To**: User email
- **Subject**: `[AOS-Emploi] Décision concernant votre inscription`
- **Content**: Rejection message + contact info

---

## 🔐 Authentication & Security

### Token Management
- Tokens are JWT (JSON Web Tokens)
- Token expiration: 30 days
- Stored in browser localStorage
- Automatically attached to all API requests

### Access Control
- Registration: Public (but verifies email against HR database)
- Approval: Admin only (WordPress `manage_options`)
- Sign-in: Public (verifies email + unique key)
- Protected pages: Requires valid token

### Email Verification
All registrations verified against `verified_employees` table before creating record. This ensures only authorized employees can register.

---

## 🌐 Bilingual Support (FR/AR)

All pages support French and Arabic via the existing `LangContext`:
- Registration form labels and messages
- Pending page confirmations
- Sign-in form instructions
- Error messages

Users can toggle language using existing site language switcher.

---

## 🧪 Testing & Development

### Test Accounts

Use these emails (pre-seeded in verified_employees table):
- `john.doe@company.com`
- `jane.smith@company.com`
- `ahmed.hassan@company.com`
- `marie.bernard@company.com`
- `pierre.martin@company.com`

### Frontend Testing

1. **Register**: `/register` → Submit form with test email
2. **Check Admin Panel**: `/wp-admin/admin.php?page=aos-approvals`
3. **Approve**: Click approve button (generates access key)
4. **Sign In**: `/signin` → Enter email + key received via email
5. **Protected Page**: `/espace-adherent` → Should show authenticated content

### API Testing

Use tools like Postman or curl:

```bash
# Register
curl -X POST http://localhost:8000/wp-json/aos/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test User",
    "email": "test@company.com",
    "lieu_de_travail": "Paris",
    "tel": "+33123456789"
  }'

# Get pending (requires WP nonce)
curl -X GET http://localhost:8000/wp-json/aos/v1/pending \
  -H "Authorization: Bearer YOUR_WP_TOKEN"

# Approve (requires WP admin)
curl -X POST http://localhost:8000/wp-json/aos/v1/approve/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_WP_TOKEN"

# Sign in
curl -X POST http://localhost:8000/wp-json/aos/v1/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "unique_key": "AOS-XXXX-XXXX"
  }'
```

---

## 🔧 Customization

### Change Access Key Format

In `/wp-content/plugins/aos-registration/includes/utils.php`:

```php
function aos_generate_unique_key() {
    // Change format here (currently: AOS-XXXX-XXXX)
    $key = 'YOUR_PREFIX-' . bin2hex(random_bytes(4));
    // ... rest of function
}
```

### Change Token Expiration

In `/wp-content/plugins/aos-registration/includes/utils.php`:

```php
function aos_create_auth_token($adherent_id, $email) {
    // Change expiration time (currently: 30 days)
    'exp' => time() + (30 * 24 * 60 * 60) // Change this
}
```

### Update Email Templates

In `/wp-content/plugins/aos-registration/includes/email.php`:
- `aos_send_admin_notification()`
- `aos_send_approval_notification()`
- `aos_send_rejection_notification()`

---

## 🚨 Troubleshooting

### Tables Not Created
- Check WordPress version (requires 5.0+)
- Ensure plugin is activated
- Check database permissions

### Emails Not Sending
- Verify WordPress email configuration
- Check server mail function
- Look in WordPress error logs

### CORS Issues with API
- Ensure `VITE_WP_API_URL` is correct
- Check WordPress REST API is enabled
- Verify CORS headers in WordPress

### Authentication Not Working
- Check token is stored in localStorage
- Verify token hasn't expired
- Check browser console for errors

---

## 📚 Additional Resources

- WordPress REST API: https://developer.wordpress.org/rest-api/
- JWT Authentication: https://tools.ietf.org/html/rfc7519
- React Router: https://reactrouter.com/

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments and documentation
3. Check WordPress error logs at `/wp-content/debug.log`
4. Check browser console (F12) for frontend errors

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: Production Ready
