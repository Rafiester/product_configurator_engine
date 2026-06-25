import Link from 'next/link';
import { createCategory } from '../actions';
import CategoryForm from '@/components/CategoryForm';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const translations = {
  en: {
    title: 'Create New Category',
    subtitle: 'Add a new category to Master Product lookup tables.',
    backLink: '← Back to Categories',
    submitText: 'Create Category',
  },
  id: {
    title: 'Buat Kategori Baru',
    subtitle: 'Tambahkan kategori baru ke dalam tabel pencarian Produk Master.',
    backLink: '← Kembali ke Kategori',
    submitText: 'Buat Kategori',
  }
};

export default async function CreateCategoryPage() {
  const cookieStore = cookies();
  const lang = cookieStore.get('lang')?.value || 'en';
  const t = translations[lang as 'en' | 'id'] || translations.en;

  return (
    <div className="py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
                {t.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t.subtitle}
              </p>
            </div>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            {t.backLink}
          </Link>
        </div>

        {/* Form Container */}
        <CategoryForm 
          action={createCategory}
          submitButtonText={t.submitText}
          title={t.title}
        />

      </div>
    </div>
  );
}
