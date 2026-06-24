# Deploying to Vercel (Next.js & Supabase)

Deploying a Next.js application to Vercel is extremely simple and supports automatic CI/CD rebuilds when you push to Github.

## 1. Prerequisites
- A GitHub repository containing this migrated codebase.
- A free Vercel account linked to your GitHub.
- An active Supabase project (PostgreSQL).

---

## 2. Serverless Optimization on Vercel
Vercel handles Next.js natively:
- **Prisma Client**: During builds on Vercel, the Prisma client generates automatically.
- **Connection Pooling**: Next.js Serverless functions connect and disconnect rapidly. Ensure you configure your Vercel variables to point to **Supabase's connection pooler URL (PgBouncer)** using port `6543` and `?pgbouncer=true`.

---

## 3. Deployment Steps

1. Commit and push your local codebase modifications to your GitHub repository.
2. Log into [Vercel](https://vercel.com).
3. Click **Add New** -> **Project**.
4. Import your GitHub repository.
5. In the **Configure Project** step:
   - Framework Preset: **Next.js** (detected automatically)
   - Root Directory: `./` (root of the workspace)
   - Open the **Environment Variables** section and add:
     - `DATABASE_URL` = (e.g., `postgresql://postgres.xxx:pass@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=3&pool_timeout=30&connect_timeout=30`)
     - `DIRECT_URL` = (e.g., `postgresql://postgres.xxx:pass@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`)
6. Click **Deploy**.

Vercel will pull the code, install node dependencies, compile Tailwind assets, and spin up serverless routes.

---

## 4. Running Database Migrations
Prisma migrations require direct access to the database using `DIRECT_URL` and should not be run through pgbouncer transaction ports.

To run migrations, execute them from your local development terminal pointing to the remote Supabase database:
```bash
# Verify your local .env points to the production database and run:
npx prisma migrate deploy
```
This applies any pending migrations safely to your production Supabase database.
