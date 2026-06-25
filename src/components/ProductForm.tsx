'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Builder {
  id: string;
  name: string;
  status: string;
}

interface Product {
  id?: string;
  name: string;
  category: string;
  qty: number;
  sdp: any;
  page_price: any;
  srp: any;
  status: string;
}

interface InitialConfigData {
  [key: string]: {
    enabled: boolean;
    qty: number;
  };
}

interface ProductFormProps {
  product?: Product;
  builders: Builder[];
  categories: string[];
  initialConfigData?: InitialConfigData;
  action: (formData: FormData) => Promise<void>;
  submitButtonText: string;
  title: string;
}

export default function ProductForm({
  product,
  categories,
  action,
  submitButtonText,
}: ProductFormProps) {
  // Base details state
  const [sdp, setSdp] = useState<string>(product ? String(product.sdp) : '');
  const [pagePrice, setPagePrice] = useState<string>(product ? String(product.page_price) : '');
  const [srp, setSrp] = useState<string>(product ? String(product.srp) : '');

  // Calculations
  const productMargin = useMemo(() => {
    return Number(pagePrice) - Number(sdp);
  }, [pagePrice, sdp]);

  const productMarginPercentage = useMemo(() => {
    const price = Number(pagePrice);
    if (price === 0) return '0.00';
    return ((productMargin / price) * 100).toFixed(2);
  }, [pagePrice, productMargin]);

  // Form submit wrapper
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await action(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
      {/* LEFT COLUMN: PRIMARY CONFIG PANEL */}
      <div className="flex-1 space-y-6">
        
        {/* Base Details Card */}
        <div className="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-dark-border">
            Base Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={product?.name || ''}
                placeholder="e.g. Intel Core i5"
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                defaultValue={product?.category || ''}
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
              >
                <option value="">-- Select Category --</option>
                {useMemo(() => {
                  const list = [...categories];
                  if (product?.category && !list.includes(product.category)) {
                    list.push(product.category);
                  }
                  return list.sort();
                }, [categories, product?.category]).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                required
                defaultValue={product?.status || ''}
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
              >
                <option value="" disabled>-- Select Status --</option>
                <option value="active">Publish</option>
                <option value="inactive">Unpublish</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Global Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="qty"
                required
                min="0"
                defaultValue={product?.qty !== undefined ? product.qty : ''}
                placeholder="e.g. 10"
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                SDP (RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="sdp"
                required
                value={sdp}
                onChange={(e) => setSdp(e.target.value)}
                placeholder="e.g. RM 200"
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Page Price (RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="page_price"
                required
                value={pagePrice}
                onChange={(e) => setPagePrice(e.target.value)}
                placeholder="e.g. RM 200"
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                SRP (RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="srp"
                required
                value={srp}
                onChange={(e) => setSrp(e.target.value)}
                placeholder="e.g. RM 200"
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm tabular-nums"
              />
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: STICKY SUMMARY PANEL */}
      <div className="lg:w-80 shrink-0">
        <div className="sticky top-20 space-y-6">
          <div className="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
            <div className="bg-primary-soft dark:bg-primary-darkSoft p-4 border-b border-primary-DEFAULT/20">
              <h3 className="text-primary-active dark:text-primary-dark font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Live Summary
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-border">
                <span className="text-sm text-gray-600 dark:text-gray-400">Base Est. Cost</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                  RM {Number(sdp).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-border">
                <span className="text-sm text-gray-600 dark:text-gray-400">Page Price</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                  RM {Number(pagePrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-border">
                <span className="text-sm text-gray-600 dark:text-gray-400">Base SRP</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                  RM {Number(srp).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Estimated Margin</span>
                <span
                  className={`font-bold tabular-nums ${
                    productMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                  }`}
                >
                  RM {productMargin.toFixed(2)} ({productMarginPercentage}%)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-surface2 border border-gray-200 dark:border-dark-border rounded-xl p-4 text-xs text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">💡 How it works</p>
            <p>
              Fill in the base details and pricing of the product. The category dropdown is dynamically populated from your Master Categories list.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/products"
              className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-hover active:bg-primary-active border border-transparent rounded-xl font-semibold text-black dark:text-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 transition-colors"
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
