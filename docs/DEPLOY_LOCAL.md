# Local Deployment Guide (Next.js)

This guide covers how to set up the PC Configurator CMS on your local machine for Next.js development.

## Prerequisites
- Node.js (v18.0 or higher)
- npm (Node Package Manager)
- A Supabase project (PostgreSQL database instance)

---

## Step-by-Step Installation

### 1. Clone the Repository
```bash
git clone <repository_url> pc-configurator-cms
cd pc-configurator-cms
```

### 2. Install Javascript Dependencies
Install the required node modules:
```bash
npm install
```

### 3. Environment Configuration
Copy the sample environment configuration file:
```bash
cp .env.example .env
```

Open the newly created `.env` file and set your Supabase database connections:
- **`DATABASE_URL`**: Transaction pooler URL (Pgbouncer port 6543) for serverless queries.
- **`DIRECT_URL`**: Direct database connection URL (Session port 5432) for running schema migrations.

Example:
```ini
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:password@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### 4. Database Setup & Sync
Generate the Prisma Client types:
```bash
npx prisma generate
```

If you need to push schema changes directly to Supabase during setup, run:
```bash
npx prisma db push
```

### 5. Running the Application
Launch the Next.js local server:
```bash
npm run dev
```

The terminal will output the local development port. Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000) (or the port specified by the dev server).
