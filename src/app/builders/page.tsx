import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import BuilderList from '@/components/BuilderList';
import { cookies } from 'next/headers';
import CreateBuilderModal from '@/components/CreateBuilderModal';

export const dynamic = 'force-dynamic';

export default async function BuildersPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'en';
  // Fetch builders along with their mappings/nested product info, active products, and active categories concurrently
  const [rawBuilders, activeProducts, categoriesData] = await Promise.all([
    prisma.builder.findMany({
      include: {
        products: {
          include: {
            product: {
              select: {
                name: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.product.findMany({
      where: { deletedAt: null, status: 'active' },
      orderBy: { name: 'asc' }
    }),
    prisma.category.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' }
    })
  ]);

  const builders = rawBuilders.map(b => ({
    id: b.id,
    name: b.name,
    status: b.status,
    updatedAt: b.updatedAt,
    products: b.products.map(p => ({
      id: p.id,
      builderId: p.builderId,
      productId: p.productId,
      category: p.category,
      qty: p.qty,
      sdp: Number(p.sdp),
      totalSdp: Number(p.totalSdp),
      pagePrice: Number(p.pagePrice),
      srp: Number(p.srp),
      margin: Number(p.margin),
      marginPercentage: Number(p.marginPercentage),
      product: p.product
    }))
  }));

  // Group active products by category
  const productsByCategory: { [category: string]: any[] } = {};
  activeProducts.forEach((p) => {
    if (!productsByCategory[p.category]) {
      productsByCategory[p.category] = [];
    }
    productsByCategory[p.category].push({
      id: p.id,
      name: p.name,
      sdp: Number(p.sdp),
      page_price: Number(p.page_price),
      srp: Number(p.srp),
    });
  });

  const categories = categoriesData.map(c => c.name);

  return (
    <div className="py-6">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
              Builders
            </h2>
          </div>
          <CreateBuilderModal lang={lang} />
        </div>

        {/* Builder List Component */}
        <BuilderList 
          initialBuilders={builders}
          productsByCategory={productsByCategory}
          categories={categories}
        />

      </div>
    </div>
  );
}
