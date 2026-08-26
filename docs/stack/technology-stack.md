# Barangay Lallana E-Government System
## Technology Stack Documentation

**Document type:** Client Briefing — Infrastructure & Service Stack
**Prepared by:** Development Team
**Date:** August 2026
**Status:** Confirmed and finalized

---

## Overview

This document describes the complete set of technologies, platforms, and third-party services that the Barangay Lallana E-Government System is built on.

It is written so that the barangay, the project supervisor, and anyone responsible for the system after delivery can understand what the system uses, what each service does, what it costs, and what responsibilities the client holds.

---

## Table of Contents

1. [Architecture Summary](#1-architecture-summary)
2. [Application Framework](#2-application-framework)
3. [Database — Supabase PostgreSQL](#3-database--supabase-postgresql)
4. [File Storage — Supabase Storage](#4-file-storage--supabase-storage)
5. [Web Hosting — Render.com](#5-web-hosting--rendercom)
6. [SMS Gateway — TextBee](#6-sms-gateway--textbee)
7. [Email Notifications](#7-email-notifications)
8. [PDF Generation — Spatie Laravel PDF](#8-pdf-generation--spatie-laravel-pdf)
9. [Bot Protection — Cloudflare Turnstile](#9-bot-protection--cloudflare-turnstile)
10. [Full Cost Summary](#10-full-cost-summary)
11. [Client Responsibilities Checklist](#11-client-responsibilities-checklist)
12. [Free Tier Limitations & Upgrade Paths](#12-free-tier-limitations--upgrade-paths)
13. [Keepalive Strategy](#13-keepalive-strategy)
14. [Data Safety & Backup Summary](#14-data-safety--backup-summary)

---

## 1. Architecture Summary

The system is designed as a single consolidated application using a small number of specialized third-party services.

```
┌─────────────────────────────────────────────────────┐
│                 BARANGAY LALLANA SYSTEM              │
│                                                     │
│  Application Layer (Laravel + React)                │
│  Hosted on: Render.com                              │
│                                                     │
│  ┌─────────────────┐   ┌─────────────────────────┐  │
│  │  Supabase        │   │  TextBee (SMS)           │  │
│  │  ─ PostgreSQL DB │   │  ─ Client Android phone  │  │
│  │  ─ File Storage  │   │  ─ Notifications         │  │
│  └─────────────────┘   └─────────────────────────┘  │
│                                                     │
│  ┌─────────────────┐   ┌─────────────────────────┐  │
│  │  Email (SMTP)   │   │  Cloudflare Turnstile    │  │
│  │  ─ Notifications│   │  ─ Bot/spam protection   │  │
│  └─────────────────┘   └─────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Design principle:** Supabase serves double duty as both the database and file storage platform, which means the barangay only maintains one external data service account instead of two.

---

## 2. Application Framework

### What it is
The application is built using **Laravel** (a PHP web framework) for the server side and **React** (a JavaScript UI library) for the user interface. These two are connected using **Inertia.js**, which allows a modern, fluid single-page-app experience without requiring a completely separate frontend API.

### Key technologies included
| Technology | Purpose |
|---|---|
| Laravel 13 (PHP 8.4) | Server-side logic, database, authentication, file handling |
| React 19 | User interface components and pages |
| Inertia.js v3 | Connects Laravel backend to React frontend |
| Tailwind CSS v4 | Responsive, accessible UI styling |
| Laravel Fortify | Authentication backend (login, registration, email verification, 2FA) |

### Cost
**Free.** These are all open-source frameworks with no licensing fees.

### Who maintains this
The development team manages the application code. These frameworks are maintained by their respective open-source communities.

---

## 3. Database — Supabase PostgreSQL

### What it is
**Supabase** is an open-source cloud platform. The system uses Supabase's hosted **PostgreSQL** database to store all application data.

PostgreSQL is a proven, reliable open-source relational database used by governments, universities, and large organizations worldwide.

### What data is stored
- All user accounts and credentials
- All household and resident records
- All document requests and their status history
- Notifications, announcements, verification records
- QR identifiers
- All other system data

### Why Supabase for both database and storage
Since the system already uses Supabase for file storage (see Section 4), using Supabase PostgreSQL for the database consolidates both services under one platform. This means:

- One account to manage
- One dashboard to monitor
- One billing relationship
- Simplified backup strategy

### Cost — Supabase Free Tier
| Resource | Free Tier Limit |
|---|---|
| Database storage | **500 MB** |
| Monthly active users | Up to 50,000 |
| API requests | Unlimited |
| Active projects | Up to 2 |

**For a barangay-scale system, 500 MB of database storage is more than sufficient.** Household records, resident profiles, document requests, and announcements are primarily text data. The system is designed to store files separately in file storage (not embedded in the database), keeping database usage lean.

### Important: Supabase project inactivity pause
> [!WARNING]
> **Supabase pauses free-tier projects after 7 consecutive days with no database activity.**
>
> A paused project is **not deleted** — all your data is preserved. However, the application will be unavailable until the project is manually resumed from the Supabase dashboard.
>
> **Solution:** A lightweight database ping (keep-alive query) will be scheduled to run every few days via cron-job.org to prevent the project from pausing automatically. See Section 13.

### Data safety when paused
Your data is **not lost** when Supabase pauses a free-tier project. All records remain stored on disk. The project can be resumed at any time from the Supabase dashboard, and your data will be exactly as you left it.

### Setup responsibility
- The development team creates the Supabase project, schema, and connects the application.
- The client/barangay holds the Supabase account credentials after project delivery.

### Upgrade path
If the system grows beyond free tier limits, Supabase's **Pro plan starts at \$25/month** (~₱1,400/month) and includes 8 GB of database storage and significantly higher bandwidth.

---

## 4. File Storage — Supabase Storage

### What it is
The system stores all uploaded files in **Supabase Storage**, which is an S3-compatible object storage service. This is part of the same Supabase project as the database (Section 3).

### What files are stored
| File Category | Access Level |
|---|---|
| Government ID images (for household registration) | Private — secure access only |
| Government ID images (for document requests) | Private — secure access only |
| Announcement images | Configurable (public or restricted) |
| Announcement attachments / PDFs | Configurable |
| Verification supporting documents | Private — secure access only |

### Security model for sensitive files
**Government IDs and sensitive documents are never exposed through publicly accessible URLs.**

The system generates time-limited signed URLs — temporary links that expire after a short time — so only authorized administrators can view uploaded IDs. Once the link expires, the file cannot be accessed through that URL again.

### Storage layout (buckets)
The system uses three separate storage containers (called "buckets"):

| Bucket | Contents | Visibility |
|---|---|---|
| `government-ids` | All uploaded government IDs | Private |
| `verification-documents` | Supporting verification files | Private |
| `announcement-attachments` | Announcement images and files | Configurable |

### Cost — Supabase Storage (Free Tier)
| Resource | Free Tier Limit |
|---|---|
| File storage | **1 GB** |
| Bandwidth (egress) | 10 GB/month total |
| Bandwidth (cached CDN) | 5 GB of the above |

**1 GB of file storage accommodates a substantial number of government ID images.** A typical high-quality ID photo is 500 KB–2 MB. Even at 2 MB per upload, 1 GB supports approximately 500 uploaded ID images before needing an upgrade. The development team will implement automatic image compression to extend this further.

### Upgrade path
If storage grows beyond 1 GB, Supabase **Pro plan (\$25/month, ~₱1,400/month)** includes 100 GB of file storage.

---

## 5. Web Hosting — Render.com

### What it is
**Render.com** is a cloud platform where the application server is hosted. It runs the Laravel application and serves all web requests from users.

### Free tier behavior — the sleep policy
> [!IMPORTANT]
> **Render's free tier web services spin down (sleep) after 15 minutes of inactivity.**
>
> When asleep, the first request after inactivity will experience a **30–60 second cold start delay** while the server wakes up. After that, all subsequent requests respond at normal speed.
>
> **This is a known free-tier limitation.** The development team will configure a keepalive ping (see Section 13) to prevent the service from sleeping during active usage periods, such as the capstone defense.

### What stays when the server restarts
- **All database records** — stored in Supabase, not on the server. Safe.
- **All uploaded files** — stored in Supabase Storage, not on the server. Safe.
- **Application code** — deployed from the repository. Safe.

**The server itself holds no permanent data.** Render's free tier ephemeral filesystem is not a concern because the application is designed to store everything externally (Supabase).

### Cost
| Plan | Cost | Notes |
|---|---|---|
| Free | **₱0/month** | 15-minute sleep; 750 hours/month |
| Starter | ~\$7/month (~₱400/month) | No sleep; 24/7 uptime |

**For the capstone and initial delivery, the free tier is used.** If the system moves to production use where 24/7 availability without cold starts is required, upgrading to Render Starter at ~₱400/month is the direct solution.

### Deployment
The application is deployed automatically from the project's GitHub repository. Any approved code update pushed to the main branch can be deployed to Render.

### Setup responsibility
- The development team configures the Render deployment, environment variables, and build settings.
- The client/barangay holds the Render account credentials after delivery.

---

## 6. SMS Gateway — TextBee

### What it is
**TextBee** (textbee.dev) is an SMS gateway service that uses a real Android smartphone as the sending device. SMS messages are sent from the client's own phone number through the client's existing mobile carrier plan.

### What SMS is used for in the system
| Event | SMS Sent? |
|---|---|
| Account activation / contact verification | ✅ Yes |
| Document request rejected | ✅ Yes |
| Document returned for correction | ✅ Yes |
| Document completed / ready for pickup | ✅ Yes |
| Internal status changes (e.g., "Processing") | ❌ No — not externally notified |

### Why TextBee
- No per-message charges beyond the existing mobile carrier plan
- Free tier covers up to **300 messages/month**
- The phone number used is the client's own number (familiar to residents)
- No need for a separate SIM registration or telecom API subscription

### How it works
```
System event (e.g., document approved)
         ↓
Application sends request to TextBee API
         ↓
TextBee routes the request to the registered Android device
         ↓
Android device sends the SMS via the installed SIM card
         ↓
Resident receives SMS on their phone
```

### Cost
| Plan | Cost | Messages/Month |
|---|---|---|
| Free | **₱0/month** | 300 messages |
| Pro | \$9.99/month (~₱560/month) | Higher limits |

**300 messages/month is the free tier.** For a single barangay, this is a reasonable starting point. If the system sends more than 300 SMS per month, an upgrade or a carrier plan review may be needed.

### ⚠️ Critical client responsibility

> [!CAUTION]
> **The TextBee Android device must be operational at all times for SMS delivery to work.**
>
> Specifically, the client must ensure:
> 1. **The designated Android phone is always powered on and connected to mobile network.**
> 2. **The TextBee app on that phone is always running in the background** (not force-closed by the phone's battery optimization).
> 3. **The phone has sufficient mobile data or the TextBee app is set to send SMS through the phone's cellular plan.**
> 4. **The SIM card remains active and loaded** (if using prepaid).
>
> **If the phone goes offline, the TextBee app is closed, or the SIM runs out, SMS delivery will silently fail.** Residents will not receive SMS notifications until the device is restored. The system will still function — only the SMS notification delivery is affected.

### Setup requirements from the client
Before SMS can be tested, the client must:
- [ ] Install the TextBee app on the designated Android device
- [ ] Register the device at [textbee.dev](https://textbee.dev)
- [ ] Provide the development team with: **Device ID** and **API Key**
- [ ] Keep the phone on and online at all times during system use

### Fallback
If the client prefers email over SMS as the primary notification channel, the system supports email notifications through the same workflows. SMS can remain secondary or optional based on the resident's preference.

---

## 7. Email Notifications — Resend

### What it is
The system sends transactional emails for:
- Account verification (email verification link)
- Document status notifications (same events as SMS)
- Password reset

### Provider: Resend
**[Resend](https://resend.com)** is the confirmed email provider for this system.

### Cost & limits
| Resource | Free Tier |
|---|---|
| Monthly emails | 3,000 |
| Daily cap | **100 emails/day** |
| Domains | 1 |
| Credit card required | **No** |

**No billing method is needed to use Resend's free tier.** Sign up with an email and it's ready to use immediately.

The 100 emails/day cap is the practical constraint to monitor. Since external notifications only fire on final/action-required events (document completed, rejected, returned — not on every internal status change), a barangay would need to process 100+ document requests in a single day before hitting this limit.

### How it works
Laravel's built-in `Mail` facade connects to Resend's API using the `resend` driver (built into Laravel since v11). No additional package is needed.

### Setup responsibility
The development team configures the Resend API key in the application environment. No ongoing action is required from the client.

---

## 8. PDF Generation — Spatie Laravel PDF

### What it is
The system uses **Spatie Laravel PDF** — a PHP library — to generate PDF documents server-side.

### What PDFs are generated
- Individual resident information sheets
- Household information sheets
- Family member lists
- RBI (Record of Barangay Inhabitants) reports
- Administrative summary reports

### Engine used
The system starts with the **DOMPDF driver** — a PHP-native PDF engine that requires no additional server software. If the final RBI or other document layouts require more complex CSS (e.g., Tailwind-styled layouts), the system can switch specific documents to the **Browsershot driver** (Chromium-based) without restructuring the codebase.

### Completed documents and resident access
> [!NOTE]
> As defined in the functional scope, **residents cannot download completed government documents** (e.g., barangay clearances) through the system. Documents are released via physical pickup at the barangay hall.
>
> PDF export is for **administrative use** — generating reports and records for barangay staff and for exporting resident/household information.

### Cost
**Free.** Spatie Laravel PDF is an open-source package. DOMPDF is also open-source. No licensing fees.

---

## 9. Bot Protection — Cloudflare Turnstile

### What it is
**Cloudflare Turnstile** is a CAPTCHA-like bot protection tool. It verifies that actions like account registration and login are performed by real human users, not automated bots or spam scripts.

### Where it appears in the system
- Household registration form (public-facing)
- Login form

### Why Cloudflare Turnstile
- Completely **free** with no monthly usage caps
- More privacy-friendly than traditional reCAPTCHA (does not harvest user data for advertising)
- Does not require users to solve image puzzles — challenges are invisible or minimal
- No Cloudflare account tier required for the domain

### Cost
**Free. Unlimited verifications.** Cloudflare Turnstile has no usage fees.

### Setup responsibility
The development team registers the site on the Cloudflare dashboard and integrates Turnstile into the registration and login forms. No ongoing setup is required from the client.

---

## 10. Full Cost Summary

### Monthly cost table (current stack — free tier)

| Service | Provider | Cost/Month | Notes |
|---|---|---|---|
| Application hosting | Render.com | **₱0** | Free tier; 15-min sleep policy |
| Database | Supabase (PostgreSQL) | **₱0** | Free tier; 500 MB storage |
| File storage | Supabase Storage | **₱0** | Free tier; 1 GB storage |
| SMS gateway | TextBee | **₱0** | Free tier; 300 SMS/month |
| Email notifications | Resend (or similar) | **₱0** | Free tier; 3,000 emails/month |
| PDF generation | Spatie Laravel PDF | **₱0** | Open-source, no fees |
| Bot protection | Cloudflare Turnstile | **₱0** | Permanently free |
| Keepalive pings | cron-job.org | **₱0** | Permanently free |
| **TOTAL** | | **₱0/month** | During development and initial deployment |

> [!IMPORTANT]
> **The recurring infrastructure cost during the capstone/development phase is ₱0 per month.** All services used are on permanently free or generous free tiers that are sufficient for a single-barangay system at expected usage levels.

---

### If the system goes into full production use

If Barangay Lallana decides to run this system as a permanent operational service beyond the capstone project, the following upgrades would be the primary considerations:

| Trigger | Recommended Upgrade | Cost |
|---|---|---|
| System needs 24/7 uptime without cold starts | Render Starter plan | ~\$7/month (~₱400/month) |
| Database exceeds 500 MB | Supabase Pro | \$25/month (~₱1,400/month) |
| File storage exceeds 1 GB | Supabase Pro (includes 100 GB storage) | Covered by Pro plan above |
| SMS exceeds 300/month | TextBee Pro | \$9.99/month (~₱560/month) |
| **Realistic production monthly cost** | | **~₱400–₱2,400/month** |

**Note:** Supabase Pro covers both database and storage under a single \$25/month plan. This is the main advantage of consolidating on Supabase.

---

## 11. Client Responsibilities Checklist

The following items require action from the client/barangay — not the development team.

### Before development can be completed

- [ ] **TextBee device setup** — Install TextBee app on the designated Android phone, register at textbee.dev, and provide the development team with the **Device ID** and **API Key**.
- [ ] **Confirm the designated TextBee phone** — This phone must be kept on and online at all times. It becomes the barangay's SMS-sending device.

### Before going live

- [ ] **Create a Supabase account** at [supabase.com](https://supabase.com) — The developer will set up the project inside this account. The account will used is not known yet.
- [ ] **Create a Render account** at [render.com](https://render.com) — The developer will deploy the application here. The account will used is not known yet.
- [ ] **Create a cron-job.org account** at [cron-job.org](https://cron-job.org) — Used to keep the Render service and Supabase project alive. Free.
- [ ] **Set up an email provider account** (e.g., Resend at [resend.com](https://resend.com)) — The developer will configure the integration.

### Ongoing operational responsibilities

- [ ] **Keep the TextBee Android device powered on and connected to mobile network at all times.**
- [ ] **Keep the TextBee app running in the background** (check phone battery optimization settings — exempt the TextBee app from battery saver if needed).
- [ ] **Monitor Supabase dashboard** — If the project ever shows as "Paused," resume it from the dashboard. Data is not lost.
- [ ] **Maintain the SIM card** in the TextBee device — ensure it is active, has credit (if prepaid), and the phone plan supports outgoing SMS.

---

## 12. Free Tier Limitations & Upgrade Paths

This table summarizes known limitations and what to do when they are reached.

| Service | Limitation | Behavior When Reached | Fix |
|---|---|---|---|
| **Render.com** | Sleep after 15 min inactivity | 30–60 sec cold start on next request | Upgrade to \$7/mo Starter, or use keepalive |
| **Supabase** | Pauses after 7 days no activity | App goes offline; data preserved | Resume from dashboard; or use keepalive ping |
| **Supabase DB** | 500 MB database storage | Writes may fail when full | Upgrade to Pro (\$25/mo) |
| **Supabase Storage** | 1 GB file storage | Uploads may fail when full | Upgrade to Pro (included) |
| **TextBee** | 300 SMS/month free | SMS stops sending | Upgrade to TextBee Pro (\$9.99/mo) |
| **Resend email** | 3,000 emails/month | Emails stop sending | Upgrade to Resend paid plan |

> [!NOTE]
> The free tier limits described here are appropriate for a single barangay. A barangay with hundreds of households generating dozens of document requests per month will comfortably stay within these limits. The limits become a concern only when the system expands significantly or moves to high-traffic public use.

---

## 13. Keepalive Strategy

Two separate keepalive mechanisms are used to prevent free-tier services from sleeping or pausing:

### Render.com — web server keepalive

**Tool:** cron-job.org (free)
**Frequency:** Every 10 minutes
**What it does:** Sends a lightweight HTTP request to the application URL, which prevents Render from sleeping the web service.

> During the capstone defense, the development team will verify that the cron job is active and the service is warmed up before the presentation begins.

### Supabase — database keepalive

**Tool:** cron-job.org or a scheduled Laravel command
**Frequency:** Every 3–4 days
**What it does:** Runs a simple, harmless database query (e.g., a count of records) to register activity, preventing Supabase from pausing the project.

---

## 14. Data Safety & Backup Summary

| Data Type | Where Stored | What Happens if Server Restarts | Backup Strategy |
|---|---|---|---|
| All household/resident records | Supabase PostgreSQL | **Not affected** — database is external | Supabase automatic daily backups (free tier: 1 backup) |
| Uploaded files (IDs, documents) | Supabase Storage | **Not affected** — storage is external | Supabase Storage is durable object storage |
| Announcement content | Supabase PostgreSQL | **Not affected** | Same as above |
| Application code | GitHub repository | **Not affected** — redeployed from repo | Git version history |

> [!IMPORTANT]
> **No application data is stored on the Render server itself.** All database records and files are stored in Supabase. Even if Render restarts, redeploys, or is temporarily unavailable, no data is lost.

### Manual backup recommendation
For extra safety, the development team will document the process for manually exporting a database backup from Supabase's dashboard. The barangay administrator should do this periodically, especially before important dates (e.g., before the capstone defense).

---

## Appendix: Service URLs

| Service | Website | Purpose |
|---|---|---|
| Supabase | [supabase.com](https://supabase.com) | Database + file storage |
| Render | [render.com](https://render.com) | Application hosting |
| TextBee | [textbee.dev](https://textbee.dev) | SMS gateway |
| Resend | [resend.com](https://resend.com) | Transactional email |
| Cloudflare | [dash.cloudflare.com](https://dash.cloudflare.com) | Turnstile bot protection |
| cron-job.org | [cron-job.org](https://cron-job.org) | Scheduled keepalive pings |
| GitHub | [github.com](https://github.com) | Application code repository |
