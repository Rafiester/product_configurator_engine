'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Category {
  id?: string;
  name: string;
  status: string;
}

interface CategoryFormProps {
  category?: Category;
  action: (formData: FormData) => Promise<void>;
  submitButtonText: string;
  title: string;
}

export default function CategoryForm({
  category,
  action,
  submitButtonText,
  title,
}: CategoryFormProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await action(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
      {/* LEFT COLUMN: PRIMARY CONFIG PANEL */}
      <div className="flex-1 space-y-6">
        
        {/* Base Details Card */}
        <div className="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-dark-border">
            Category Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={category?.name || ''}
                placeholder="e.g. Graphics Card"
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                defaultValue={category?.status || 'active'}
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
              >
                <option value="active">Publish</option>
                <option value="inactive">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: STICKY SUMMARY PANEL */}
      <div className="lg:w-80 shrink-0">
        <div className="sticky top-20 space-y-6">
          <div className="bg-gray-50 dark:bg-dark-surface2 border border-gray-200 dark:border-dark-border rounded-xl p-4 text-xs text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">💡 How it works</p>
            <p className="mb-2">
              Creating or editing a category dynamic lookup values. The categories created here will show up under the "Category" dropdown when adding/editing products.
            </p>
            <p>
              If you update a category's name, all existing products and PC builder items mapped to the old category name will automatically update to the new name.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/categories"
              className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-hover active:bg-primary-active border border-transparent rounded-xl font-semibold text-black dark:text-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Saving...' : submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
