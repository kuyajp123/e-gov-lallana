# Dependency Gap Analysis
## Barangay Lallana E-Government System

> Analysis of what packages, APIs, and libraries the docs require that are **not yet installed**.

---

## Current Stack (Already Installed)

### PHP / Composer
| Package | Version | Role |
|---|---|---|
| `laravel/framework` | 13.26.1 | Core framework |
| `laravel/fortify` | 1.38.0 | Auth backend |
| `inertiajs/inertia-laravel` | 3.3.1 | Inertia server adapter |
| `fakerphp/faker` | 1.24.1 | Test data |
| `pestphp/pest` | 5.1.1 | Testing |
| `laravel/wayfinder` | 0.1.21 | Typed route generation |
| `larastan/larastan` | 3.10.0 | Static analysis |
| `laravel/pint` | 1.30.5 | Code formatter |

### JS / npm
| Package | Role |
|---|---|
| `react` / `react-dom` 19 | UI framework |
| `@inertiajs/react` v3 | Inertia React adapter |
| `tailwindcss` v4 | Styling |
| `@radix-ui/*` (12 packages) | Accessible primitives |
| `react-hook-form` + `@hookform/resolvers` | Form handling |
| `zod` | Schema validation |
| `zustand` | State management |
| `@tanstack/react-query` | Server state / data fetching |
| `lucide-react` | Icons |
| `sonner` | Toast notifications |
| `axios` | HTTP client |
| `laravel-vite-plugin`, `@inertiajs/vite` | Build tooling |
| `@laravel/vite-plugin-wayfinder` | Wayfinder Vite plugin |

---

## Gap Analysis — What the Docs Require But Is Not Yet Installed

---

### 1. 📝 Rich-Text Editor — **Tiptap** (JS)

**Source:** System Overview §24, Blueprint §24/§41 Phase 6  
**Requirement:** The announcement editor explicitly uses Tiptap for rich-text content with images, attachments, and links.

**Packages needed:**
```
@tiptap/react
@tiptap/pm
@tiptap/starter-kit
@tiptap/extension-image
@tiptap/extension-link
@tiptap/extension-placeholder
@tiptap/extension-character-count   (optional but useful)
```

> [!IMPORTANT]
> This is a hard requirement — the docs name Tiptap by name. No alternative should be used.

---

### 2. 📄 PDF Generation — PHP Package (Composer)

**Source:** System Overview §28, Blueprint §28/§29/§41 Phase 7  
**Requirement:** Server-side PDF generation for household info, resident info, RBI reports, and administrative reports.

**Options to evaluate (choose one):**

| Package | Composer | Notes |
|---|---|---|
| **`barryvdh/laravel-dompdf`** | `composer require barryvdh/laravel-dompdf` | Best for Blade-based PDF templates; most common Laravel choice |
| `spatie/laravel-pdf` | `composer require spatie/laravel-pdf` | Uses Chromium (Puppeteer); pixel-perfect but heavier |
| `mpdf/mpdf` | `composer require mpdf/mpdf` | Good Unicode/Filipino text support; heavier |

> [!IMPORTANT]
> **Recommendation: `barryvdh/laravel-dompdf`** — lightweight, Blade-template based, easiest to maintain. If layout fidelity is critical (RBI format), `spatie/laravel-pdf` is the premium option but requires Chromium.

---

### 3. 📱 QR Code Generation (PHP + optional JS)

**Source:** System Overview §29, Blueprint §25/§41 Phase 7, Database Spec §23  
**Requirement:** Generate opaque QR tokens for households/residents. Admin/sub-admin camera scanner to read QR codes in-app.

**Two parts needed:**

#### Server-side (QR generation):
```
simplesoftwareio/simple-qrcode    (composer require simplesoftwareio/simple-qrcode)
```
— or —
```
endroid/qr-code                   (composer require endroid/qr-code)
```
> [!NOTE]
> `simplesoftwareio/simple-qrcode` is the standard Laravel community pick. It wraps BaconQrCode and has a Facade.

#### Client-side (QR camera scanner):
```
@zxing/browser    (npm)
```
— or —
```
html5-qrcode      (npm)
```
> [!NOTE]
> `@zxing/browser` is the modern, maintained choice for React-based QR scanning via device camera.

---

### 4. 📨 SMS Provider Integration

**Source:** System Overview §6/§17, Blueprint §19/§23/§41 Phase 4  
**Requirement:** SMS verification for account activation + SMS notifications for document outcomes (Rejected, Returned, Completed/Ready for Pickup).

**No SMS package is currently installed.** Options:

| Service | Laravel Package | Notes |
|---|---|---|
| **Semaphore** | `tben/semaphore` or raw HTTP via Laravel Notification channel | Philippine SMS gateway — most commonly used locally |
| **Vonage (Nexmo)** | `laravel/vonage-notification-channel` | Global, higher cost |
| **Twilio** | `twilio/sdk` | Global, premium |
| **Infobip** | Raw HTTP / custom channel | Philippine support |

> [!IMPORTANT]
> The client must confirm which SMS provider they will subscribe to. This is a client-owned recurring cost. **Semaphore** is the most common choice for Philippine government/barangay projects.
>
> Laravel's notification system supports custom channels — a custom SMS channel can be built around any provider's API.

**Likely approach:** `laravel/vonage-notification-channel` or a custom Semaphore notification channel.

---

### 5. 📧 Email (Transactional)

**Source:** System Overview §6/§17, Blueprint §19/§23  
**Requirement:** Email verification for account activation + email notifications for document outcomes.

**Good news:** Laravel's built-in `Mail` facade + Fortify's email verification are already available via `laravel/framework` and `laravel/fortify`.

**What's missing:** A configured **transactional email provider** (SMTP/API driver). This is an infrastructure/environment concern, not a package concern — but the project will need one of:

| Service | Driver |
|---|---|
| Mailgun | `mailgun` (built-in) |
| Postmark | `postmark` (built-in) |
| AWS SES | `ses` (built-in) |
| Resend | `resend` (built-in since Laravel 11) |
| SMTP | any SMTP server |

> [!NOTE]
> No new composer package is needed if using a built-in driver. Only environment/config setup is required.

---

### 6. 🖼️ Image Compression / Processing (PHP)

**Source:** System Overview §30 ("Automatic compression where appropriate"), Blueprint §26  
**Requirement:** Image compression for uploaded government IDs and announcement images. File preview generation.

**Package needed:**
```
composer require intervention/image-laravel
```

> [!NOTE]
> `intervention/image-laravel` v3 is the current Laravel-compatible version (wraps Intervention Image v3). Supports GD and Imagick drivers. Used for resizing, compressing, and converting uploaded images.

---

### 7. 🌐 Localization / i18n (JS side)

**Source:** System Overview §34, Blueprint §33  
**Requirement:** English + Filipino language switching covering the full UI including system messages.

**Laravel's PHP side** is built-in (`lang/` files, `__()` helper).

**Inertia/React client side** needs a solution for translating React components:

| Option | Package | Notes |
|---|---|---|
| **tightenco/ziggy approach** | `mcamara/laravel-localization` (PHP) + pass translations via Inertia shared data | Simple; translations come from Laravel lang files |
| **react-i18next** | `npm install react-i18next i18next` | Full-featured i18n for React; separate from Laravel lang |
| **Custom Inertia shared prop** | No extra package | Pass `translations` object via `HandleInertiaRequests` middleware |

> [!NOTE]
> The **simplest approach** for this Laravel+Inertia stack: pass translations as Inertia shared props from Laravel's lang files — no extra JS package needed. However if complex pluralization/interpolation is needed, `react-i18next` is the standard.

---

### 8. 📁 File Upload Security / Validation (PHP)

**Source:** System Overview §30, Blueprint §26  
**Requirement:** File type validation, MIME type spoofing protection, file size limits, secure access.

**Laravel's built-in** validation rules (`mimes:`, `max:`, `file`) cover most of this.

**Optional package for deeper MIME detection:**
```
composer require league/mime-type-detection
```
> This is already a transitive dependency of Laravel's Flysystem — likely already available. No explicit install needed.

**For secure signed URL access to private files:** Laravel's built-in `Storage::temporaryUrl()` or `Storage::url()` with `private` disk suffices.

---

### 9. 🔒 Rate Limiting / Bot Protection (PHP)

**Source:** System Overview §31, Blueprint §36  
**Requirement:** Rate limiting and bot protection for auth routes, form submissions.

**Laravel's built-in** `ThrottleRequests` middleware + `RateLimiter` facade already cover rate limiting.

**For CAPTCHA/bot protection:**
```
composer require google/recaptcha
```
— or use **Cloudflare Turnstile** (no PHP package needed — JS widget + server-side token verification via HTTP).

> [!NOTE]
> This is optional and depends on whether the client wants CAPTCHA on registration/login. Laravel Fortify has built-in throttling.

---

### 10. 📊 Admin Tables — Search/Filter/Sort/Pagination (JS)

**Source:** System Overview §27, Blueprint §27  
**Requirement:** Server-side search, advanced filtering, sorting, pagination for admin tables.

**Already available:** `@tanstack/react-query` (already installed) handles server-state fetching.

**For table UI with built-in sorting/filtering/pagination:**
```
npm install @tanstack/react-table
```

> [!IMPORTANT]
> `@tanstack/react-table` (TanStack Table v8) is the standard headless table library for React. It integrates perfectly with the existing TanStack Query already in the project. **This is likely needed** given the admin tables requirement.

---

### 11. 🗓️ Date Handling (JS)

**Source:** Multiple — birthdates, residency dates, timestamps, document processing dates  
**Requirement:** Date formatting and manipulation throughout the UI.

**No date library is currently installed.** Options:

| Package | Notes |
|---|---|
| **`date-fns`** | Modern, tree-shakeable, no globals — recommended |
| `dayjs` | Small, moment-like API |
| `luxon` | Full-featured, timezone-aware |

> [!TIP]
> **Recommendation: `date-fns`** — tree-shakeable, plays well with TypeScript, standard React ecosystem choice.

---

### 12. 📋 Clipboard / QR Download (JS)

**Source:** Blueprint §25 (QR generation display)  
**Requirement:** Users may need to copy/download their QR code.

> [!NOTE]
> The modern `navigator.clipboard` API is sufficient — no package needed. For QR image download, the canvas API can handle it if using a canvas-based QR renderer.

---

## Summary Table

| # | What | Type | Package(s) | Priority |
|---|---|---|---|---|
| 1 | Rich-text editor (Tiptap) | JS (npm) | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link` + others | 🔴 Required |
| 2 | PDF generation | PHP (Composer) | `barryvdh/laravel-dompdf` *(recommended)* | 🔴 Required |
| 3a | QR code generation | PHP (Composer) | `simplesoftwareio/simple-qrcode` | 🔴 Required |
| 3b | QR camera scanner | JS (npm) | `@zxing/browser` | 🔴 Required |
| 4 | SMS notifications | PHP (Composer) | TBD by provider — likely custom Semaphore channel or `laravel/vonage-notification-channel` | 🔴 Required (client must choose provider) |
| 5 | Email transactional | Config only | Built-in Laravel driver — no package, just env config | 🟡 Config only |
| 6 | Image compression | PHP (Composer) | `intervention/image-laravel` | 🔴 Required |
| 7 | i18n (React side) | JS (npm) | `react-i18next` + `i18next` *(or pass via Inertia shared props — no package)* | 🟡 Optional package |
| 8 | File MIME security | PHP | Already covered by Laravel built-ins | ✅ Already available |
| 9 | Bot protection | PHP (Composer) | `google/recaptcha` or Cloudflare Turnstile (no package) | 🟡 Optional |
| 10 | Admin data tables | JS (npm) | `@tanstack/react-table` | 🔴 Required |
| 11 | Date formatting | JS (npm) | `date-fns` *(recommended)* | 🔴 Required |

---

## Open Questions for You

1. **SMS Provider** — Which SMS gateway will Barangay Lallana use? Semaphore, Vonage, Twilio, or another? This determines the PHP notification package/channel.
2. **PDF Engine** — Prefer lightweight Blade-based (`dompdf`) or pixel-perfect Chromium-based (`spatie/laravel-pdf`)? dompdf is simpler; spatie handles complex CSS better.
3. **i18n Strategy** — Use Inertia shared props to pass Laravel lang file strings to React (no extra JS package), or install `react-i18next` for a full JS i18n solution?
4. **File Storage** — Local disk for dev is fine, but production will need a decision: local server storage, or cloud (S3-compatible like Wasabi, AWS S3, etc.)? Laravel's `Storage` abstraction supports both without code changes.
5. **Bot Protection** — Do you want CAPTCHA on registration/login? If yes, recommend Cloudflare Turnstile (free) or reCAPTCHA v3.
