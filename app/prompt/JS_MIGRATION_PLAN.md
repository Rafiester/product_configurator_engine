You are helping me migrate my existing Laravel Product Configurator Engine into a Vercel-friendly JavaScript/TypeScript stack.

Goal:
Convert the project from Laravel/PHP into a fullstack JavaScript app that can deploy cleanly on Vercel and use Supabase PostgreSQL.

Target stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Prisma ORM OR Supabase JS client, choose the safest option after inspecting the current schema
- Excel import support using xlsx
- No PHP runtime
- No Laravel dependency
- Must be deployable to Vercel Hobby

Important migration rules:
1. Do not modify the existing Laravel app destructively.
2. First create a full migration plan in /docs/JS_MIGRATION_PLAN.md.
3. Inspect current Laravel routes, controllers, models, migrations, Blade views, validation rules, and business logic.
4. Map every existing feature to the new JS implementation.
5. Preserve existing calculation logic exactly.
6. Preserve UI behavior, dark mode, import product Excel, download master data Excel, product master data CRUD, configurator flow, pricing/margin display cosmetics, and popup behavior.
7. Do not rewrite everything blindly. Work module by module.
8. Add trace logs around save/import/export flows.
9. Use environment variables for all Supabase credentials.
10. Add deployment docs for Vercel in /docs/DEPLOY_VERCEL_JS.md.

Execution plan:
Phase 1:
- Audit current Laravel project.
- Document all routes, DB tables, fields, relationships, and calculations.
- Write migration plan only. Do not code yet.

Phase 2:
- Create new Next.js app structure inside /js-app or separate branch.
- Setup TypeScript, Tailwind, Supabase connection, env example.
- Recreate database schema.
- Add seed/import helpers.

Phase 3:
- Rebuild Product Master Data module:
  - List products
  - Create product
  - Edit product
  - Delete product
  - Import Excel without duplicates
  - Download master data as xlsx

Phase 4:
- Rebuild configurator module:
  - Product selection
  - Price calculation
  - Margin calculation
  - Cosmetic RM/% formatting without changing numeric values

Phase 5:
- Rebuild UI polish:
  - SaaS dashboard layout
  - Dark mode toggle
  - Success/error popup redesign
  - Navbar consistency

Phase 6:
- Vercel deployment:
  - Add vercel-ready build config
  - Add env documentation
  - Confirm npm run build passes
  - Confirm no PHP/Laravel runtime needed

Before coding each phase:
- Explain exactly what files will be created/changed.
- Then implement.
- After implementation, run checks and fix errors.
- Commit changes per phase with clear commit messages.

