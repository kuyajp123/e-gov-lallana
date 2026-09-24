# Barangay Lallana E-Government System (E-Gov Lallana)

A modern civil registry and public document processing platform for Barangay Lallana, built with **Laravel 12**, **Inertia.js v3**, **React 19**, **Tailwind CSS v4**, and **Filament v5**.

---

## Table of Contents

- [System Requirements](#system-requirements)
- [Recommended Installation Methods](#recommended-installation-methods)
  - [Method 1: Fast Setup via Laravel Herd (Recommended)](#method-1-fast-setup-via-laravel-herd-recommended)
  - [Method 2: Manual Installation (Windows, macOS, Linux)](#method-2-manual-installation-windows-macos-linux)
- [Step-by-Step Installation Guide](#step-by-step-installation-guide)
- [Running the Application](#running-the-application)
- [Database & Seeded Accounts](#database--seeded-accounts)
- [Useful Development Commands](#useful-development-commands)
- [Troubleshooting & FAQ](#troubleshooting--faq)

---

## System Requirements

Before setting up the project, make sure the following runtimes and tools are installed on your device:

| Tool | Required Version | Download Link | Notes |
| :--- | :--- | :--- | :--- |
| **Git** | Latest (2.x+) | [git-scm.com](https://git-scm.com/downloads) | Required for cloning and managing code. |
| **PHP** | **8.3** or **8.4** | [php.net](https://www.php.net/downloads) or Herd | On Windows: choose **VS17 x64 Thread Safe (Zip)**. |
| **Composer** | **2.x+** | [getcomposer.org](https://getcomposer.org/download/) | PHP dependency manager. |
| **Node.js & npm** | **v20 LTS** or **v22 LTS** | [nodejs.org](https://nodejs.org/) | Compiles the Inertia + React frontend. |
| **Database** | **SQLite** *(Default)* | Pre-packaged with PHP | Zero-configuration local database. Optional: PostgreSQL or MySQL. |

### Required PHP Extensions
Ensure these extensions are enabled in your `php.ini` file:
- `bcmath`, `curl`, `fileinfo`, `gd`, `mbstring`, `openssl`, `pdo_sqlite` *(or `pdo_mysql` / `pdo_pgsql`)*, `tokenizer`, `xml`, `zip`.

---

## Recommended Installation Methods

### Method 1: Fast Setup via Laravel Herd (Recommended)

If you are on **Windows** or **macOS**, the easiest and cleanest way to get a complete environment is via **[Laravel Herd](https://herd.laravel.com)**:
1. Download and install **Laravel Herd** from [herd.laravel.com](https://herd.laravel.com).
2. During setup, Herd automatically installs **PHP 8.3 / 8.4**, **Composer**, and **Node.js** with all required extensions already enabled.
3. Open your terminal (PowerShell, Command Prompt, or Terminal) and verify:
   ```bash
   php -v
   composer -v
   node -v
   ```

---

### Method 2: Manual Installation (Windows, macOS, Linux)

<details>
<summary><strong>Click to expand Manual Windows Installation Steps</strong></summary>

1. **Install Git**:
   - Download the 64-bit installer from [git-scm.com](https://git-scm.com/download/win) and install with default settings.

2. **Install PHP 8.3 or 8.4 (x64 Thread Safe)**:
   - Go to [windows.php.net/download](https://windows.php.net/download/).
   - Under **PHP 8.3** or **8.4**, locate **VS17 x64 Thread Safe** and download the **Zip**.
   - Extract the zip archive to `C:\php`.
   - In `C:\php`, copy `php.ini-development` and rename it to `php.ini`.
   - Open `C:\php\php.ini` in a text editor (Notepad or VS Code), search for each of the following lines and **remove the leading semicolon (`;`)** to uncomment them:
     ```ini
     extension_dir = "ext"
     extension=curl
     extension=fileinfo
     extension=gd
     extension=mbstring
     extension=openssl
     extension=pdo_sqlite
     ```
   - Save the file.

3. **Add PHP to Windows Environment Variables (PATH)**:
   - Press `Win + S`, search for **Edit the system environment variables**, and press Enter.
   - Click **Environment Variables...**
   - Under **System variables**, select the variable named **Path** and click **Edit...**
   - Click **New**, type `C:\php`, and click **OK** on all dialogs.
   - Open a fresh Command Prompt or PowerShell and run `php -v` to confirm.

4. **Install Composer**:
   - Download and run **Composer-Setup.exe** from [getcomposer.org/download/](https://getcomposer.org/download/).
   - The installer will automatically detect `C:\php\php.exe`. Complete the wizard.

5. **Install Node.js & npm**:
   - Download the **LTS installer (.msi)** from [nodejs.org](https://nodejs.org/) and complete the installation.
</details>

<details>
<summary><strong>Click to expand Manual macOS / Linux Installation Steps</strong></summary>

**macOS (via Homebrew)**:
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PHP, Composer, Node.js, and Git
brew install php@8.3 composer node git

# Link PHP
brew link --force --overwrite php@8.3
```

**Ubuntu / Debian**:
```bash
# Add Ondrej PPA for PHP 8.3
sudo apt update
sudo apt install -y software-properties-common curl git unzip
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update

# Install PHP 8.3 and extensions
sudo apt install -y php8.3 php8.3-cli php8.3-curl php8.3-mbstring php8.3-xml \
    php8.3-bcmath php8.3-zip php8.3-gd php8.3-sqlite3 php8.3-intl

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
</details>

---

## Step-by-Step Installation Guide

Once the prerequisites are ready, open your terminal (PowerShell, Command Prompt, or Bash) and follow these steps:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd e-gov-lallana
```

### 2. Install Backend Dependencies
Install all required PHP packages via Composer:
```bash
composer install
```

### 3. Install Frontend Dependencies
Install all required JavaScript packages via npm:
```bash
npm install
```

### 4. Create and Configure `.env` File
Duplicate the environment template to create your local `.env`:

* **Windows (PowerShell / Command Prompt)**:
  ```powershell
  copy .env.example .env
  ```
* **macOS / Linux**:
  ```bash
  cp .env.example .env
  ```

### 5. Generate Application Key
Generate the encryption key required by Laravel:
```bash
php artisan key:generate
```

### 6. Create Storage Symlink
Link the `storage/app/public` folder to `public/storage` so uploaded assets and profile images can be served:
```bash
php artisan storage:link
```

### 7. Run Database Migrations & Seeders
The application defaults to an embedded **SQLite** database (`database/database.sqlite`).

Run migrations and seed the initial roles, document types, and sample data:
```bash
php artisan migrate --seed
```
> [!NOTE]
> If prompted: `The SQLite database does not exist: database/database.sqlite. Would you like to create it?`, type **`yes`** and press Enter.

### 8. Generate Wayfinder TypeScript Routes
The frontend utilizes **Laravel Wayfinder** to auto-generate type-safe routing actions for React:
```bash
php artisan wayfinder:generate --with-form
```

---

## Running the Application

### Option A: Unified Dev Runner (Recommended)

Start the Laravel backend, queue worker, and Vite hot-reloading dev server in a single terminal:
```bash
composer run dev
```

### Option B: Separate Terminals

If you prefer running the processes in separate terminal tabs:

1. **Terminal 1 (Laravel Web Server)**:
   ```bash
   php artisan serve
   ```
2. **Terminal 2 (Vite Frontend Development Server)**:
   ```bash
   npm run dev
   ```
3. **Terminal 3 (Background Queue Worker for SMS/Emails/Notifications)**:
   ```bash
   php artisan queue:listen --tries=1 --timeout=0
   ```

Open your browser and visit:  
👉 **[http://localhost:8000](http://localhost:8000)**

---

## Database & Seeded Accounts

The application includes pre-configured database seeders for roles and initial system modules:

### System Roles
- **`super_admin`**: Super Administrator (full platform authority including resident profile deletion).
- **`admin`**: Barangay Administrator (administrative console, document requests, households, verification).
- **`sub_admin`**: Barangay Sub-admin / Staff (record reviews and document processing).
- **`resident`**: Resident / Family Head (public portal, household registration, document requests).

### Bootstrapping Super Administrator
To initialize a Super Admin account during setup, configure the `SUPER_ADMINS` variable in your `.env` file before running seeders:
```env
SUPER_ADMINS='[{"name": "Barangay Admin", "email": "admin@barangaylallana.gov.ph", "password": "your-secure-password"}]'
```
Then run:
```bash
php artisan db:seed --class=SuperAdminSeeder
```

---

## Useful Development Commands

| Command | Description |
| :--- | :--- |
| `composer run dev` | Runs the web server, queue listener, and Vite concurrently. |
| `php artisan wayfinder:generate --with-form` | Regenerates type-safe route definitions for the React frontend. |
| `npm run build` | Compiles production assets into `public/build`. |
| `php artisan test` | Runs the Pest automated test suite. |
| `vendor/bin/pint` | Automatically formats PHP code according to Laravel project guidelines. |
| `npm run types:check` | Runs TypeScript type checking (`tsc --noEmit`). |
| `php artisan migrate:fresh --seed` | Wipes and resets the local database with fresh seed data. |

---

## Troubleshooting & FAQ

### 1. `Class "PDO" not found` or `driver not found (SQLite)`
* **Fix**: Ensure `extension=pdo_sqlite` (or `extension=pdo_mysql` / `extension=pdo_pgsql`) is uncommented in your `php.ini`. Run `php -m` in your terminal to verify that `pdo_sqlite` appears in the list of modules.

### 2. `Call to undefined function imagecreatefromstring()` or `gd extension missing`
* **Fix**: The QR code and profile picture modules require the GD graphics library. Ensure `extension=gd` is uncommented in `php.ini`.

### 3. `Unable to locate file in Vite manifest`
* **Fix**: Make sure `npm run dev` is running, or build assets for production by running:
  ```bash
  npm run build
  ```

### 4. `store.form is not a function` or TypeScript route errors
* **Fix**: Regenerate the Wayfinder routing definitions:
  ```bash
  php artisan wayfinder:generate --with-form
  ```

### 5. Database locks or SQLite permission errors on Windows
* **Fix**: Ensure the `database/` directory has write permissions and that your code editor's database viewer does not hold an exclusive lock on `database/database.sqlite`.
