# Setup Instructions

## Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm
- SQLite / MySQL / PostgreSQL (default: SQLite)

## Installation Steps

1. **Clone the repository**
   Navigate to your local projects folder and clone the repository.
   ```bash
   git clone <repository_url> pc-configurator-cms
   cd pc-configurator-cms
   ```

2. **Install Composer dependencies**
   ```bash
   composer install
   ```

3. **Install NPM dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   Copy the example `.env` file to create your own environment configuration.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Ensure your `DB_CONNECTION` is correctly set (e.g., `sqlite` or `mysql`). For `sqlite`, ensure a `database/database.sqlite` file exists.

5. **Run Migrations**
   ```bash
   php artisan migrate
   ```

6. **Compile Frontend Assets**
   Using Vite, compile the TailwindCSS and Javascript assets.
   ```bash
   npm run build
   ```
   *(During active development, run `npm run dev` to watch for live changes.)*

7. **Start the Local Server**
   ```bash
   php artisan serve
   ```
   Visit the URL provided (usually `http://localhost:8000`).
