# Gitpod Cloud Workspace Guide

This guide covers how to launch, run, and develop the PC Configurator CMS instantly in the cloud using Gitpod.

## 🚀 Instant Start

You can open the project in Gitpod directly by prefixing the repository URL with `https://gitpod.io/#`:

**Launch URL:**
`https://gitpod.io/#<your-github-repository-url>`

---

## 🛠️ Automated Setup

Gitpod uses the [.gitpod.yml](file:///Users/flo/cms/.gitpod.yml) file to fully automate the workspace configuration upon startup.

When the workspace launches, Gitpod will automatically run the following tasks:
1. **PHP Dependencies**: Runs `composer install`.
2. **Node.js Dependencies**: Runs `npm install`.
3. **Environment Setup**: Copies `.env.example` to `.env` and generates the application encryption key.
4. **Database Initialization**: Creates a local SQLite database at `database/database.sqlite` and runs migrations and seeds (`php artisan migrate --seed`).
5. **Asset Compilation**: Compiles the TailwindCSS and Alpine.js assets (`npm run build`).
6. **Servers**: Launches the local PHP server (`php artisan serve`) and Vite's dev server (`npm run dev`) in the background.

Once finished, Gitpod will automatically open a preview of the application in your browser window.

---

## ⚙️ Manual Commands

If you need to manually manage the servers or database within the Gitpod terminal:

### Starting Server & Vite Dev Server
```bash
# Start Laravel server on host 0.0.0.0 so it is accessible from Gitpod's external URL
php artisan serve --host=0.0.0.0 --port=8000

# Start Vite server for hot module reloading (HMR)
npm run dev
```

### Running Database Migrations / Seeds
```bash
php artisan migrate:fresh --seed
```

---

## ⚠️ Notes on Gitpod

- **SQLite Database**: The workspace uses SQLite (`database/database.sqlite`) by default, which is persistent across workspace starts and stops but will reset if you delete or rebuild the workspace.
- **Port Visibility**: Ports `8000` (Laravel) and `5173` (Vite) are configured as `public` in `.gitpod.yml` to allow the preview environment to access assets and load the web pages.
