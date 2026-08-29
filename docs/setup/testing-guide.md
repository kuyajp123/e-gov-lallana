# Barangay Lallana E-Government — Testing Guide & Command Reference

This document outlines the testing architecture, frameworks, and commands for the Barangay Lallana E-Government system.

---

## 1. Overview & Test Architecture

The application uses **[Pest 5 PHP](https://pestphp.com/)** paired with **[Playwright](https://playwright.dev/)** for a multi-layer testing strategy:

```
tests/
├── Unit/                    # Fast isolated logic & helpers (Faker, converters)
├── Feature/                 # Full Laravel integration & Inertia page tests (50 tests)
│   ├── Auth/                # Fortify login, registration, password reset, 2FA, OTP
│   ├── Settings/            # Profile and security update endpoints
│   ├── LandingPageTest.php  # Public landing page sections & locale switcher
│   ├── OtpServiceTest.php   # OTP generation, verification, and rate limiting
│   ├── SmsServiceTest.php   # SMS provider abstraction & error simulation
│   └── TurnstileValidationTest.php # Cloudflare bot protection rules
└── Browser/                 # End-to-End (E2E) Browser Tests in Real Chromium (5 tests)
    ├── LandingPageTest.php  # Visual DOM smoke tests & section rendering
    ├── PublicInquiryTest.php # Public inquiry form rendering in browser
    └── AuthenticationFlowTest.php # Login UI rendering & resident auth
```

---

## 2. Command Reference

### One-Command Full Pipeline (Linters + Types + PHPStan + All 55 Tests)
To run the **entire quality and test suite** in one single command:

```bash
composer test:all
```
*or via npm:*
```bash
npm test
```

This single command executes in sequence:
1. 🔍 **ESLint**: `npm run lint:check`
2. 🎨 **Prettier Formatting**: `npm run format:check`
3. 🏷️ **TypeScript Type Check**: `npm run types:check`
4. 🧹 **Laravel Pint PHP Style**: `pint --parallel --test`
5. 🧠 **PHPStan / Larastan Static Analysis**: `phpstan analyse`
6. 🧪 **Feature & Unit Tests**: `php artisan test tests/Unit tests/Feature` (50 tests)
7. 🌐 **Playwright Chromium E2E Tests**: `php artisan test tests/Browser` (5 tests)

---

### Running Individual Test Suites

| Target | Composer Command | Direct Artisan Command | Description |
| :--- | :--- | :--- | :--- |
| **All Quality & Tests** | `composer test:all` | `npm test` | Runs Linters, TypeScript, PHPStan, and all 55 tests |
| **Feature Tests** | `composer test:feature` | `php artisan test tests/Feature` | Runs all 50 controller, model, & Inertia tests |
| **E2E Browser Tests** | `composer test:browser` | `php artisan test tests/Browser` | Launches real headless Chromium via Playwright |
| **Unit Tests** | `composer test:unit` | `php artisan test tests/Unit` | Runs unit tests |
| **Specific Test File** | — | `php artisan test tests/Feature/LandingPageTest.php` | Runs a single test file |
| **Filter by Name** | — | `php artisan test --filter="landing page"` | Runs tests matching a specific query |

---

## 3. Auto-Fixing Code Formatting

If any linting or formatting step fails, run:

```bash
# Auto-fix PHP formatting (Laravel Pint)
vendor/bin/pint --format agent

# Auto-fix TypeScript / React ESLint & Prettier formatting
npm run lint
npm run format
```

---

## 4. Continuous Integration (CI)

On every **Push** or **Pull Request** to `main` or `staging`, GitHub Actions automatically runs `composer ci:check` (`composer test:all`), guaranteeing that no pull request can be merged unless all linters, static analyzers, and 55 tests pass with a 100% green checkmark.
