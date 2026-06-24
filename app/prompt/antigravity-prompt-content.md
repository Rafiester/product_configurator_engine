Fix Vercel build error:

Error:
Failed to collect page data for /api/products/export
Prisma clientVersion 5.21.1

Rules:
1. Inspect these files:
   - js-app/app/api/products/export/route.ts
   - js-app/app/api/products/import/route.ts
   - js-app/lib/prisma.ts
   - js-app/prisma/schema.prisma
2. API routes must not query Prisma at build time.
3. Add these exports to every Prisma-based API route:
   export const runtime = "nodejs";
   export const dynamic = "force-dynamic";
4. Make sure PrismaClient is only instantiated safely in lib/prisma.ts.
5. Make sure no top-level await or top-level Prisma query exists in route files.
6. Ensure Vercel env has DATABASE_URL.
7. Update package.json build script if needed:
   "build": "prisma generate && next build"
8. Run npm run build and fix until it passes.

Implement only the fix for this build error.