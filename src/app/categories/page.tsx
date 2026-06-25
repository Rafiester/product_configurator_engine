import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DeleteCategoryButton } from '@/components/DeleteCategoryButton';
import PerPageSelect from '@/components/PerPageSelect';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const translations = {
  en: {
    headerTitle: 'Categories (Master Product)',
    createButton: 'Create New Category',
    filterCardTitle: 'Search & Filter Categories',
    searchPlaceholder: 'Search by category name...',
    statusOptionAll: 'Status',
    statusOptionPublish: 'Publish',
    statusOptionDraft: 'Draft',
    filterButton: 'Filter',
    clearButton: 'Clear',
    tableNo: 'No',
    tableCategoryName: 'Category Name',
    tableStatus: 'Status',
    tableActions: 'Actions',
    noCategories: 'No categories found.',
    editButton: 'Edit',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    categories: 'categories',
    previous: 'Previous',
    next: 'Next',
  },
  id: {
    headerTitle: 'Kategori (Produk Master)',
    createButton: 'Buat Kategori Baru',
    filterCardTitle: 'Cari & Filter Kategori',
    searchPlaceholder: 'Cari berdasarkan nama kategori...',
    statusOptionAll: 'Status',
    statusOptionPublish: 'Publikasikan',
    statusOptionDraft: 'Draf',
    filterButton: 'Filter',
    clearButton: 'Bersihkan',
    tableNo: 'No',
    tableCategoryName: 'Nama Kategori',
    tableStatus: 'Status',
    tableActions: 'Aksi',
    noCategories: 'Kategori tidak ditemukan.',
    editButton: 'Ubah',
    showing: 'Menampilkan',
    to: 'ke',
    of: 'dari',
    categories: 'kategori',
    previous: 'Sebelumnya',
    next: 'Selanjutnya',
  }
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; page?: string; perPage?: string }
}) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'en';
  const t = translations[lang as 'en' | 'id'] || translations.en;

  const search = searchParams.search || '';
  const status = searchParams.status || '';
  const perPage = parseInt(searchParams.perPage || '10', 10) || 10;
  const page = parseInt(searchParams.page || '1', 10) || 1;

  // Query conditions
  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }
  if (status) {
    where.status = status;
  }

  // Fetch count and categories
  const [totalItems, categoriesList] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage
    })
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  const startIdx = totalItems > 0 ? (page - 1) * perPage + 1 : 0;
  const endIdx = Math.min(page * perPage, totalItems);

  // Pagination URL helper
  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (perPage !== 10) params.set('perPage', perPage.toString());
    params.set('page', targetPage.toString());
    return `/categories?${params.toString()}`;
  };

  return (
    <div className="py-6">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
              {t.headerTitle}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block text-center sm:text-left">
              <Link href="/categories/create" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-hover active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white shadow-sm text-sm transition-colors">
                {t.createButton}
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-dark-surface p-4 shadow-sm rounded-xl border border-gray-200 dark:border-dark-border">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-1.5 border-b border-gray-200 dark:border-dark-border">
            {t.filterCardTitle}
          </h3>
          <form method="GET" action="/categories" className="flex flex-col md:flex-row md:items-center gap-4 w-full">
            <div className="w-full flex-[3]">
              <input 
                type="text" 
                name="search" 
                defaultValue={search} 
                placeholder={t.searchPlaceholder} 
                className="block w-full rounded-md bg-white border-gray-300 placeholder-gray-400 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm" 
              />
            </div>
            <div className="w-full flex-1">
              <select 
                name="status" 
                defaultValue={status} 
                className="block w-full rounded-md bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
              >
                <option value="">{t.statusOptionAll}</option>
                <option value="active">{t.statusOptionPublish}</option>
                <option value="inactive">{t.statusOptionDraft}</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 w-full md:w-auto mt-2 md:mt-0">
              <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block w-full sm:w-auto text-center">
                <button type="submit" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-hover active:bg-primary-active text-black dark:text-white font-semibold rounded-lg shadow-sm sm:text-sm transition-colors">
                  {t.filterButton}
                </button>
              </div>
              <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block w-full sm:w-auto text-center">
                <Link href="/categories" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-hover active:bg-primary-active text-black dark:text-white font-semibold rounded-lg shadow-sm sm:text-sm transition-colors">
                  {t.clearButton}
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
                  <th className="px-6 py-2.5 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t.tableNo}</th>
                  <th className="px-6 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t.tableCategoryName}</th>
                  <th className="px-6 py-2.5 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t.tableStatus}</th>
                  <th className="px-6 py-2.5 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t.tableActions}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-dark-border">
                {categoriesList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      {t.noCategories}
                    </td>
                  </tr>
                ) : (
                  categoriesList.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{startIdx + idx}</td>
                      <td className="px-6 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100">{c.name}</td>
                      <td className="px-6 py-2.5 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${c.status === 'active' ? 'bg-primary-soft text-primary-active dark:bg-primary-darkSoft border-primary-DEFAULT/30' : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {c.status === 'active' ? t.statusOptionPublish : t.statusOptionDraft}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-lg inline-block">
                            <Link href={`/categories/${c.id}/edit`} className="inline-flex items-center px-4 py-1.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-hover active:bg-primary-active text-black dark:text-white font-semibold rounded-md text-xs transition-colors">
                              {t.editButton}
                            </Link>
                          </div>
                          <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg inline-block">
                            <DeleteCategoryButton id={c.id} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Categories Card View */}
          <div className="block md:hidden divide-y divide-gray-200 dark:divide-dark-border">
            {categoriesList.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">{t.noCategories}</div>
            ) : (
              categoriesList.map((c, idx) => (
                <div key={c.id} className="px-5 py-5 space-y-3 bg-white dark:bg-dark-surface">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono font-semibold">#{startIdx + idx}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{c.name}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${c.status === 'active' ? 'bg-emerald-50 border-emerald-200/60 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800/30 dark:text-emerald-400' : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}>
                      {c.status === 'active' ? t.statusOptionPublish : t.statusOptionDraft}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2.5 pt-2">
                    <Link href={`/categories/${c.id}/edit`} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold rounded-xl text-xs transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      {t.editButton}
                    </Link>
                    <div className="flex-1 [&>button]:w-full [&>button]:justify-center [&>button]:py-2.5 [&>button]:rounded-xl [&>button]:text-xs [&>button]:font-semibold">
                      <DeleteCategoryButton id={c.id} />
                    </div>
                  </div>
                </div>
              ))
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
                        {t.previous}
                      </Link>
                    ) : (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border text-sm font-medium rounded-lg text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-dark-surface2 cursor-not-allowed">
                        {t.previous}
                      </span>
                    )}
                    {page < totalPages ? (
                      <Link
                        href={buildPageUrl(page + 1)}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors"
                      >
                        {t.next}
                      </Link>
                    ) : (
                      <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border text-sm font-medium rounded-lg text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-dark-surface2 cursor-not-allowed">
                        {t.next}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-6">
                  <PerPageSelect currentPerPage={perPage} />
                  <p className="text-sm text-gray-500 dark:text-gray-450">
                    {t.showing} <span className="font-semibold text-gray-900 dark:text-gray-100">{startIdx}</span> {t.to}{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{endIdx}</span> {t.of}{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{totalItems}</span> {t.categories}
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
