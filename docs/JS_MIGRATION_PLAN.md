# JavaScript Fullstack Migration Plan (Vercel + Next.js + Supabase)

## Goal
Migrate the existing Laravel Product Configurator Engine into a Vercel-friendly JavaScript/TypeScript stack using Next.js (App Router), Tailwind CSS, and Supabase PostgreSQL.

---

## 1. Current System Audit

### 1.1 Database Schema (To be migrated to Supabase/Prisma)

#### `products` table
- `id` (UUID, Primary Key)
- `name` (String, required)
- `category` (String, required)
- `qty` (Integer, required)
- `sdp` (Decimal/Float, required)
- `page_price` (Decimal/Float, required)
- `srp` (Decimal/Float, required)
- `status` (Enum/String: 'active', 'inactive')
- `deleted_at` (Timestamp, soft delete)
- `created_at`, `updated_at`

#### `configurators` table
- `id` (UUID, Primary Key)
- `name` (String, required)
- `status` (Enum/String: 'active', 'inactive')
- `created_at`, `updated_at`

#### `configurator_product_mappings` table (Pivot)
- `id` (UUID, Primary Key)
- `configurator_id` (UUID, Foreign Key)
- `product_id` (UUID, Foreign Key)
- `category` (String)
- `qty` (Integer)
- `sdp` (Decimal)
- `total_sdp` (Decimal)
- `page_price` (Decimal)
- `srp` (Decimal)
- `margin` (Decimal)
- `margin_percentage` (Decimal)
- `created_at`, `updated_at`

#### `users` table
- Standard auth schema (to be replaced by Supabase Auth).

### 1.2 Business Logic & Calculations

#### Product Master Data Logic:
- `Total SDP` = `Qty * SDP`
- **Duplicate Rule (Import)**: Skip if normalized `category` + normalized `name` already exists. (Normalization = stripped spaces, case-insensitive).

#### Configurator Builder Logic (Spreadsheet UI):
- `Total SDP` = `Qty * SDP`
- `Margin` = `Page Price - Total SDP`
- `Margin %` = `(Margin / Page Price) * 100`
- Values like `RM` or `%` are visual only and strictly stripped before DB saves.

### 1.3 Routes Mapping

#### Auth Routes
- Login/Register/Profile -> Supabase Auth UI or custom Next.js forms.

#### Dashboard
- `/dashboard` -> `/dashboard` (Next.js Page)

#### Products
- `GET /products` -> `app/products/page.tsx`
- `POST /products/import` -> Next.js Server Action / API Route (`xlsx` parser)
- `GET /products/export` -> Next.js API Route (`xlsx` builder)
- `CRUD /products` -> Server Actions for Create/Update/Delete (with Soft Delete logic)

#### Configurators
- `GET /configurators` -> `app/configurators/page.tsx`
- `GET /configurators/create` -> `app/configurators/create/page.tsx`
- `GET /configurators/{id}/edit` -> `app/configurators/[id]/edit/page.tsx`
- Configurator Builder (Spreadsheet UI) -> Complex React Client Component with live state (replacing Alpine.js)

---

## 2. Migration Execution Strategy

### Phase 2: Foundation setup
- Bootstrap Next.js App Router project inside `/js-app`.
- Configure TypeScript and Tailwind CSS.
- Copy over current UI colors (`tailwind.config.js`) to maintain the exact Pastel Pink aesthetic and dark mode support.
- Set up Supabase PostgreSQL.
- Setup Prisma ORM (safer/stricter schema management) and migrate the audited DB schema.

### Phase 3: Product Master Data Module
- Build Product List (Table UI).
- Build Product CRUD operations using Server Actions.
- Implement Excel Import (`xlsx` library) handling duplicate checking in-memory.
- Implement Excel Export.

### Phase 4: Configurator Module
- Build the data-dense spreadsheet Matrix UI in React.
- Implement live state calculation (Total SDP, Margin, Margin %) without mutating actual database values.
- Build Save Configuration logic to write into the pivot table schema.

### Phase 5: UI Polish
- Ensure SaaS dashboard layout mirrors exactly the current Laravel blade layout.
- Implement global dark mode toggle.
- Port over success/error popups.
- Verify visual aesthetics match 1:1.

### Phase 6: Vercel Deployment
- Create `/docs/DEPLOY_VERCEL_JS.md`.
- Ensure standard Next.js build (`npm run build`) works flawlessly without PHP runtimes.
