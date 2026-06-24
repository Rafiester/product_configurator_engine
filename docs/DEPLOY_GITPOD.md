# Gitpod Cloud Workspace Guide (Next.js)

This guide covers how to launch, run, and develop the PC Configurator dashboard instantly in the cloud using Gitpod.

## 🚀 Instant Start

You can open the project in Gitpod directly by prefixing the repository URL with `https://gitpod.io/#`:

**Launch URL:**
`https://gitpod.io/#<your-github-repository-url>`

---

## 🛠️ Automated Setup

Gitpod uses the [.gitpod.yml](file:///Users/flo/cms/.gitpod.yml) file to fully automate the workspace configuration upon startup.

When the workspace launches, Gitpod will automatically run the following tasks:
1. **NPM Installation**: Installs Javascript packages (`npm install`).
2. **Environment Configuration**: Copies `.env.example` to `.env`.
3. **Prisma Schema Generation**: Generates the Prisma client types (`npx prisma generate`).
4. **Compile Assets**: Performs the Next.js production build (`npm run build`).
5. **Dev Server**: Boots the Next.js server (`npm run dev`) in port `3000`.

Once finished, Gitpod will automatically open a preview of the application in your browser window.

---

## ⚙️ Manual Commands

If you need to manually manage the Next.js servers or database in the Gitpod terminal:

### Starting Next.js Dev Server
```bash
npm run dev
```

### Prisma Client Generation
```bash
npx prisma generate
```

### Syncing DB Changes
```bash
npx prisma db push
```

---

## ⚠️ Notes on Gitpod
- **Supabase Connectivity**: Ensure you have updated the `.env` variables with your active Supabase host pooler addresses to establish database connectivity.
- **Port Visibility**: Port `3000` is configured as `public` in `.gitpod.yml` so that you can view the live Next.js hot-reloaded admin panel in Gitpod's preview frames.
