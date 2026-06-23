# Deploying to Vercel

Vercel is a serverless platform designed primarily for Node.js/Next.js, but it can successfully run Laravel applications using the community PHP runtimes. However, because it is serverless, there are several architectural constraints you must address.

## 1. Serverless Constraints for Laravel

Before deploying, you must understand how Vercel changes your application behavior:
- **No Persistent Local Storage**: You cannot use SQLite. You must use an external database (e.g., Supabase, Neon, PlanetScale, or a traditional RDS).
- **Ephemeral File System**: Uploaded files (like the Excel import) will only exist for the duration of the request. Since our Excel import parses data in memory and doesn't store the file permanently, this works fine! If you add product image uploads in the future, you **must** use Amazon S3 or Cloudflare R2.
- **No Long-Running Daemons**: You cannot run `php artisan queue:work` or standard cron jobs natively. You must use serverless queues (like AWS SQS) or Vercel Cron Jobs triggered via HTTP.

## 2. Required Files for Vercel

To tell Vercel how to build and run your Laravel app, you need to create two files in the root of your repository.

### `vercel.json`
Create a `vercel.json` file in your project root:
```json
{
    "version": 2,
    "builds": [
        {
            "src": "api/index.php",
            "use": "vercel-php@0.6.0"
        },
        {
            "src": "/public/**",
            "use": "@vercel/static"
        }
    ],
    "routes": [
        {
            "src": "/build/(.*)",
            "dest": "/public/build/$1"
        },
        {
            "src": "/(.*)",
            "dest": "/api/index.php"
        }
    ],
    "env": {
        "APP_ENV": "production",
        "APP_DEBUG": "false",
        "CACHE_DRIVER": "array",
        "SESSION_DRIVER": "cookie",
        "QUEUE_CONNECTION": "sync"
    }
}
```
*(Note: Ensure you are using the latest compatible `vercel-php` runtime version for your PHP version).*

### `api/index.php`
Create an `api` folder in your root directory, and place an `index.php` file inside it. This acts as the serverless entry point:
```php
<?php

// Forward Vercel requests to the normal Laravel public/index.php
require __DIR__ . '/../public/index.php';
```

## 3. Preparing the Database

Since you cannot use SQLite on Vercel:
1. Create a managed PostgreSQL or MySQL database (e.g., [Neon.tech](https://neon.tech) for Postgres or [PlanetScale](https://planetscale.com) for MySQL).
2. Get your connection string (e.g., `postgres://user:password@host/dbname`).

## 4. Compiling Assets (Vite)

Vercel doesn't run `npm run build` for PHP projects automatically unless configured. You have two options:
1. **Commit your build assets**: Run `npm run build` locally and commit the `public/build` folder to Git.
2. **Build on Vercel** (Recommended): Modify your `package.json` to include a build script, and ensure Vercel runs it. However, because Vercel isolates the Node builder and PHP builder, the easiest way for Laravel on Vercel is to just run `npm run build` locally and commit the compiled assets.

To commit compiled assets:
1. Remove `public/build` from your `.gitignore`.
2. Run `npm run build`.
3. Commit the changes.

## 5. Deployment Steps

1. Push your repository (with `vercel.json`, `api/index.php`, and compiled frontend assets) to GitHub.
2. Log into [Vercel](https://vercel.com).
3. Click **Add New** -> **Project**.
4. Import your GitHub repository.
5. In the **Configure Project** step:
   - Framework Preset: **Other**
   - Open the **Environment Variables** section and add:
     - `APP_NAME` = "PC Configurator"
     - `APP_ENV` = "production"
     - `APP_KEY` = (Generate one using `php artisan key:generate --show`)
     - `APP_DEBUG` = "false"
     - `APP_URL` = (Your Vercel domain)
     - `DB_CONNECTION` = "pgsql" (or mysql)
     - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (From your remote database provider)
     - `SESSION_DRIVER` = "cookie"
     - `CACHE_DRIVER` = "array" (Or Redis if you have an external Redis instance)
6. Click **Deploy**.

## 6. Running Migrations on Vercel

Since you do not have SSH access to a Vercel serverless function to run `php artisan migrate`, you must run migrations against your production database remotely.

From your local machine:
1. Temporarily update your local `.env` with your Production Database credentials.
2. Run `php artisan migrate --force`.
3. Revert your local `.env` back to your local database.

Alternatively, you can create a secure webhook route in Laravel that runs `Artisan::call('migrate', ['--force' => true])` when triggered, but running it remotely from your local machine is safer.
