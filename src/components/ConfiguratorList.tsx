'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUI } from '@/components/ToastProvider';
import { deleteConfigurator, syncConfiguratorProducts } from '@/app/configurators/actions';

interface ProductInfo {
  id: string;
  name: string;
  sdp: number;
  page_price: number;
  srp: number;
}

interface GroupedProducts {
  [category: string]: ProductInfo[];
}

interface MappingData {
  id: string;
  configuratorId: string;
  productId: string;
  category: string;
  qty: number;
  sdp: any;
  totalSdp: any;
  pagePrice: any;
  srp: any;
  margin: any;
  marginPercentage: any;
  product: {
    name: string;
    status: string;
  };
}

interface ConfiguratorWithProducts {
  id: string;
  name: string;
  status: string;
  products: MappingData[];
}

interface ConfiguratorListProps {
  initialConfigurators: ConfiguratorWithProducts[];
  productsByCategory: GroupedProducts;
}

export default function ConfiguratorList({
  initialConfigurators,
  productsByCategory,
}: ConfiguratorListProps) {
  const [configurators, setConfigurators] = useState(initialConfigurators);
  const router = useRouter();
  const { confirm, showToast } = useUI();

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: 'Delete Configurator?',
      message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger',
    });

    if (confirmed) {
      try {
        await deleteConfigurator(id);
        showToast('success', 'Deleted', 'Configurator deleted successfully.');
        setConfigurators((prev) => prev.filter((c) => c.id !== id));
      } catch (err: any) {
        showToast('error', 'Error', err.message || 'Failed to delete configurator.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {configurators.map((c) => (
        <ConfiguratorCard
          key={c.id}
          configurator={c}
          productsByCategory={productsByCategory}
          onDelete={handleDelete}
        />
      ))}

      {configurators.length === 0 && (
        <div className="bg-white dark:bg-dark-surface2 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border text-center text-gray-500 dark:text-gray-400">
          No configurators found. Add one to get started!
        </div>
      )}
    </div>
  );
}

function ConfiguratorCard({
  configurator,
  productsByCategory,
  onDelete,
}: {
  configurator: ConfiguratorWithProducts;
  productsByCategory: GroupedProducts;
  onDelete: (id: string, name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useUI();

  const categories = [
    'GPU',
    'RAM',
    'CPU',
    'Chassis',
    'Motherboard',
    'SSD',
    'PSU',
    'Cooler',
    'ARGB / Accessories',
  ];

  // Initialize spreadsheet rows state
  const [rows, setRows] = useState(() => {
    return categories.map((cat) => {
      // Find existing selection in this category
      const existing = configurator.products.find((p) => p.category === cat);

      // Make sure the existing product is appended to category choices (in case it is inactive but assigned)
      if (existing && productsByCategory[cat]) {
        const found = productsByCategory[cat].find((p) => p.id === existing.productId);
        if (!found) {
          productsByCategory[cat].push({
            id: existing.productId,
            name: `${existing.product.name} (Inactive)`,
            sdp: Number(existing.sdp),
            page_price: Number(existing.pagePrice),
            srp: Number(existing.srp),
          });
        }
      }

      return {
        category: cat,
        productId: existing ? existing.productId : '',
        qty: existing ? existing.qty : 1,
        sdp: existing ? Number(existing.sdp) : 0,
        pagePrice: existing ? Number(existing.pagePrice) : 0,
        srp: existing ? Number(existing.srp) : 0,
      };
    });
  });

  const onProductChange = (cat: string, prodId: string) => {
    const list = productsByCategory[cat] || [];
    const prod = list.find((p) => p.id === prodId);

    setRows((prev) =>
      prev.map((r) => {
        if (r.category === cat) {
          return {
            ...r,
            productId: prodId,
            sdp: prod ? prod.sdp : 0,
            pagePrice: prod ? prod.page_price : 0,
            srp: prod ? prod.srp : 0,
          };
        }
        return r;
      })
    );
  };

  const onQtyChange = (cat: string, qty: number) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.category === cat) {
          return {
            ...r,
            qty: Math.max(1, qty),
          };
        }
        return r;
      })
    );
  };

  // Grand total calculations
  const totals = useMemo(() => {
    let sdpSum = 0;
    let pageSum = 0;
    let srpSum = 0;

    rows.forEach((r) => {
      if (r.productId) {
        sdpSum += r.sdp * r.qty;
        pageSum += r.pagePrice;
        srpSum += r.srp;
      }
    });

    const marginSum = pageSum - sdpSum;
    const marginPercent = pageSum > 0 ? (marginSum / pageSum) * 100 : 0;

    return {
      sdpSum,
      pageSum,
      srpSum,
      marginSum,
      marginPercent,
    };
  }, [rows]);

  const saveConfiguration = async () => {
    setIsSaving(true);

    const selections = rows
      .filter((r) => r.productId)
      .map((r) => {
        const totalSdp = r.sdp * r.qty;
        const margin = r.pagePrice - totalSdp;
        const marginPercentage = r.pagePrice > 0 ? (margin / r.pagePrice) * 100 : 0;

        return {
          category: r.category,
          product_id: r.productId,
          qty: r.qty,
          sdp: r.sdp,
          totalSdp,
          pagePrice: r.pagePrice,
          srp: r.srp,
          margin,
          marginPercentage,
        };
      });

    // Detect data loss/corrupt fields
    const missingProduct = selections.some((s) => !s.product_id);
    if (missingProduct) {
      showToast('error', 'Error', 'Data loss detected: Missing product ID.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await syncConfiguratorProducts(configurator.id, selections);
      if (res.success) {
        showToast('success', 'Saved', 'PC configuration saved successfully.');
      } else {
        showToast('error', 'Save Failed', res.message || 'Failed to save configuration.');
      }
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const marginClass = (val: number) => {
    if (val > 0) return 'text-primary-DEFAULT font-semibold';
    if (val < 0) return 'text-red-500 font-semibold';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <div className="bg-white dark:bg-dark-surface2 shadow-sm rounded-lg border border-gray-200 dark:border-dark-border transition-all duration-300">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-border flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/50 dark:bg-dark-surface rounded-t-lg">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 inline-block mr-3">
            {configurator.name}
          </h3>
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
              configurator.status === 'active'
                ? 'bg-primary-soft text-primary-active dark:bg-primary-darkSoft dark:text-primary-DEFAULT border-primary-border'
                : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
            }`}
          >
            {configurator.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-lg inline-block">
            <Link
              href={`/configurators/${configurator.id}/edit`}
              className="inline-flex items-center justify-center px-4 py-1.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active text-black dark:text-white font-semibold rounded-md shadow-sm text-xs transition-colors"
            >
              Edit Details
            </Link>
          </div>

          <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg inline-block">
            <button
              onClick={() => onDelete(configurator.id, configurator.name)}
              className="inline-flex items-center justify-center px-4 py-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-md shadow-sm text-xs transition-colors"
            >
              Delete
            </button>
          </div>

          <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-lg inline-block">
            <button
              onClick={() => setExpanded(!expanded)}
              className="bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active text-black dark:text-white font-semibold py-2 px-4 rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
            >
              <span>{expanded ? 'Collapse Builder' : 'Expand Builder'}</span>
              {expanded ? (
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible PC Builder */}
      {expanded && (
        <div className="pb-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-4 px-6 pt-4">
            <h4 className="text-md font-bold text-gray-900 dark:text-gray-100">Dynamic PC Builder</h4>
          </div>

          <div className="w-full overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-full text-left border-collapse table-fixed whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="py-3 px-4 font-semibold text-left text-gray-600 dark:text-gray-300 w-36">
                    Category
                  </th>
                  <th className="py-3 px-4 font-semibold text-left text-gray-600 dark:text-gray-300">
                    Product
                  </th>
                  <th className="py-3 px-4 font-semibold text-center text-gray-600 dark:text-gray-300 w-20">
                    Qty
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-28">
                    SDP
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
                    Total SDP
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-36">
                    Page Price
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
                    SRP
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-28">
                    Margin
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-24">
                    Margin %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-border bg-white dark:bg-dark-surface2">
                {rows.map((row) => (
                  <tr
                    key={row.category}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="py-2 px-4 font-medium text-gray-900 dark:text-gray-100 truncate">
                      {row.category}
                    </td>
                    <td className="py-2 px-4">
                      <select
                        value={row.productId}
                        onChange={(e) => onProductChange(row.category, e.target.value)}
                        className="w-full bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT truncate py-1.5"
                      >
                        <option value="" className="bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100">-- Select Product --</option>
                        {(productsByCategory[row.category] || []).map((p) => (
                          <option key={p.id} value={p.id} className="bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100">
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="number"
                        min="1"
                        disabled={!row.productId}
                        value={row.qty}
                        onChange={(e) => onQtyChange(row.category, parseInt(e.target.value) || 1)}
                        className="w-16 bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm text-center focus:border-primary-DEFAULT focus:ring-primary-DEFAULT disabled:opacity-50 py-1"
                      />
                    </td>
                    <td className="py-2 px-4 text-right text-gray-650 dark:text-gray-400 tabular-nums">
                      {row.productId ? `RM ${row.sdp.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-900 dark:text-gray-100 font-medium tabular-nums">
                      {row.productId ? `RM ${(row.sdp * row.qty).toFixed(2)}` : '-'}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-650 dark:text-gray-400 tabular-nums">
                      {row.productId ? `RM ${row.pagePrice.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-650 dark:text-gray-400 tabular-nums">
                      {row.productId ? `RM ${row.srp.toFixed(2)}` : '-'}
                    </td>
                    <td
                      className={`py-2 px-4 text-right tabular-nums ${marginClass(
                        row.pagePrice - row.sdp * row.qty
                      )}`}
                    >
                      {row.productId
                        ? `RM ${(row.pagePrice - row.sdp * row.qty).toFixed(2)}`
                        : '-'}
                    </td>
                    <td
                      className={`py-2 px-4 text-right tabular-nums ${marginClass(
                        row.pagePrice - row.sdp * row.qty
                      )}`}
                    >
                      {row.productId
                        ? row.pagePrice > 0
                          ? `${(((row.pagePrice - row.sdp * row.qty) / row.pagePrice) * 100).toFixed(
                              2
                            )}%`
                          : '0.00%'
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-dark-border font-bold text-sm">
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                    GRAND TOTAL:
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100 tabular-nums">
                    RM {totals.sdpSum.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100 tabular-nums">
                    RM {totals.pageSum.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100 tabular-nums">
                    RM {totals.srpSum.toFixed(2)}
                  </td>
                  <td className={`py-3 px-4 text-right tabular-nums ${marginClass(totals.marginSum)}`}>
                    RM {totals.marginSum.toFixed(2)}
                  </td>
                  <td className={`py-3 px-4 text-right tabular-nums ${marginClass(totals.marginSum)}`}>
                    {totals.marginPercent.toFixed(2)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 flex justify-end px-6">
            <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
              <button
                onClick={saveConfiguration}
                disabled={isSaving}
                className="bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active text-black dark:text-white font-semibold py-2 px-8 rounded-lg shadow-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
