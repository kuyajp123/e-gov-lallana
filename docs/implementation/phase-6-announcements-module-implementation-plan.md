# Phase 6: Announcements Module Implementation Plan

Implement the complete **Announcements Module** for Barangay Lallana according to [Progress Summary § Phase 6](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/progress-summary.md#L104-L111) and [Blueprint §24](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md#L665-L687). This module empowers Barangay Administrators and Staff (Sub-admins) to compose rich-text announcements with cover banners, classify them into standard categories, manage their publication lifecycle, and broadcast them across public and resident-facing portals.

---

## Architecture & Module Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               ANNOUNCEMENT LIFECYCLE                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ Admin / Sub-admin Dashboard (/admin/announcements)      │
       │   • List announcements with category & status filters   │
       │   • Quick publish / unpublish toggle                    │
       │   • Delete with confirmation                            │
       └────────────────────────────┬────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
       ┌──────────────────────┐             ┌──────────────────────┐
       │ Create Announcement  │             │  Edit Announcement   │
       │  • Title, Slug       │             │  • Update text/meta  │
       │  • Category select   │             │  • Replace banner    │
       │  • Tiptap Rich Editor│             │  • Reschedule dates  │
       │  • Banner upload     │             └──────────────────────┘
       └──────────┬───────────┘
                  │
                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │ Storage & File Records                                  │
       │   • `files` table (`FileRecord`)                        │
       │   • Public disk / Supabase `announcement-attachments`   │
       └──────────────────────────┬──────────────────────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       ┌──────────────────────┐        ┌───────────────────────┐
       │ Public Feeds         │        │ Resident Portal       │
       │  • Landing page feed │        │  • Resident Dashboard │
       │  • Dedicated list:   │        │    stream (/dashboard)│
       │    `/announcements`  │        │                       │
       │  • Single article:   │        └───────────────────────┘
       │    `/announcements/  │
       │     {slug}`          │
       └──────────────────────┘
```

---

## Specifications & Scope

### 1. Categories
Announcements are classified into four standard categories:
- **`Advisory`** (Default — community reminders, weather/health alerts)
- **`Event`** (Community gatherings, festivals, clean-up drives)
- **`Meeting`** (Barangay assemblies, council sessions, public consultations)
- **`Emergency`** (Urgent disaster alerts, public safety advisories)

### 2. Role Access & Permissions
- **Super Administrator** & **Barangay Administrator**: Full access (Create, Edit, Delete, Publish/Unpublish).
- **Sub-admin (Staff)**: Authorized to Create, Edit, and Publish/Unpublish announcements.
- **Residents & Public**: Read-only access to published announcements where `is_published = true` and `published_at <= now()`.

---

## Detailed Deliverables

### 1. Backend Controller, Requests & Routing
- `app/Http/Controllers/Admin/AdminAnnouncementController.php`:
  - `index`: Paginated announcements list with search, category filtering, and status filtering.
  - `create`: Renders creation page.
  - `store`: Validates input, uploads banner to `FileRecord`, generates slug, and persists announcement.
  - `edit`: Renders edit page with existing data.
  - `update`: Updates attributes and optional banner replacement.
  - `destroy`: Safely removes announcement and its banner from storage.
  - `togglePublish`: Quick toggle between published and draft states.
- `app/Http/Controllers/Public/PublicAnnouncementController.php`:
  - `index`: Public directory of published announcements.
  - `show`: Single announcement view by slug.
- Form Requests:
  - `app/Http/Requests/Admin/StoreAnnouncementRequest.php`
  - `app/Http/Requests/Admin/UpdateAnnouncementRequest.php`
- Routes in `routes/web.php`.

### 2. Frontend Tiptap Rich-Text Editor Component
- `resources/js/shared/components/rich-text-editor.tsx`:
  - WYSIWYG editor using `@tiptap/react`, `@tiptap/pm`, `@tiptap/extension-link`, `@tiptap/extension-image`, and `@tiptap/extension-placeholder`.
  - Toolbar with Heading levels (H2, H3), Bold, Italic, Bullet List, Numbered List, Blockquote, Link, Horizontal Rule, Undo/Redo.

### 3. Frontend Admin Management Pages
- `resources/js/pages/admin/announcements/index.tsx`: Table with search, category/status filters, publication toggle, thumbnail preview, and delete confirmation.
- `resources/js/pages/admin/announcements/create.tsx`: Creation form with title, slug, category, excerpt, banner upload, Tiptap editor, and publish date controls.
- `resources/js/pages/admin/announcements/edit.tsx`: Edit form with prefilled content and banner management.
- Update `resources/js/app/components/app-sidebar.tsx`: Add Announcements entry to admin navigation.

### 4. Frontend Public & Resident Feeds
- `resources/js/pages/public/announcements/index.tsx`: Clean public announcements page with search and category tabs.
- `resources/js/pages/public/announcements/show.tsx`: Single announcement reader page.
- Connect `resources/js/pages/welcome.tsx` and `resources/js/pages/dashboard.tsx` announcement feeds to `/announcements/{slug}`.

### 5. Automated Tests (Pest)
- `tests/Feature/Admin/AdminAnnouncementManagementTest.php`: Feature tests verifying admin CRUD, toggle, authorization, validation, and file deletion.
- `tests/Feature/Public/PublicAnnouncementTest.php`: Feature tests for public feed and single view.
