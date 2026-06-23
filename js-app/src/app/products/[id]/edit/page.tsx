import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateProduct } from '../../actions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id, deletedAt: null }
  });

  if (!product) {
    notFound();
  }

  // Bind the ID to the server action
  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </div>
            <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
              Edit Product
            </h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            &larr; Back to Products
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
          <form action={updateProductWithId} className="p-8">
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-dark-border">
              Product Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
                <input type="text" id="category" name="category" required defaultValue={product.category} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm" />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" required defaultValue={product.name} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm" />
              </div>

              {/* Qty */}
              <div>
                <label htmlFor="qty" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity <span className="text-red-500">*</span></label>
                <input type="number" id="qty" name="qty" required min="0" defaultValue={product.qty} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm" />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status <span className="text-red-500">*</span></label>
                <select id="status" name="status" defaultValue={product.status} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm">
                  <option value="active">Publish</option>
                  <option value="inactive">Unpublish</option>
                </select>
              </div>

              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-dark-border">
                  Pricing Information
                </h3>
              </div>

              {/* SDP */}
              <div>
                <label htmlFor="sdp" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">SDP (Standard Dealer Price) <span className="text-red-500">*</span></label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">RM</span>
                  </div>
                  <input type="number" id="sdp" name="sdp" required step="0.01" min="0" defaultValue={Number(product.sdp)} className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm" />
                </div>
              </div>

              {/* Page Price */}
              <div>
                <label htmlFor="page_price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Page Price <span className="text-red-500">*</span></label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">RM</span>
                  </div>
                  <input type="number" id="page_price" name="page_price" required step="0.01" min="0" defaultValue={Number(product.page_price)} className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm" />
                </div>
              </div>

              {/* SRP */}
              <div>
                <label htmlFor="srp" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">SRP (Suggested Retail Price) <span className="text-red-500">*</span></label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">RM</span>
                  </div>
                  <input type="number" id="srp" name="srp" required step="0.01" min="0" defaultValue={Number(product.srp)} className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm" />
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-end gap-6 border-t border-gray-200 dark:border-dark-border pt-6">
              <Link href="/products" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Cancel
              </Link>
              <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
                <button type="submit" className="bg-primary-DEFAULT hover:bg-primary-hover active:bg-primary-active text-black dark:text-white font-semibold py-2.5 px-8 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
