import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ImportModal from '@/components/ImportModal';
import { DeleteButton } from '@/components/DeleteButton';
import PerPageSelect from '@/components/PerPageSelect';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; status?: string; page?: string; perPage?: string }
}) {
  const search = searchParams.search || '';
  const category = searchParams.category || '';
  const status = searchParams.status || '';
  const perPage = parseInt(searchParams.perPage || '10', 10) || 10;
  const page = parseInt(searchParams.page || '1', 10) || 1;

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

  // Fetch unique categories, total filtered products count, and the filtered products list concurrently
  const [categoriesRaw, totalItems, products] = await Promise.all([
    prisma.product.groupBy({
      by: ['category'],
      where: { deletedAt: null }
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage
    })
  ]);

  const categories = categoriesRaw.map(c => c.category).filter(Boolean).sort();
  const totalPages = Math.ceil(totalItems / perPage);

  const startIdx = totalItems > 0 ? (page - 1) * perPage + 1 : 0;
  const endIdx = Math.min(page * perPage, totalItems);

  // Pagination URL helper
  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (status) params.set('status', status);
    if (perPage !== 10) params.set('perPage', perPage.toString());
    params.set('page', targetPage.toString());
    return `/products?${params.toString()}`;
  };

  return (
    <div className="py-6">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
              Products (Master Data)
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block text-center sm:text-left">
              <a href="/api/products/export" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white shadow-sm text-sm transition-colors">
                Download Master Data
              </a>
            </div>
            <ImportModal />
            <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block text-center sm:text-left">
              <Link href="/products/create" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white shadow-sm text-sm transition-colors">
                Create New Product
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-dark-surface p-4 shadow-sm rounded-xl border border-gray-200 dark:border-dark-border">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-1.5 border-b border-gray-200 dark:border-dark-border">Search & Filter Products</h3>
          <form method="GET" action="/products" className="flex flex-col md:flex-row md:items-center gap-4 w-full">
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
            <div className="flex items-center justify-end gap-3 w-full md:w-auto mt-2 md:mt-0">
              <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block w-full sm:w-auto text-center">
                <button type="submit" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active text-black dark:text-white font-semibold rounded-lg shadow-sm sm:text-sm transition-colors">
                  Filter
                </button>
              </div>
              <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block w-full sm:w-auto text-center">
                <Link href="/products" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active text-black dark:text-white font-semibold rounded-lg shadow-sm sm:text-sm transition-colors">
                  Clear
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Data Table Container */}
        <div className="bg-white dark:bg-dark-surface overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-dark-border">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-2.5 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">No</th>
                  <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Name</th>
                  <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Category</th>
                  <th className="px-6 py-2.5 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Qty</th>
                  <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">SDP</th>
                  <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Total SDP</th>
                  <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Page Price</th>
                  <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">SRP</th>
                  <th className="px-6 py-2.5 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-2.5 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
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
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{startIdx + idx}</td>
                        <td className="px-6 py-2.5 max-w-[300px] truncate text-sm font-medium text-gray-900 dark:text-gray-100" title={p.name}>{p.name}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap"><span className="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-primary-soft dark:bg-primary-darkSoft text-primary-active dark:text-primary-dark">{p.category}</span></td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center tabular-nums">{p.qty}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 tabular-nums">RM {Number(p.sdp).toFixed(2)}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">RM {totalSdp.toFixed(2)}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 tabular-nums">RM {Number(p.page_price).toFixed(2)}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 tabular-nums">RM {Number(p.srp).toFixed(2)}</td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${p.status === 'active' ? 'bg-primary-soft text-primary-active dark:bg-primary-darkSoft border-primary-DEFAULT/30' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                            {p.status === 'active' ? 'Publish' : 'Unpublish'}
                          </span>
                        </td>
                        <td className="px-6 py-2.5 whitespace-nowrap text-right text-sm font-medium">
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

          {/* Mobile Product Cards View */}
          <div className="block md:hidden divide-y divide-gray-200 dark:divide-dark-border">
            {products.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">No products found.</div>
            ) : (
              products.map((p, idx) => {
                const totalSdp = p.qty * Number(p.sdp);
                return (
                  <div key={p.id} className="p-4 space-y-3 bg-white dark:bg-dark-surface">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">#{startIdx + idx}</span>
                        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 break-words" title={p.name}>
                          {p.name}
                        </h4>
                        <div className="pt-1">
                          <span className="px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full bg-primary-soft dark:bg-primary-darkSoft text-primary-active dark:text-primary-dark">
                            {p.category}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full border ${p.status === 'active' ? 'bg-primary-soft border-primary-DEFAULT/30 text-primary-active dark:bg-primary-darkSoft dark:text-primary-DEFAULT' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                        {p.status === 'active' ? 'Publish' : 'Unpublish'}
                      </span>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-150 dark:border-dark-border/50 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Qty</span>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{p.qty}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">SDP</span>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">RM {Number(p.sdp).toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Total SDP</span>
                        <div className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">RM {totalSdp.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Page Price</span>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">RM {Number(p.page_price).toFixed(2)}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 dark:text-gray-400">SRP</span>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">RM {Number(p.srp).toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-150 dark:border-dark-border/50">
                      <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-lg inline-block">
                        <Link href={`/products/${p.id}/edit`} className="inline-flex items-center px-4 py-1.5 bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active text-black dark:text-white font-semibold rounded-md text-xs transition-colors">
                          Edit
                        </Link>
                      </div>
                      <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg inline-block">
                        <DeleteButton id={p.id} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Footer */}
          {totalItems > 0 && (
            <div className="bg-gray-50 dark:bg-dark-surface2 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-dark-border">
              <div className="flex-1 flex flex-col justify-center items-center gap-3 sm:hidden">
                <PerPageSelect currentPerPage={perPage} />
                {totalPages > 1 && (
                  <div className="flex justify-between w-full mt-2">
                    {page > 1 ? (
                      <Link
                        href={buildPageUrl(page - 1)}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border text-sm font-medium rounded-lg text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-dark-surface2 cursor-not-allowed">
                        Previous
                      </span>
                    )}
                    {page < totalPages ? (
                      <Link
                        href={buildPageUrl(page + 1)}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border text-sm font-medium rounded-lg text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-dark-surface2 cursor-not-allowed">
                        Next
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-6">
                  <PerPageSelect currentPerPage={perPage} />
                  <p className="text-sm text-gray-500 dark:text-gray-450">
                    Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{startIdx}</span> to{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{endIdx}</span> of{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{totalItems}</span> products
                  </p>
                </div>
                {totalPages > 1 && (
                  <div>
                    <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                      {/* Previous Button */}
                      {page > 1 ? (
                        <Link
                          href={buildPageUrl(page - 1)}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 dark:border-dark-border bg-gray-50 dark:bg-dark-surface2 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </span>
                      )}

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = pageNum === page;
                        return isCurrent ? (
                          <span
                            key={pageNum}
                            aria-current="page"
                            className="z-10 bg-primary-soft dark:bg-primary-darkSoft border-primary-border text-primary-active dark:text-primary-DEFAULT relative inline-flex items-center px-4 py-2 border text-sm font-semibold"
                          >
                            {pageNum}
                          </span>
                        ) : (
                          <Link
                            key={pageNum}
                            href={buildPageUrl(pageNum)}
                            className="bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2 relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors"
                          >
                            {pageNum}
                          </Link>
                        );
                      })}

                      {/* Next Button */}
                      {page < totalPages ? (
                        <Link
                          href={buildPageUrl(page + 1)}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 dark:border-dark-border bg-gray-50 dark:bg-dark-surface2 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      )}
                    </nav>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
