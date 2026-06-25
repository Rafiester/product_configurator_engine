import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateCategory } from '../../actions';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/CategoryForm';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const translations = {
  en: {
    title: 'Edit Category Details',
    subtitle: 'Modify category parameters and sync product associations.',
    backLink: '← Back to Categories',
    submitText: 'Save Changes',
  },
  id: {
    title: 'Ubah Detail Kategori',
    subtitle: 'Ubah parameter kategori dan sinkronisasi asosiasi produk.',
    backLink: '← Kembali ke Kategori',
    submitText: 'Simpan Perubahan',
  }
};

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id }
  });

  if (!category) {
    notFound();
  }

  const cookieStore = cookies();
  const lang = cookieStore.get('lang')?.value || 'en';
  const t = translations[lang as 'en' | 'id'] || translations.en;

  // Bind the ID to the server action
  const updateCategoryWithId = updateCategory.bind(null, category.id);

  return (
    <div className="py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
          category={category}
          action={updateCategoryWithId}
          submitButtonText={t.submitText}
          title={t.title}
        />

      </div>
    </div>
  );
}
