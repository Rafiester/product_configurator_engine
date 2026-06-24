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
  updatedAt?: Date;
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
    if (val > 0) return 'text-[#F472B6] font-semibold';
    if (val < 0) return 'text-red-500 font-semibold';
    return 'text-gray-500 dark:text-gray-400';
  };

  const componentsCount = rows.filter((r) => r.productId).length;

  const description = configurator.name.toLowerCase().includes('gaming')
    ? "Gaming PC configuration optimized for high-performance gaming, streaming, content creation, and productivity workloads with balanced component selection and healthy profit margins."
    : `Custom PC build configuration for ${configurator.name} optimized for high-performance content creation, office productivity, and standard workloads.`;

  const formatDate = (date?: Date) => {
    if (!date) return 'Not Available';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(date);
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const lastUpdatedStr = formatDate(configurator.updatedAt);

  return (
    <div className="bg-white dark:bg-[#171A21] shadow-sm rounded-2xl border border-gray-200 dark:border-[#2A2F3A] transition-all duration-300 overflow-hidden">
      {/* Redesigned Collapsed Card / Summary Card Header */}
      <div className="p-6 md:p-8 flex flex-col space-y-4">
        
        {/* TOP ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Left: Configurator Name */}
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight m-0">
            {configurator.name}
          </h3>
          
          {/* Right: Last Updated label */}
          <div className="text-left sm:text-right shrink-0">
            <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Last Updated
            </span>
            <span className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mt-0.5">
              {lastUpdatedStr}
            </span>
          </div>
        </div>

        {/* MIDDLE SECTION: Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 max-w-4xl m-0">
          {description}
        </p>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
          
          {/* Left Side: Status & Stats */}
          <div className="space-y-3">
            {/* Status Badge */}
            <div className="flex items-center">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                configurator.status === 'active'
                  ? 'bg-primary-soft text-[#F472B6] border-primary-border dark:bg-primary-darkSoft dark:text-[#F472B6]'
                  : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  configurator.status === 'active' ? 'bg-[#F472B6] animate-pulse' : 'bg-gray-400'
                }`} />
                {configurator.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {/* Component Stats */}
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span>Components: <strong className="text-gray-900 dark:text-gray-100 font-bold">{componentsCount}</strong></span>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <span>Avg Margin: <strong className="text-[#F472B6] font-bold">{totals.marginPercent.toFixed(2)}%</strong></span>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <span>Margin: <strong className="text-emerald-500 dark:text-emerald-400 font-bold">RM {totals.marginSum.toFixed(2)}</strong></span>
            </div>
          </div>

          {/* Right Side: Action Buttons aligned horizontally */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
            
            {/* Edit Button */}
            <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-xl shrink-0">
              <Link
                href={`/configurators/${configurator.id}/edit`}
                className="inline-flex items-center justify-center h-10 px-6 bg-[#F472B6] hover:bg-[#EC4899] text-white font-bold rounded-lg shadow-sm text-sm transition-colors"
              >
                Edit
              </Link>
            </div>

            {/* Delete Button */}
            <div className="p-1 bg-red-100 dark:bg-red-950/30 rounded-xl shrink-0">
              <button
                onClick={() => onDelete(configurator.id, configurator.name)}
                className="inline-flex items-center justify-center h-10 px-6 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold rounded-lg shadow-sm text-sm transition-colors"
              >
                Delete
              </button>
            </div>

            {/* Expand Builder Button */}
            <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-xl shrink-0">
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center justify-center h-10 px-6 bg-[#F472B6] hover:bg-[#EC4899] text-white font-bold rounded-lg shadow-sm text-sm transition-colors gap-2"
              >
                <span>{expanded ? 'Collapse Builder' : 'Expand Builder'}</span>
                {expanded ? (
                  <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Collapsible PC Builder */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-[#2A2F3A] pt-6 pb-4 transition-all duration-300">

          {/* Desktop Builder Grid View */}
          <div className="hidden md:block px-6 md:px-8">
            
            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
              .builder-scroll-container::-webkit-scrollbar {
                height: 8px;
              }
              .dark .builder-scroll-container::-webkit-scrollbar-track {
                background: #131b2d;
              }
              .dark .builder-scroll-container::-webkit-scrollbar-thumb {
                background: #EC7FB6;
                border-radius: 999px;
              }
            `}} />

            <div className="w-full overflow-hidden builder-table-wrapper">
              <div className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:thin] touch-pan-x builder-scroll-container">
                <table className="min-w-[1500px] text-left border-collapse table-fixed whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="py-4 pl-0 pr-4 font-semibold text-left text-gray-600 dark:text-gray-300 w-36">
                        Category
                      </th>
                      <th className="py-4 px-4 font-semibold text-left text-gray-600 dark:text-gray-300">
                        Product
                      </th>
                      <th className="py-4 px-4 font-semibold text-center text-gray-600 dark:text-gray-300 w-20">
                        Qty
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-28">
                        SDP
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
                        Total SDP
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-36">
                        Page Price
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
                        SRP
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
                        Margin
                      </th>
                      <th className="py-4 pl-4 pr-0 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
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
                        <td className="py-3 pl-0 pr-4 font-medium text-gray-900 dark:text-gray-100 truncate">
                          {row.category}
                        </td>
                        <td className="py-3 px-4">
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
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="1"
                            disabled={!row.productId}
                            value={row.qty}
                            onChange={(e) => onQtyChange(row.category, parseInt(e.target.value) || 1)}
                            className="w-16 bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm text-center focus:border-primary-DEFAULT focus:ring-primary-DEFAULT disabled:opacity-50 py-1"
                          />
                        </td>
                        <td className="py-3 px-4 text-right text-gray-650 dark:text-gray-400 tabular-nums">
                          {row.productId ? `RM ${row.sdp.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100 font-medium tabular-nums">
                          {row.productId ? `RM ${(row.sdp * row.qty).toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-650 dark:text-gray-400 tabular-nums">
                          {row.productId ? `RM ${row.pagePrice.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-650 dark:text-gray-400 tabular-nums">
                          {row.productId ? `RM ${row.srp.toFixed(2)}` : '-'}
                        </td>
                        <td
                          className={`py-3 px-4 text-right tabular-nums ${marginClass(
                            row.pagePrice - row.sdp * row.qty
                          )}`}
                        >
                          {row.productId
                            ? `RM ${(row.pagePrice - row.sdp * row.qty).toFixed(2)}`
                            : '-'}
                        </td>
                        <td
                          className={`py-3 pl-4 pr-0 text-right tabular-nums ${marginClass(
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
                      <td colSpan={4} className="py-4 pl-0 pr-4 text-right text-gray-900 dark:text-gray-100">
                        GRAND TOTAL:
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 tabular-nums">
                        RM {totals.sdpSum.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 tabular-nums">
                        RM {totals.pageSum.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 tabular-nums">
                        RM {totals.srpSum.toFixed(2)}
                      </td>
                      <td className={`py-4 px-4 text-right tabular-nums ${marginClass(totals.marginSum)}`}>
                        RM {totals.marginSum.toFixed(2)}
                      </td>
                      <td className={`py-4 pl-4 pr-0 text-right tabular-nums ${marginClass(totals.marginSum)}`}>
                        {totals.marginPercent.toFixed(2)}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="pt-6 pb-8 flex justify-end">
              <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-[18px] inline-block">
                <button
                  onClick={saveConfiguration}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center h-[52px] px-[28px] bg-[#EC7FB6] hover:bg-[#F090C1] text-white font-semibold rounded-[14px] shadow-[0_8px_24px_rgba(236,127,182,0.25)] border border-[rgba(236,127,182,0.25)] text-[15px] transition-all duration-200 disabled:opacity-50 gap-2"
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

          {/* Mobile Category Builder Cards View */}
          <div className="block md:hidden space-y-4 px-6 pt-4 pb-2">
            {rows.map((row) => (
              <div key={row.category} className="border border-gray-200 dark:border-dark-border rounded-xl p-4 bg-gray-50/30 dark:bg-dark-surface space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                    {row.category}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Select Component</label>
                  <select
                    value={row.productId}
                    onChange={(e) => onProductChange(row.category, e.target.value)}
                    className="w-full bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT py-1.5"
                  >
                    <option value="" className="bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100">-- Select Product --</option>
                    {(productsByCategory[row.category] || []).map((p) => (
                      <option key={p.id} value={p.id} className="bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {row.productId && (
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="col-span-2 space-y-1">
                      <label className="block text-xs text-gray-500 dark:text-gray-400">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={row.qty}
                        onChange={(e) => onQtyChange(row.category, parseInt(e.target.value) || 1)}
                        className="w-full bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT py-1"
                      />
                    </div>
                    <div>
                      <span className="text-gray-550 dark:text-gray-400">SDP</span>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">RM {row.sdp.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-550 dark:text-gray-400">Total SDP</span>
                      <div className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">RM {(row.sdp * row.qty).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-550 dark:text-gray-400">Page Price</span>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">RM {row.pagePrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-550 dark:text-gray-400">SRP</span>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">RM {row.srp.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-550 dark:text-gray-400">Margin</span>
                      <div className={`font-semibold mt-0.5 ${marginClass(row.pagePrice - row.sdp * row.qty)}`}>
                        RM {(row.pagePrice - row.sdp * row.qty).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-550 dark:text-gray-400">Margin %</span>
                      <div className={`font-semibold mt-0.5 ${marginClass(row.pagePrice - row.sdp * row.qty)}`}>
                        {row.pagePrice > 0
                          ? `${(((row.pagePrice - row.sdp * row.qty) / row.pagePrice) * 100).toFixed(2)}%`
                          : '0.00%'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile Grand Totals Summary Card */}
            <div className="border-t border-gray-200 dark:border-dark-border pt-4 mt-4 text-xs">
              <div className="bg-gray-50 dark:bg-dark-surface p-4 rounded-xl space-y-2.5">
                <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">GRAND TOTALS</div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">TOTAL SDP</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">RM {totals.sdpSum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">TOTAL PAGE PRICE</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">RM {totals.pageSum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">TOTAL SRP</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">RM {totals.srpSum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-150 dark:border-dark-border/50 pt-2">
                  <span className="text-gray-500 dark:text-gray-450 font-semibold">EST. MARGIN</span>
                  <span className={`font-bold ${marginClass(totals.marginSum)}`}>
                    RM {totals.marginSum.toFixed(2)} ({totals.marginPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Save Button */}
            <div className="mt-4 flex justify-stretch w-full pb-8">
              <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-[18px] inline-block w-full">
                <button
                  onClick={saveConfiguration}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center h-[52px] w-full bg-[#EC7FB6] hover:bg-[#F090C1] text-white font-semibold rounded-[14px] shadow-[0_8px_24px_rgba(236,127,182,0.25)] border border-[rgba(236,127,182,0.25)] text-[15px] transition-all duration-200 disabled:opacity-50 gap-2"
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
        </div>
      )}
    </div>
  );
}
