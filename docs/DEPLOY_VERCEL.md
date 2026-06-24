# Deploying to Vercel (Next.js & Supabase)

Deploying a Next.js application to Vercel supports automatic CI/CD rebuilds whenever you push to your GitHub repository.

## 1. Security First: Untracked `.env`
For security reasons, your sensitive database credentials should **never** be committed to Git.
- We have added `.env` to `.gitignore` and removed it from Git tracking.
- Your local `.env` remains intact for local development, but it will no longer be pushed to GitHub.
- Consequently, you **must** configure your environment variables in the Vercel Dashboard so Vercel can connect to your Supabase database.

---

## 2. Serverless Optimization on Vercel
Vercel serverless functions connect and disconnect rapidly. To prevent connection exhaustion:
- **Connection Pooler URL (`DATABASE_URL`)**: Point this to port `6543` using the transaction-mode pooler parameter `?pgbouncer=true`.
- **Optimal Pool Parameters**: Limit each serverless instance to `connection_limit=3` and set `pool_timeout=30` to prevent database connection limits from being reached.

---

## 3. Function Region Optimization (Crucial for Speed)
By default, Vercel creates serverless functions in the **Washington, D.C. (us-east-1)** datacenter. Because your Supabase database is in **Singapore (ap-southeast-1)**, every database query must travel cross-continent, resulting in ~200ms of extra latency per network round-trip.

To eliminate this latency and make page loads fast:
1. Log into your **[Vercel Dashboard](https://vercel.com)**.
2. Select your project and navigate to the **Settings** tab.
3. Click on **Functions** in the left sidebar.
4. Scroll down to **Function Region** and change it from **Washington, D.C. (us-east-1)** to **Singapore (sin1)**.
5. Click **Save**.
6. **Important**: This change will apply to your *next* deployment. Make a code change/push or manually redeploy to build the serverless functions in the Singapore region.

---

## 4. Configuring Environment Variables on Vercel

If your Vercel deployment is failing or not receiving data, you need to add the database credentials in the Vercel Dashboard:

### Step-by-Step Guide:
1. Log into [Vercel](https://vercel.com) and click on your project dashboard.
2. Navigate to the **Settings** tab at the top.
3. Select **Environment Variables** from the left sidebar.
4. Add the following two key-value pairs:

   | Key | Value Example | Description |
   | :--- | :--- | :--- |
   | **`DATABASE_URL`** | `postgresql://postgres.your-ref:your-pass@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=3&pool_timeout=30&connect_timeout=30` | Supabase **Transaction Pooler** URL (Port 6543) |
   | **`DIRECT_URL`** | `postgresql://postgres.your-ref:your-pass@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres` | Supabase **Direct Connection** URL (Port 5432) |

5. Ensure **Production**, **Preview**, and **Development** environments are checked, then click **Save**.
6. **Redeploy your application**:
   - Go to the **Deployments** tab on Vercel.
   - Click on the latest deployment, click the **three dots (...)** button, and select **Redeploy**.

---

## 5. Initial Deployment Steps (For New Projects)

1. Log into [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** step:
   - Framework Preset: **Next.js** (detected automatically)
   - Root Directory: `./`
   - Expand the **Environment Variables** section and add the `DATABASE_URL` and `DIRECT_URL` variables.
5. Click **Deploy**.

---

## 6. Running Database Migrations
Prisma migrations require direct access to the database using `DIRECT_URL` (Port 5432) and should not be run through the transaction pooler.

To run migrations, execute them from your local development terminal pointing to your remote Supabase database:
```bash
# Make sure your local .env contains your production DIRECT_URL and run:
npx prisma migrate deploy
```
This applies any pending migrations safely to your production Supabase database.
