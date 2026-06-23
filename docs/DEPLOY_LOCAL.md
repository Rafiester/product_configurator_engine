# Local Deployment Guide

This guide covers how to set up the PC Configurator CMS on your local machine for development and testing.

## Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js & npm (v18+)
- SQLite (default) or MySQL/PostgreSQL

## Step-by-Step Installation

### 1. Clone the Repository
Open your terminal and clone the repository:
```bash
git clone <repository_url> pc-configurator-cms
cd pc-configurator-cms
```

### 2. Install Dependencies
Install PHP packages:
```bash
composer install
```
Install Javascript packages (for Alpine.js and TailwindCSS):
```bash
npm install
```

### 3. Environment Configuration
Copy the sample environment file to create your local configuration:
```bash
cp .env.example .env
```
Generate your application encryption key:
```bash
php artisan key:generate
```

By default, the `.env` file uses SQLite for zero-configuration local development. If you wish to use MySQL, update your `.env` file accordingly:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pc_configurator
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Database Setup
Run the migrations to create the database structure:
```bash
php artisan migrate
```
*(If prompted to create the database file for SQLite, type `yes`).*

### 5. Compile Assets
Compile the TailwindCSS styles and AlpineJS scripts:
```bash
# For a one-time compile
npm run build

# Or, if you are actively editing CSS/Blade files:
npm run dev
```

### 6. Serve the Application

**Option A: PHP Artisan (Simplest)**
```bash
php artisan serve
```
Your app will be available at `http://localhost:8000`.

**Option B: Laravel Herd / Valet (Mac)**
If you are using Laravel Herd or Valet, simply ensure the folder is parked:
```bash
valet park
```
Access your app at `http://pc-configurator-cms.test`.

**Option C: Laravel Sail (Docker)**
If you prefer Docker:
```bash
./vendor/bin/sail up -d
```
Access your app at `http://localhost`.
