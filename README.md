# PC Configurator Admin Panel (Next.js & Prisma)

An exclusive SaaS-style admin portal and PC builder dashboard featuring a premium Pastel Pink theme and fully responsive layout. Migrated from Laravel to Next.js.

## 🚀 Technology Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Database ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL / Supabase connection)
- **Styling**: [TailwindCSS v3](https://tailwindcss.com/)
- **Theme Support**: Class-based Dark Mode & Light Mode using `next-themes`
- **Excel Processing**: `xlsx` (SheetJS) for parsing imports and `exceljs` for custom color-coded exports.

---

## 🛠️ Local Development

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/) or another Node package manager

### 2. Installation Steps
1. Clone this repository to your local system:
   ```bash
   git clone <repository_url> pc-configurator-cms
   cd pc-configurator-cms
   ```
2. Install Javascript dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Provide your Supabase connection strings inside the `.env` file:
   ```ini
    DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&connect_timeout=30"
    DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
   ```
4. Generate the Prisma database client:
   ```bash
   npx prisma generate
   ```
5. Spin up the local Next.js development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) to view the application.

---

## 📦 Deployment Guides

We provide exhaustive documentation for deploying this application across various environments:
- **Local Dev Setup**: Check out [docs/DEPLOY_LOCAL.md](file:///Users/flo/cms/docs/DEPLOY_LOCAL.md)
- **Cloud Preview (Gitpod)**: Check out [docs/DEPLOY_GITPOD.md](file:///Users/flo/cms/docs/DEPLOY_GITPOD.md)
- **Traditional VPS Hosting (PM2 & Nginx)**: Check out [docs/DEPLOY_SERVER.md](file:///Users/flo/cms/docs/DEPLOY_SERVER.md)
- **Serverless Hosting (Vercel)**: Check out [docs/DEPLOY_VERCEL.md](file:///Users/flo/cms/docs/DEPLOY_VERCEL.md)
- **Database Schema Guide**: Check out [docs/DATABASE.md](file:///Users/flo/cms/docs/DATABASE.md)
