import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ConfiguratorList from '@/components/ConfiguratorList';

export const dynamic = 'force-dynamic';

export default async function ConfiguratorsPage() {
  // Fetch configurators along with their mappings/nested product info, and active products concurrently
  const [rawConfigurators, activeProducts] = await Promise.all([
    prisma.configurator.findMany({
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
    })
  ]);

  const configurators = rawConfigurators.map(c => ({
    id: c.id,
    name: c.name,
    status: c.status,
    updatedAt: c.updatedAt,
    products: c.products.map(p => ({
      id: p.id,
      configuratorId: p.configuratorId,
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

  return (
    <div className="py-6">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
              Configurators
            </h2>
          </div>
          <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
            <Link 
              href="/configurators/create" 
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white focus:outline-none shadow-sm text-sm transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Configurator
            </Link>
          </div>
        </div>

        {/* Configurations List */}
        <ConfiguratorList 
          initialConfigurators={configurators}
          productsByCategory={productsByCategory}
        />

      </div>
    </div>
  );
}
