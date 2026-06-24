import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ImportModal from '@/components/ImportModal';
import { DeleteButton } from '@/components/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; status?: string }
}) {
  const search = searchParams.search || '';
  const category = searchParams.category || '';
  const status = searchParams.status || '';

  // Query conditions
  const where: any = { deletedAt: null };
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }
  if (category) {
    where.category = category;
  }
  if (status) {
    where.status = status;
  }

  // Fetch unique categories for the filter dropdown
  const categoriesRaw = await prisma.product.findMany({
    where: { deletedAt: null },
    select: { category: true },
    distinct: ['category']
  });
  const categories = categoriesRaw.map(c => c.category).filter(Boolean).sort();

  // Fetch filtered products
  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="py-12">
      <div className="max-w-[1280px] mx-auto px-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
              Products (Master Data)
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
              <a href="/api/products/export" className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white shadow-sm text-sm transition-colors">
                Download Master Data
              </a>
            </div>
            <ImportModal />
            <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
              <Link href="/products/create" className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white shadow-sm text-sm transition-colors">
                Create New Product
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-dark-surface p-4 shadow-sm rounded-xl mb-6 border border-gray-200 dark:border-dark-border">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-dark-border">Search & Filter Products</h3>
          <form method="GET" action="/products" className="flex flex-row items-center gap-4 w-full">
            <div className="w-full flex-[2]">
              <input type="text" name="search" defaultValue={search} placeholder="Search by name..." className="block w-full rounded-md bg-white border-gray-300 placeholder-gray-400 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm" />
            </div>
            <div className="w-full flex-1">
              <select name="category" defaultValue={category} className="block w-full rounded-md bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm">
                <option value="">Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="w-full flex-1">
              <select name="status" defaultValue={status} className="block w-full rounded-md bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm">
                <option value="">Status</option>
                <option value="active">Publish</option>
                <option value="inactive">Unpublish</option>
              </select>
            </div>
            <div className="flex items-center space-x-3 flex-none ml-2">
              <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
                <button type="submit" className="inline-flex items-center justify-center px-6 py-2 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active text-black dark:text-white font-semibold rounded-lg shadow-sm sm:text-sm transition-colors">
                  Filter
                </button>
              </div>
              <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
                <Link href="/products" className="inline-flex items-center justify-center px-6 py-2 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active text-black dark:text-white font-semibold rounded-lg shadow-sm sm:text-sm transition-colors">
                  Clear
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-dark-surface overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-dark-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Category</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">SDP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Total SDP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Page Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">SRP</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-dark-border">
                {products.length === 0 ? (
                  <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-500">No products found.</td></tr>
                ) : (
                  products.map((p, idx) => {
                    const totalSdp = p.qty * Number(p.sdp);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{idx + 1}</td>
                        <td className="px-4 py-4 max-w-[300px] truncate text-sm font-medium text-gray-900 dark:text-gray-100" title={p.name}>{p.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap"><span className="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-primary-soft dark:bg-primary-darkSoft text-primary-active dark:text-primary-dark">{p.category}</span></td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center tabular-nums">{p.qty}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 tabular-nums">RM {Number(p.sdp).toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">RM {totalSdp.toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 tabular-nums">RM {Number(p.page_price).toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 tabular-nums">RM {Number(p.srp).toFixed(2)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${p.status === 'active' ? 'bg-primary-soft text-primary-active dark:bg-primary-darkSoft border-primary-DEFAULT/30' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                            {p.status === 'active' ? 'Publish' : 'Unpublish'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-lg inline-block">
                              <Link href={`/products/${p.id}/edit`} className="inline-flex items-center px-4 py-1.5 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active text-black dark:text-white font-semibold rounded-md text-xs transition-colors">Edit</Link>
                            </div>
                            <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg inline-block">
                              <DeleteButton id={p.id} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
