import Link from 'next/link';
import { createProduct } from '../actions';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

export default async function CreateProductPage() {
  // Fetch configurators to assign to
  const configurators = await prisma.configurator.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="py-12">
      <div className="max-w-[1280px] mx-auto px-6 space-y-6">
        
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
                Create New Product
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Add a new product to Master Data and configure its package availability.
              </p>
            </div>
          </div>
          <Link href="/products" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            &larr; Back to Products
          </Link>
        </div>

        {/* Form Container */}
        <ProductForm 
          configurators={configurators}
          action={createProduct}
          submitButtonText="Create Product"
          title="Create New Product"
        />

      </div>
    </div>
  );
}
