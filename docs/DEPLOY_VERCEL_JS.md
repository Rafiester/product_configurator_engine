# Deploying JS-App to Vercel

This document outlines how to deploy the newly migrated `js-app` (Next.js + Tailwind + Prisma) to Vercel. 

Unlike the previous PHP/Laravel setup, this is a native Node.js application. **Vercel is designed specifically for Next.js**, which means the deployment process is incredibly seamless and requires zero complex configuration or custom runtimes.

## 1. Zero Configuration Architecture
- **No PHP Runtime Needed**: The `vercel-php` runtime is completely gone. Vercel automatically natively builds and hosts Next.js App Router applications.
- **No `vercel.json` Required**: Vercel automatically detects the `next build` command and handles Server Actions, API Routes, and Static Pages out-of-the-box.

## 2. Environment Variables

To deploy successfully, your Vercel project needs to connect to **Supabase PostgreSQL** via Prisma.

1. Go to your Vercel Dashboard -> Project Settings -> Environment Variables.
2. Add the following keys exactly as they appear in your `.env.example`:

| Variable Name | Description | Example Value |
| --- | --- | --- |
| `DATABASE_URL` | The transaction pooling URL for Prisma runtime queries. | `postgresql://postgres.[REF]:[PASS]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | The direct database URL used ONLY for Prisma migrations. | `postgresql://postgres.[REF]:[PASS]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres` |

## 3. Deployment Steps

1. Push the `/js-app` folder (or the entire repository if hosting as a monorepo) to GitHub.
2. Go to Vercel and click **Add New -> Project**.
3. Import your GitHub repository.
4. **Important**: If the Next.js app is inside a subfolder (like `/js-app`), set the **Root Directory** in Vercel to `js-app`. Vercel will automatically detect the Next.js framework preset.
5. Paste the `DATABASE_URL` and `DIRECT_URL` in the Environment Variables section.
6. Click **Deploy**.

## 4. Database Migrations on Vercel

In Next.js with Prisma, you typically run migrations locally using `npx prisma db push` or `npx prisma migrate deploy` connected to the remote database before or during deployment.

You can modify your `package.json` build script to automatically run migrations during the Vercel build phase:
```json
"scripts": {
  "build": "prisma generate && prisma migrate deploy && next build"
}
```
*Note: Make sure your `DIRECT_URL` is configured if you do this.*
