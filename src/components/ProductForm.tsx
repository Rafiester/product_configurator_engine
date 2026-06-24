'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Configurator {
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
  configurators: Configurator[];
  initialConfigData?: InitialConfigData;
  action: (formData: FormData) => Promise<void>;
  submitButtonText: string;
  title: string;
}

export default function ProductForm({
  product,
  configurators,
  initialConfigData = {},
  action,
  submitButtonText,
  title,
}: ProductFormProps) {
  // Base details state
  const [sdp, setSdp] = useState<number>(product ? Number(product.sdp) : 0);
  const [pagePrice, setPagePrice] = useState<number>(product ? Number(product.page_price) : 0);
  const [srp, setSrp] = useState<number>(product ? Number(product.srp) : 0);

  // Configurators state: mapping id -> { enabled: boolean, qty: number }
  const [configs, setConfigs] = useState<InitialConfigData>(() => {
    const data: InitialConfigData = {};
    configurators.forEach((c) => {
      data[c.id] = initialConfigData[c.id] || { enabled: false, qty: 1 };
    });
    return data;
  });

  const toggleConfig = (id: string, checked: boolean) => {
    setConfigs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        enabled: checked,
      },
    }));
  };

  const updateConfigQty = (id: string, qty: number) => {
    setConfigs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        qty: Math.max(1, qty),
      },
    }));
  };

  // Calculations
  const enabledCount = useMemo(() => {
    return Object.values(configs).filter((c) => c.enabled).length;
  }, [configs]);

  const totalEstimatedCost = useMemo(() => {
    return Object.entries(configs)
      .filter(([_, conf]) => conf.enabled)
      .reduce((sum, [_, conf]) => sum + sdp * conf.qty, 0);
  }, [configs, sdp]);

  const margin = useMemo(() => {
    return pagePrice - totalEstimatedCost;
  }, [pagePrice, totalEstimatedCost]);

  const marginPercentage = useMemo(() => {
    if (pagePrice === 0) return '0.00';
    return ((margin / pagePrice) * 100).toFixed(2);
  }, [pagePrice, margin]);

  // Form submit wrapper
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Append configurator mappings
    Object.entries(configs).forEach(([id, conf]) => {
      if (conf.enabled) {
        formData.append('configurator_ids', id);
        formData.append(`configurator_qty_${id}`, String(conf.qty));
      }
    });

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
                {['GPU', 'RAM', 'CPU', 'Chassis', 'Motherboard', 'SSD', 'PSU', 'Cooler', 'ARGB / Accessories'].map(
                  (cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                defaultValue={product?.status || 'active'}
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
              >
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
                defaultValue={product?.qty !== undefined ? product.qty : 1}
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
                onChange={(e) => setSdp(parseFloat(e.target.value) || 0)}
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
                onChange={(e) => setPagePrice(parseFloat(e.target.value) || 0)}
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
                onChange={(e) => setSrp(parseFloat(e.target.value) || 0)}
                className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Configurators Assignment */}
        <div className="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border p-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Assign Configurators
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {enabledCount} Enabled
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Toggle the configurators where this product should be available as a component selection.
          </p>
          
          <div className="space-y-3">
            {configurators.map((configurator) => {
              const confState = configs[configurator.id] || { enabled: false, qty: 1 };
              return (
                <div
                  key={configurator.id}
                  className={`border border-gray-200 dark:border-dark-border rounded-lg overflow-hidden transition-colors ${
                    confState.enabled
                      ? 'border-primary-DEFAULT/50 ring-1 ring-primary-DEFAULT/20 dark:border-primary-DEFAULT/50 dark:bg-dark-surface2'
                      : ''
                  }`}
                >
                  {/* Toggle header */}
                  <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={confState.enabled}
                        onChange={(e) => toggleConfig(configurator.id, e.target.checked)}
                        className="rounded bg-white border-gray-300 dark:border-gray-700 text-primary-DEFAULT dark:bg-gray-800 focus:ring-primary-DEFAULT"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {configurator.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {configurator.status === 'active' ? (
                            <span className="text-green-600 dark:text-green-400">Active Builder</span>
                          ) : (
                            <span className="text-red-500 dark:text-red-400">Inactive</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        confState.enabled ? 'text-primary-DEFAULT' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {confState.enabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </label>

                  {/* Qty field */}
                  {confState.enabled && (
                    <div className="bg-gray-50 dark:bg-dark-surface p-4 border-t border-gray-200 dark:border-dark-border">
                      <div className="flex items-center gap-4 max-w-sm">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          Quantity Required:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={confState.qty}
                          onChange={(e) => updateConfigQty(configurator.id, parseInt(e.target.value) || 1)}
                          className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm tabular-nums py-1.5"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {configurators.length === 0 && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-dark-border rounded-lg">
                No configurators exist in the system.
              </div>
            )}
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
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Deployments</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {enabledCount} {enabledCount === 1 ? 'Configurator' : 'Configurators'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-border">
                <span className="text-sm text-gray-600 dark:text-gray-400">Base Est. Cost</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                  RM {totalEstimatedCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-border">
                <span className="text-sm text-gray-600 dark:text-gray-400">Base SRP</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                  RM {srp.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Estimated Margin</span>
                <span
                  className={`font-bold tabular-nums ${
                    margin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                  }`}
                >
                  RM {margin.toFixed(2)} ({marginPercentage}%)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-surface2 border border-gray-200 dark:border-dark-border rounded-xl p-4 text-xs text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">💡 How it works</p>
            <p>
              Enabling a configurator allows this product to be selected by users in that specific PC Builder workflow.
              The required quantity multiplies the base cost estimation.
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
              className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active border border-transparent rounded-xl font-semibold text-black dark:text-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 transition-colors"
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
