# Admin Authentication & Environment Setup Guide

This document explains the architecture, configuration, and management workflows for **Super Administrators** and **Sub-Administrators** in the Barangay Lallana E-Government Information System.

---

## 1. Architectural Overview

* **Single Unified Login (`/login`):** There is no separate `/admin/login` page. Both residents and administrators sign in through the primary login page.
  * **Admins & Sub-Admins:** Automatically redirected to `/admin` (Filament Admin Panel).
  * **Residents:** Automatically redirected to `/dashboard`.
* **404 Obscurity Barrier:** If an authenticated resident attempts to access `/admin` or `/admin/*`, the system returns an **HTTP 404 Not Found** response instead of 403 Forbidden. This intentionally obscures the existence of administrative endpoints.
* **Authoritative Environment Control (`.env`):** Super Administrators are managed authoritatively via the `SUPER_ADMINS` environment variable.
* **Zero-Command On-The-Fly Sync:** When an administrator attempts to log in via `/login`, the system synchronizes credentials from `.env` directly into the database on-the-fly. No prior user registration or terminal commands are required.

---

## 2. Local Environment Configuration (`.env`)

Add the `SUPER_ADMINS` JSON array to your local `.env` file:

```ini
SUPER_ADMINS='[{"name": "Paul (Lead Dev)", "email": "kuyajp123@gmail.com", "password": "your-secure-password"}, {"name": "Barangay Admin", "email": "admin@lallana.gov.ph", "password": "your-secure-password"}]'
```

### Format Rules for `.env`:
1. Enclose the entire JSON array in **single quotes** (`'...'`).
2. Use **double quotes** (`"..."`) for JSON object keys (`"name"`, `"email"`, `"password"`).
3. You can define multiple administrators inside the array.

### How to Add or Remove Admins:
* **To Add an Admin:** Add an object to the JSON array in `.env`. They can immediately log in via `/login`.
* **To Remove an Admin:** Remove the object from the JSON array in `.env`. On the next login or sync, the unlisted administrator record is automatically deleted from the database.

---

## 3. Production Deployment (e.g., Vercel Dashboard)

When configuring environment variables in external cloud platforms or hosting dashboards (such as Vercel, Laravel Cloud, Railway, or Fly.io):

### Step-by-Step Vercel Setup:
1. Open your **Vercel Dashboard** and select the project.
2. Go to **Settings** $\rightarrow$ **Environment Variables**.
3. Set the **Key**:
   ```text
   SUPER_ADMINS
   ```
4. Set the **Value** (paste the raw JSON directly without surrounding single quotes):
   ```json
   [{"name": "Barangay Admin", "email": "admin@lallana.gov.ph", "password": "your-production-password"}]
   ```
5. Select the relevant environments (**Production**, **Preview**, **Development**).
6. Click **Save** and trigger a **Redeploy** to apply changes.

---

## 4. Sub-Admin Staff Management (`/admin/staff`)

Sub-Admins (Barangay Staff) are managed from inside the Filament Admin Panel:

1. Log in as a Super Admin and navigate to **Administration $\rightarrow$ Staff Management** (`/admin/staff`).
2. Click **Designate Sub-Admin**:
   * Enter the email of an **already-registered resident**.
   * **Strict Validation:** If the email does not exist in the system, the action is rejected:
     > *"No registered resident found with this email. The user must register first before they can be designated as a Sub-Admin."*
   * On submit, the user's role is updated to `sub_admin`.
3. **Revoking Access:**
   * In the Staff table, click **Revoke Access** on any Sub-Admin row to revert their account back to a standard resident (`resident` role).
4. **Access Restrictions:**
   * Only Super Administrators (`admin` role) have access to the Staff Management module.

---

## 5. CLI & Seeder Utilities (Optional)

While login sync happens automatically on-the-fly, you can also run synchronization manually from terminal:

* **Sync Super Admins via Artisan:**
  ```powershell
  php artisan app:bootstrap-admins
  ```
* **Sync during database seeding:**
  ```powershell
  php artisan db:seed
  ```

---

## 6. Troubleshooting & FAQs

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| *"These credentials do not match our records"* on admin login | Typo in password or email; password is case-sensitive. | Ensure the password matches the exact case defined in `.env` (e.g. `password` vs `Password`). |
| Unstyled HTML on admin pages | Missing published Filament frontend assets. | Run `php artisan filament:assets` and `php artisan optimize:clear`. |
| Resident sees 404 when visiting `/admin` | Intentional security behavior. | Only users with `admin` or `sub_admin` roles can view `/admin`. Regular residents receive a 404 response. |
