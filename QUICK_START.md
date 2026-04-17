# AOS-Emploi Registration System - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Activate Plugin (2 min)
```
1. Copy folder: wp-content/plugins/aos-registration/
2. WordPress Admin → Plugins → Activate "AOS Registration & Approval System"
3. Tables created automatically ✓
```

### Step 2: Add Test Employees (1 min)
Add these emails to `wp_aos_verified_employees` table using phpMyAdmin:

| Email | Name | Location |
|-------|------|----------|
| john.doe@company.com | John Doe | Paris |
| jane.smith@company.com | Jane Smith | Lyon |
| ahmed.hassan@company.com | Ahmed Hassan | Marseille |

### Step 3: Start Frontend (1 min)
```bash
npm install
npm run dev
```

### Step 4: Test It! (1 min)
1. Go to `http://localhost:5173/register`
2. Fill form with John Doe's email
3. Submit → See confirmation page
4. Go to `/wp-admin/admin.php?page=aos-approvals`
5. Click Approve → Email sent with key
6. Go to `/signin`
7. Enter email + key from email
8. Access `/espace-adherent` ✓

---

## 🔗 Important URLs

### Frontend
- Registration: `http://localhost:5173/register`
- Sign In: `http://localhost:5173/signin`
- Member Area: `http://localhost:5173/espace-adherent`

### Backend Admin
- Approvals: `http://localhost:8000/wp-admin/admin.php?page=aos-approvals`
- Plugins: `http://localhost:8000/wp-admin/plugins.php`

### API Base
- Root: `http://localhost:8000/wp-json/aos/v1/`

---

## 📝 Form Fields

### Registration Form
```
Nome (Name):          Text field, required
Email:                Email field, required (must be in verified_employees)
Lieu de travail:      Text field, required
Tel:                  Phone field, required (10+ digits)
```

### Sign-In Form
```
Email:                Email field, required
Clé d'accès:          Text field, required (format: AOS-XXXX-XXXX)
```

---

## 📧 Email Templates

### Admin Email
Sent when user registers. Contains:
- User name, email, location, phone
- Link to approval dashboard
- Click link → Approve registration

### User Email (on Approval)
Contains:
- Welcome message
- Unique access key (AOS-XXXX-XXXX)
- Sign-in instructions
- Link to /signin page

### User Email (on Rejection)
Contains:
- Rejection notice
- Contact info for support

---

## 🔐 How It Works

```
1. USER REGISTERS
   Email validated ✓
   Check vs. HR list ✓
   Pending status ✓
   
2. ADMIN APPROVES
   Unique key generated ✓
   Email sent to user ✓
   
3. USER SIGNS IN
   Email + key verified ✓
   JWT token issued ✓
   
4. USER ACCESSING PAGES
   Token stored locally ✓
   Attached to all requests ✓
   Can access /espace-adherent ✓
```

---

## 🧪 Test Cases

### Test 1: Valid Registration
```
Email: john.doe@company.com
Result: ✓ Pending approval
```

### Test 2: Unverified Email
```
Email: unknown@company.com
Result: ✗ "Email not in employee list"
```

### Test 3: Duplicate Registration
```
Email: john.doe@company.com (2nd time)
Result: ✗ "Email already registered"
```

### Test 4: Invalid Phone
```
Phone: 123
Result: ✗ "Invalid phone format"
```

### Test 5: Invalid Email
```
Email: notanemail
Result: ✗ "Invalid email format"
```

### Test 6: Sign-In with Wrong Key
```
Email: john.doe@company.com
Key: WRONG-KEY
Result: ✗ "Invalid credentials"
```

### Test 7: Protected Page Without Login
```
Visit: /espace-adherent (not logged in)
Result: → Redirect to /signin
```

### Test 8: Logout
```
Click logout button
Result: Token removed, redirect to /signin
```

---

## 🌐 Language Switching

Use site language switcher to test:
- **French (FR)** - Default
- **Arabic (AR)** - Full RTL support

All pages automatically translate:
- Form labels
- Button text
- Error messages
- Confirmation text

---

## 🔑 Access Key Format

Generated format: `AOS-XXXX-XXXX`

Example: `AOS-3A7F-9B2E`

Note: Keys are unique, 8 characters, alphanumeric

---

## 💾 Database Queries

### View All Registrations
```sql
SELECT * FROM wp_aos_adherents ORDER BY created_at DESC;
```

### View Pending Approvals
```sql
SELECT * FROM wp_aos_adherents WHERE status = 'pending';
```

### View Approved Users
```sql
SELECT email, nom, unique_key FROM wp_aos_adherents WHERE status = 'approved';
```

### View Verified Employees
```sql
SELECT * FROM wp_aos_verified_employees;
```

---

## 🛠️ Troubleshooting

### Plugin Not Showing
- ✓ Check folder is in `/wp-content/plugins/`
- ✓ Verify main file is `aos-registration.php`
- ✓ Try deactivate/reactivate

### Tables Not Created
- ✓ Check database permissions
- ✓ Look in `wp-content/debug.log` for errors
- ✓ Try reinstalling plugin

### Emails Not Sending
- ✓ Check WordPress email settings
- ✓ Verify `admin_email` in WordPress settings
- ✓ Check server mail function is enabled

### API Returns 404
- ✓ Verify REST API is enabled
- ✓ Check `VITE_WP_API_URL` is correct
- ✓ Try flushing permalinks: Settings → Permalinks → Save

### Can't Approve Registrations
- ✓ Must be logged in as admin
- ✓ User must have `manage_options` capability
- ✓ Try logging out and back in

### Token Not Persisting
- ✓ Check localStorage is enabled in browser
- ✓ Clear browser storage and try again
- ✓ Check browser developer console for errors

---

## 📱 Mobile Testing

All pages are responsive:
- Mobile (320px+): Full functionality
- Tablet (768px+): Optimized layout
- Desktop (1024px+): Full experience

Test on different screen sizes to verify layout.

---

## 🎯 Admin Tasks

### Daily
1. Check `/wp-admin/admin.php?page=aos-approvals`
2. Approve pending registrations
3. Reject suspicious entries

### Weekly
1. Review approval logs
2. Check for unverified attempts
3. Monitor email notifications

### Monthly
1. Backup database
2. Review and archive old records
3. Audit access logs

---

## 🚀 Production Deployment

### Before Going Live
1. ✓ Test with real employee data
2. ✓ Configure production WordPress email
3. ✓ Set production database
4. ✓ Update environment variables
5. ✓ Test all pages on target domain
6. ✓ Enable HTTPS
7. ✓ Backup database
8. ✓ Monitor error logs

### On Live
1. Monitor admin dashboard daily
2. Watch email delivery
3. Check server logs
4. Be ready to support users

---

## 📞 Common Questions

**Q: Can I change the access key format?**  
A: Yes, edit `aos_generate_unique_key()` in `includes/utils.php`

**Q: How long are access keys valid?**  
A: Indefinitely until user signs in (stays in database)

**Q: Can users change their password?**  
A: Currently uses access key only. Can add password feature.

**Q: How long does JWT token last?**  
A: 30 days. Change in `aos_create_auth_token()` if needed.

**Q: Can I add more form fields?**  
A: Yes, add to database schema and form components.

**Q: Can I customize email templates?**  
A: Yes, edit `includes/email.php` functions.

---

## 📚 Documentation

Full docs available:
- **Setup Guide**: `AOS_REGISTRATION_SETUP.md`
- **Architecture**: `ARCHITECTURE.md`
- **Implementation**: `IMPLEMENTATION_COMPLETE.md`
- **This Guide**: `QUICK_START.md`

---

## ✅ Checklist

Before launching:
- [ ] Plugin activated
- [ ] Test employees added to verified_employees
- [ ] Frontend dev server running
- [ ] Tested complete flow (register → approve → signin)
- [ ] Email notifications working
- [ ] Bilingual (FR/AR) working
- [ ] Admin dashboard accessible
- [ ] Protected pages require login
- [ ] Error messages display correctly
- [ ] Database backups configured

---

## 🎉 You're Ready!

Everything is set up and ready to go. Start with `/register` and test the complete flow.

**Need Help?** Check the full documentation files or review the code comments.

**Questions?** See Common Questions section above.

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: ✅ Ready to Deploy
