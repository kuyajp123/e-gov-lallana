# Implementation Plan — Phase 5: Administration & KPI Analytics

**Document:** Phase 5 Implementation Plan  
**Target System:** Barangay Lallana E-Government Web-Based Information System  
**Stack:** Laravel 12 (PHP 8.4), React 19, Inertia.js v3, Tailwind CSS v4, Filament PHP v5 (Admin Panel), Supabase PostgreSQL, Pest PHP 5  
**Reference Specs:**
* [`barangay-lallana-system-overview.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md) — §21 (Sub-admin Management), §23 (Data Archiving & Deletion), §26 (Admin Dashboard), §27 (Tables & Data Management)
* [`barangay-lallana-implementation-blueprint.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) — §5 (Administrative Roles), §30 (Admin Layout & Dashboard), §39 (Security & Policies), §41 Phase 5
* [`barangay-lallana-database-data-model-specification.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) — §25–§28 (Record Lifecycle, Permission Model), §39 (Demographic Reporting)
* [`progress-summary.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/progress-summary.md) — Phase 5 Target Scope

---

## 1. Overview & Key Architectural Decisions

Phase 5 builds the administrative intelligence, executive reporting, and supervisory controls for Barangay Lallana. It expands the initial verification interface into a comprehensive administrative portal featuring real-time KPI overview cards, demographic & sector distribution charts, full staff/sub-admin account management with super-admin guards, and administrative household restriction and archival lifecycles.

### Confirmed Architectural Decisions:

1. **Native Filament v5 Widgets:**
   All dashboard analytics and KPI cards will be implemented as native Filament widgets (`StatsOverviewWidget` and `ChartWidget`) registered with the admin panel. This ensures consistent styling, responsive layout, real-time query reactivity, and seamless integration with Filament's role-based authorization.

2. **Dynamic Demographic Aggregations (No Redundant Denormalization):**
   Per [Data Model §39](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md), reports and dashboard widgets will query normalized resident data (`resident_profiles.birthdate`, `gender`, `civil_status`, `senior_citizen_status`, `pwd_status`, `solo_parent_status`, `is_voter`) directly rather than maintaining duplicated counter tables.

3. **Sub-Admin vs. Admin Permission Boundaries:**
   - **Super-Admin / Admin:** Full authority to manage staff accounts, restrict/unrestrict households, archive households, and access all analytics.
   - **Sub-Admin (Staff):** Operational access only (verify households, process document requests, view resident profiles, view operational widgets). Strictly **forbidden** from managing staff accounts, restricting households, or archiving records.
   - **Super-Admin Protection:** Neither Admin nor Sub-Admin can edit, demote, deactivate, or delete a Super-Administrator. Users cannot delete or deactivate themselves.

4. **Administrative Household Restriction Lifecycle:**
   - When an Admin restricts a household, status becomes `restricted`.
   - Admin must provide a mandatory restriction reason (`review_notes`), recorded in the `verifications` table.
   - The resident dashboard immediately reflects the restriction with a high-visibility warning banner.
   - Document requests are locked for all household members via `belongsToVerifiedHousehold()`.
   - Admin can lift the restriction (`unrestrict`), returning the household to `verified` and dispatching an in-app and email alert.

5. **Record Archival Workflow:**
   - Important records are not permanently destroyed immediately. Inactive, closed, or delinquent households can be transitioned to `archived` status by an Admin.
   - Archived records can be restored by an Admin, or permanently deleted if necessary.

6. **Staff Account Lifecycle & Access Control:**
   - Admins can provision new staff accounts directly or promote existing registered residents.
   - Staff accounts can be activated or deactivated. Inactive staff accounts are immediately blocked from logging into the Filament admin panel (`canAccessPanel()` check).

---

## 2. Scope of Phase 5 Deliverables

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 5 DELIVERABLES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Admin Dashboard KPI Stat Cards (AdminStatsOverviewWidget)                │
│    ├── Total Registered Residents (with monthly trend indicator)            │
│    ├── Verified Households vs Total Households ratio                        │
│    ├── Pending Household Registrations counter                              │
│    ├── Active In-Flight Document Requests counter                           │
│    ├── Ready for Release / Pickup counter                                   │
│    └── Active Sub-Admins count (Admin-only visibility)                      │
│                                                                             │
│ 2. Visual Demographic & Sector Analytics (Filament Chart Widgets)           │
│    ├── DemographicsChartWidget: Age cohorts (Children, Youth, Working, Sr) │
│    ├── Sex distribution breakdown (Male, Female, Other)                     │
│    ├── SpecialSectorsChartWidget: Senior Citizens, PWDs, Solo Parents, Voter│
│    └── DocumentRequestVolumeChartWidget: Monthly request submission trend   │
│                                                                             │
│ 3. Staff & Sub-Admin Account Management (StaffResource)                     │
│    ├── Direct staff provisioning (Name, Email, Phone, Password, Role)       │
│    ├── Promote existing resident modal (retain existing feature)            │
│    ├── Edit staff modal (Name, Email, Phone, Role, Status)                  │
│    ├── Quick toggle for account activation/deactivation                     │
│    ├── Panel access enforcement: inactive staff rejected by canAccessPanel  │
│    ├── Super-admin protection guards (no demotion/deletion of super-admins) │
│    └── Policy enforcement: Sub-admins denied access to StaffResource (403)  │
│                                                                             │
│ 4. Household Restriction & Archival Lifecycles (HouseholdsTable)            │
│    ├── Enhanced restrict action: mandatory remarks, verifications log, alert│
│    ├── Unrestrict action: lifts restriction, logs audit, alerts head        │
│    ├── Archive action: transitions inactive households to archived status   │
│    ├── Restore action: unarchives household back to verified                │
│    └── Status filter and badge colors updated for archived status           │
│                                                                             │
│ 5. Resident Directory Enhancements (ResidentProfilesTable)                  │
│    ├── Calculated Age column from birthdate                                 │
│    └── Special classification filter for Solo Parents alongside Sr & PWD    │
│                                                                             │
│ 6. Automated Test Suite (Pest PHP)                                          │
│    ├── AdminStatsOverviewWidgetTest (KPI stat calculations)                 │
│    ├── StaffManagementTest (Provisioning, editing, deactivation, guards)    │
│    └── HouseholdRestrictionAndArchivalTest (Restriction, unrestrict, archive)│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Plan

### 3.1 Admin Dashboard KPI Widgets & Visual Charts

#### `app/Filament/Widgets/AdminStatsOverviewWidget.php`
- Extends `Filament\Widgets\StatsOverviewWidget`.
- Methods: `getStats(): array`.
- Stat items:
  - **Total Residents:** `ResidentProfile::count()`.
  - **Households:** `Household::where('status', 'verified')->count() . ' / ' . Household::count()`.
  - **Pending Verification:** `Household::whereIn('status', ['unverified', 'pending', 'returned'])->count()`.
  - **Active Document Requests:** `DocumentRequest::whereIn('current_status', ['pending', 'processing'])->count()`.
  - **Ready for Release:** `DocumentRequest::where('current_status', 'ready_for_pickup')->count()`.
  - **Active Sub-Admins:** `User::whereHas('role', fn($q) => $q->where('slug', 'sub_admin'))->where('status', 'active')->count()`, rendered only if `Auth::user()?->isAdmin()`.

#### `app/Filament/Widgets/DemographicsChartWidget.php`
- Extends `Filament\Widgets\ChartWidget`.
- Type: `doughnut` or `bar`.
- Dynamic age brackets calculated from `birthdate`:
  - `Children (0–14)`: `birthdate >= now()->subYears(14)`
  - `Youth (15–24)`: `birthdate between now()->subYears(24) and now()->subYears(15)`
  - `Working Age (25–59)`: `birthdate between now()->subYears(59) and now()->subYears(25)`
  - `Senior Citizens (60+)`: `birthdate <= now()->subYears(60)`

#### `app/Filament/Widgets/SpecialSectorsChartWidget.php`
- Extends `Filament\Widgets\ChartWidget`.
- Type: `bar`.
- Data sets:
  - Senior Citizens: `ResidentProfile::where('senior_citizen_status', true)->count()`
  - PWDs: `ResidentProfile::where('pwd_status', true)->count()`
  - Solo Parents: `ResidentProfile::where('solo_parent_status', true)->count()`
  - Registered Voters: `ResidentProfile::where('is_voter', true)->count()`

#### `app/Filament/Widgets/DocumentRequestVolumeChartWidget.php`
- Extends `Filament\Widgets\ChartWidget`.
- Type: `line`.
- Displays monthly submission volume across the past 6 months grouped by outcome.

#### `app/Providers/Filament/AdminPanelProvider.php`
- Register `AdminStatsOverviewWidget`, `DemographicsChartWidget`, `SpecialSectorsChartWidget`, and `DocumentRequestVolumeChartWidget`.
- Unregister generic placeholder widgets (`AccountWidget`, `FilamentInfoWidget`).

---

### 3.2 Staff & Sub-Admin Account Management

#### `app/Filament/Resources/Staff/StaffResource.php` & `StaffTable.php`
- Configure resource form schema:
  - Name, Email, Phone Number, Password, Role (`admin` vs `sub_admin`), Status (`active` vs `inactive`).
- Enhance `StaffTable`:
  - Columns: `name`, `email`, `phone_number`, `role.name` (badge), `status` (badge), `created_at`.
  - Filters: Role filter, Status filter.
  - Record Actions:
    - **Edit:** Modal form to update attributes.
    - **Toggle Status:** Fast action to activate/deactivate account.
    - **Revoke Sub-Admin:** Reverts sub-admin back to standard resident.
    - **Delete:** Admin-only delete action.
  - Security conditions:
    - Super-Admin accounts cannot be edited or deleted by normal Admins.
    - Current authenticated user cannot deactivate or delete themselves.

#### `app/Models/User.php`
- Update `canAccessPanel(Panel $panel)`:
  ```php
  return ($this->isAdmin() || $this->isSubAdmin() || $this->isSuperAdmin())
      && $this->status === 'active';
  ```

#### `app/Policies/UserPolicy.php`
- Restrict `viewAny`, `create`, `update`, `delete` strictly to Admin and Super-Admin.
- Sub-admins receive `false` on all staff management operations.

---

### 3.3 Household Restriction & Archival Lifecycles

#### `app/Filament/Resources/Households/Tables/HouseholdsTable.php`
- **Enhance `restrict` Action:**
  - Available when `Auth::user()?->isAdmin() && $record->status === 'verified'`.
  - Mandatory textarea for `review_notes`.
  - Sets `households.status = 'restricted'` and logs in `verifications` table.
  - Dispatches `NotificationService` alert `household_restricted` to family head.
- **Add `unrestrict` Action:**
  - Available when `Auth::user()?->isAdmin() && $record->status === 'restricted'`.
  - Prompts for confirmation and optional review notes.
  - Sets `households.status = 'verified'` and logs approval in `verifications` table.
  - Dispatches `NotificationService` alert `household_unrestricted` to family head.
- **Add `archive` Action:**
  - Available when `Auth::user()?->isAdmin() && in_array($record->status, ['restricted', 'rejected'])`.
  - Updates `status = 'archived'`.
- **Add `restore` Action:**
  - Available when `Auth::user()?->isAdmin() && $record->status === 'archived'`.
  - Updates `status = 'verified'`.
- Update filters and status badge colors:
  - Add `'archived' => 'gray'` to status color map.
  - Add `'archived' => 'Archived'` to status filter options.

#### `app/Policies/HouseholdPolicy.php`
- Enforce that `restrict`, `unrestrict`, `archive`, `restore`, and `delete` return `false` for Sub-admins and `true` for Admins.

---

### 3.4 Resident Directory Enhancements

#### `app/Filament/Resources/ResidentProfiles/Tables/ResidentProfilesTable.php`
- Add computed **Age** column (`birthdate` formatted to `X yrs`).
- Add **Solo Parent** ternary filter.

---

## 4. Automated Verification Plan

### Pest Feature Test Suite:
1. `tests/Feature/Filament/AdminStatsOverviewWidgetTest.php`:
   - Validates live KPI counts for residents, households, pending verifications, active document requests, and pickup items.
   - Confirms staff count is hidden from Sub-admins.
2. `tests/Feature/Filament/StaffManagementTest.php`:
   - Validates direct provisioning of new staff with password hashing.
   - Validates staff deactivation and confirms deactivated staff cannot access `/admin`.
   - Validates super-admin protection against deletion or demotion.
   - Validates that sub-admin receives 403 when trying to access staff management.
3. `tests/Feature/Filament/HouseholdRestrictionAndArchivalTest.php`:
   - Validates household restriction requires mandatory notes and dispatches notification.
   - Validates that members of restricted household are blocked from requesting documents.
   - Validates un-restriction restores verified status and notifies family head.
   - Validates household archival and restoration.
   - Validates sub-admin is forbidden from restriction and archival (403).

### Formatting:
- Run `vendor/bin/pint --dirty --format agent` to maintain code standards.
