'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUI } from '@/components/ToastProvider';
import { deleteBuilder, syncBuilderProducts } from '@/app/builders/actions';
import SearchableSelect from './SearchableSelect';

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
  builderId: string;
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

interface BuilderWithProducts {
  id: string;
  name: string;
  status: string;
  updatedAt?: Date;
  products: MappingData[];
}

interface BuilderListProps {
  initialBuilders: BuilderWithProducts[];
  productsByCategory: GroupedProducts;
  categories?: string[];
}

export default function BuilderList({
  initialBuilders,
  productsByCategory,
  categories,
}: BuilderListProps) {
  const [builders, setBuilders] = useState(initialBuilders);
  const router = useRouter();
  const { confirm, showToast } = useUI();

  useEffect(() => {
    setBuilders(initialBuilders);
  }, [initialBuilders]);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: 'Delete Builder?',
      message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger',
    });

    if (confirmed) {
      try {
        await deleteBuilder(id);
        showToast('success', 'Deleted', 'Builder deleted successfully.');
        setBuilders((prev) => prev.filter((b) => b.id !== id));
      } catch (err: any) {
        showToast('error', 'Error', err.message || 'Failed to delete builder.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {builders.map((b) => (
        <BuilderCard
          key={b.id}
          builder={b}
          productsByCategory={productsByCategory}
          categories={categories}
          onDelete={handleDelete}
        />
      ))}

      {builders.length === 0 && (
        <div className="bg-white dark:bg-dark-surface2 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border text-center text-gray-500 dark:text-gray-400">
          No builders found. Add one to get started!
        </div>
      )}
    </div>
  );
}

function BuilderCard({
  builder,
  productsByCategory,
  categories: propCategories,
  onDelete,
}: {
  builder: BuilderWithProducts;
  productsByCategory: GroupedProducts;
  categories?: string[];
  onDelete: (id: string, name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useUI();

  const categories = propCategories || [
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
    const initialRows: {
      id: string;
      category: string;
      productId: string;
      qty: number;
      sdp: number;
      pagePrice: number;
      srp: number;
    }[] = [];

    // 1. Add all existing product mappings from database
    builder.products.forEach((existing) => {
      const cat = existing.category;
      // Make sure existing product is in productsByCategory
      if (productsByCategory[cat]) {
        const found = productsByCategory[cat].find((p) => p.id === existing.productId);
        if (!found) {
          productsByCategory[cat].push({
            id: existing.productId,
            name: `${existing.product.name} (Unpublished)`,
            sdp: Number(existing.sdp),
            page_price: Number(existing.pagePrice),
            srp: Number(existing.srp),
          });
        }
      }

      initialRows.push({
        id: existing.id || Math.random().toString(36).substring(2, 9),
        category: cat,
        productId: existing.productId,
        qty: existing.qty,
        sdp: Number(existing.sdp),
        pagePrice: Number(existing.pagePrice),
        srp: Number(existing.srp),
      });
    });

    // 2. Identify which categories to initialize empty rows for
    const catsToUse = (builder as any).selectedCategories && (builder as any).selectedCategories.length > 0
      ? (builder as any).selectedCategories
      : (initialRows.length === 0 ? categories : []);

    catsToUse.forEach((cat: string) => {
      // Only add an empty row if no product of this category is already in initialRows
      const hasProduct = initialRows.some((r) => r.category === cat);
      if (!hasProduct) {
        initialRows.push({
          id: Math.random().toString(36).substring(2, 9),
          category: cat,
          productId: '',
          qty: 1,
          sdp: 0,
          pagePrice: 0,
          srp: 0,
        });
      }
    });

    return initialRows;
  });

  const addRow = (category: string) => {
    setRows((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        category,
        productId: '',
        qty: 1,
        sdp: 0,
        pagePrice: 0,
        srp: 0,
      },
    ]);
  };

  const removeRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const onProductChange = (rowId: string, prodId: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          const list = productsByCategory[r.category] || [];
          const prod = list.find((p) => p.id === prodId);
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

  const onQtyChange = (rowId: string, value: string) => {
    const qty = parseInt(value, 10);
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          return {
            ...r,
            qty: isNaN(qty) ? 0 : Math.max(0, qty),
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
        pageSum += r.pagePrice * r.qty;
        srpSum += r.srp * r.qty;
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
        const rowQty = r.qty || 1;
        const totalSdp = r.sdp * rowQty;
        const margin = (r.pagePrice - r.sdp) * rowQty;
        const marginPercentage = r.pagePrice > 0 ? ((r.pagePrice - r.sdp) / r.pagePrice) * 100 : 0;

        return {
          category: r.category,
          product_id: r.productId,
          qty: rowQty,
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
      const res = await syncBuilderProducts(builder.id, selections);
      if (res.success) {
        showToast('success', 'Saved', 'PC build saved successfully.');
      } else {
        showToast('error', 'Save Failed', res.message || 'Failed to save build.');
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

  const description = builder.name.toLowerCase().includes('gaming')
    ? "Gaming PC build optimized for high-performance gaming, streaming, content creation, and productivity workloads with balanced component selection and healthy profit margins."
    : `Custom PC build for ${builder.name} optimized for high-performance content creation, office productivity, and standard workloads.`;

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

  const lastUpdatedStr = formatDate(builder.updatedAt);

  return (
    <div className="bg-white dark:bg-[#171A21] shadow-sm rounded-2xl border border-gray-200 dark:border-[#2A2F3A] transition-all duration-300 overflow-hidden">
      {/* Redesigned Collapsed Card / Summary Card Header */}
      <div className="p-6 md:p-8 flex flex-col space-y-4">
        
        {/* TOP ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Left: Builder Name */}
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight m-0">
            {builder.name}
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
                builder.status === 'active'
                  ? 'bg-primary-soft text-[#F472B6] border-primary-border dark:bg-primary-darkSoft dark:text-[#F472B6]'
                  : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  builder.status === 'active' ? 'bg-[#F472B6] animate-pulse' : 'bg-gray-400'
                }`} />
                {builder.status === 'active' ? 'Publish' : 'Unpublish'}
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

          {/* Right Side: Action Buttons - stacked on mobile, inline on desktop */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 w-full md:w-auto md:justify-end shrink-0">
            
            {/* Edit Button */}
            <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-xl w-full md:w-auto">
              <Link
                href={`/builders/${builder.id}/edit`}
                className="inline-flex items-center justify-center w-full md:w-auto h-10 px-6 bg-[#F472B6] hover:bg-[#EC4899] text-white font-bold rounded-lg shadow-sm text-sm transition-colors"
              >
                Edit
              </Link>
            </div>

            {/* Delete Button */}
            <div className="p-1 bg-red-100 dark:bg-red-950/30 rounded-xl w-full md:w-auto">
              <button
                onClick={() => onDelete(builder.id, builder.name)}
                className="inline-flex items-center justify-center w-full md:w-auto h-10 px-6 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold rounded-lg shadow-sm text-sm transition-colors"
              >
                Delete
              </button>
            </div>

            {/* Expand Builder Button */}
            <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-xl w-full md:w-auto">
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center justify-center w-full md:w-auto h-10 px-6 bg-[#F472B6] hover:bg-[#EC4899] text-white font-bold rounded-lg shadow-sm text-sm transition-colors gap-2"
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
          <div className="hidden md:block">
            
            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
              .builder-scroll-container::-webkit-scrollbar {
                height: 8px;
              }
              .builder-scroll-container::-webkit-scrollbar-track {
                background: transparent;
              }
              .builder-scroll-container::-webkit-scrollbar-thumb {
                background: transparent;
                border-radius: 999px;
              }
              .builder-table-wrapper:hover .builder-scroll-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.03);
              }
              .builder-table-wrapper:hover .builder-scroll-container::-webkit-scrollbar-thumb {
                background: rgba(236, 127, 182, 0.4);
              }
              .dark .builder-table-wrapper:hover .builder-scroll-container::-webkit-scrollbar-track {
                background: #131b2d;
              }
              .dark .builder-table-wrapper:hover .builder-scroll-container::-webkit-scrollbar-thumb {
                background: #EC7FB6;
              }
              /* Make spin buttons on Qty input fields always visible */
              .builder-table-wrapper input[type="number"]::-webkit-inner-spin-button,
              .builder-table-wrapper input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: inner-spin-button !important;
                opacity: 1 !important;
              }
              .builder-table-wrapper input[type="number"] {
                -moz-appearance: number-input !important;
              }
            `}} />

            <div className="w-full overflow-hidden builder-table-wrapper">
              <div className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:thin] touch-pan-x builder-scroll-container">
                <table className="min-w-[1500px] text-left border-collapse table-fixed whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="py-4 pl-6 md:pl-8 pr-4 font-semibold text-left text-gray-600 dark:text-gray-300 w-36">
                        Category
                      </th>
                      <th className="py-4 px-4 font-semibold text-left text-gray-600 dark:text-gray-300">
                        Product
                      </th>
                      <th className="py-4 px-4 font-semibold text-center text-gray-600 dark:text-gray-300 w-20">
                        Qty
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-36">
                        Page Price
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
                        SRP
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-28">
                        SDP
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
                        Total SDP
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
                        Margin
                      </th>
                      <th className="py-4 px-4 font-semibold text-right text-gray-600 dark:text-gray-300 w-32">
                        Margin %
                      </th>
                      <th className="py-4 pl-4 pr-6 md:pr-8 font-semibold text-right text-gray-600 dark:text-gray-300 w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-dark-border bg-white dark:bg-dark-surface2">
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-3 pl-6 md:pl-8 pr-4 font-medium text-gray-900 dark:text-gray-100 truncate">
                          {row.category}
                        </td>
                        <td className="py-3 px-4">
                          <SearchableSelect
                            value={row.productId}
                            onChange={(val) => onProductChange(row.id, val)}
                            options={productsByCategory[row.category] || []}
                            placeholder="-- Select Product --"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="1"
                            value={row.qty === 0 ? '' : row.qty}
                            onChange={(e) => onQtyChange(row.id, e.target.value)}
                            className="w-16 bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm text-center focus:border-primary-DEFAULT focus:ring-primary-DEFAULT disabled:opacity-50 py-1"
                          />
                        </td>
                        <td className="py-3 px-4 text-right text-gray-655 dark:text-gray-400 tabular-nums">
                          {row.productId ? `RM ${row.pagePrice.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-655 dark:text-gray-400 tabular-nums">
                          {row.productId ? `RM ${row.srp.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-655 dark:text-gray-400 tabular-nums">
                          {row.productId ? `RM ${row.sdp.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100 font-medium tabular-nums">
                          {row.productId ? `RM ${(row.sdp * row.qty).toFixed(2)}` : '-'}
                        </td>
                        <td
                          className={`py-3 px-4 text-right tabular-nums ${marginClass(
                            (row.pagePrice - row.sdp) * row.qty
                          )}`}
                        >
                          {row.productId
                            ? `RM ${((row.pagePrice - row.sdp) * row.qty).toFixed(2)}`
                            : '-'}
                        </td>
                        <td
                          className={`py-3 px-4 text-right tabular-nums ${marginClass(
                            (row.pagePrice - row.sdp) * row.qty
                          )}`}
                        >
                          {row.productId
                            ? row.pagePrice > 0
                              ? `${(((row.pagePrice - row.sdp) / row.pagePrice) * 100).toFixed(
                                  2
                                )}%`
                              : '0.00%'
                            : '-'}
                        </td>
                        <td className="py-3 pl-4 pr-6 md:pr-8 text-right">
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                            title="Remove Row"
                          >
                            <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-dark-border font-bold text-sm">
                    <tr>
                      <td colSpan={3} className="py-4 pl-6 md:pl-8 pr-4 text-right text-gray-900 dark:text-gray-100">
                        GRAND TOTAL:
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 tabular-nums">
                        RM {totals.pageSum.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 tabular-nums">
                        RM {totals.srpSum.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-655 dark:text-gray-400 tabular-nums">
                        -
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 tabular-nums">
                        RM {totals.sdpSum.toFixed(2)}
                      </td>
                      <td className={`py-4 px-4 text-right tabular-nums ${marginClass(totals.marginSum)}`}>
                        RM {totals.marginSum.toFixed(2)}
                      </td>
                      <td className={`py-4 px-4 text-right tabular-nums ${marginClass(totals.marginSum)}`}>
                        {totals.marginPercent.toFixed(2)}%
                      </td>
                      <td className="py-4 pl-4 pr-6 md:pr-8"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="pt-6 pb-8 px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Left: Add row selector */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  id={`add-category-select-${builder.id}`}
                  className="bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT py-1.5 min-w-[180px]"
                  defaultValue=""
                >
                  <option value="">-- Add Category --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const select = document.getElementById(`add-category-select-${builder.id}`) as HTMLSelectElement;
                    if (select && select.value) {
                      addRow(select.value);
                      select.value = "";
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 bg-primary-soft dark:bg-primary-darkSoft hover:bg-primary-soft/80 text-black dark:text-white font-semibold rounded-md border border-primary-border dark:border-primary-border text-sm transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Row
                </button>
              </div>

              {/* Right: Save button */}
              <div className="p-1 bg-primary-soft dark:bg-primary-darkSoft rounded-[18px] inline-block shrink-0">
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
                  <span>{isSaving ? 'Saving...' : 'Save Build'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Category Builder Cards View */}
          <div className="block md:hidden space-y-4 px-6 pt-4 pb-2">
            {rows.map((row) => (
              <div key={row.id} className="border border-gray-200 dark:border-dark-border rounded-xl p-4 bg-gray-50/30 dark:bg-dark-surface space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                    {row.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                    title="Remove Row"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Select Component</label>
                  <SearchableSelect
                    value={row.productId}
                    onChange={(val) => onProductChange(row.id, val)}
                    options={productsByCategory[row.category] || []}
                    placeholder="-- Select Product --"
                  />
                </div>

                {row.productId && (
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="col-span-2 space-y-1">
                      <label className="block text-xs text-gray-500 dark:text-gray-400">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={row.qty === 0 ? '' : row.qty}
                        onChange={(e) => onQtyChange(row.id, e.target.value)}
                        className="w-full bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT py-1"
                      />
                    </div>
                    <div>
                      <span className="text-gray-555 dark:text-gray-400">SDP</span>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">RM {row.sdp.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-555 dark:text-gray-400">Total SDP</span>
                      <div className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">RM {(row.sdp * row.qty).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-555 dark:text-gray-400">Page Price</span>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">RM {row.pagePrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-555 dark:text-gray-400">SRP</span>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">RM {row.srp.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-555 dark:text-gray-400">Margin</span>
                      <div className={`font-semibold mt-0.5 ${marginClass((row.pagePrice - row.sdp) * row.qty)}`}>
                        RM {((row.pagePrice - row.sdp) * row.qty).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-555 dark:text-gray-400">Margin %</span>
                      <div className={`font-semibold mt-0.5 ${marginClass((row.pagePrice - row.sdp) * row.qty)}`}>
                        {row.pagePrice > 0
                          ? `${(((row.pagePrice - row.sdp) / row.pagePrice) * 100).toFixed(2)}%`
                          : '0.00%'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Add Row Selector */}
            <div className="pt-2 pb-4 flex flex-col gap-3">
              <select
                id={`add-category-select-mobile-${builder.id}`}
                className="w-full bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT py-1.5"
                defaultValue=""
              >
                <option value="">-- Add Category --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const select = document.getElementById(`add-category-select-mobile-${builder.id}`) as HTMLSelectElement;
                  if (select && select.value) {
                    addRow(select.value);
                    select.value = "";
                  }
                }}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-soft dark:bg-primary-darkSoft hover:bg-primary-soft/80 text-black dark:text-white font-semibold rounded-md border border-primary-border dark:border-primary-border text-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Row
              </button>
            </div>
            
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
                  <span>{isSaving ? 'Saving...' : 'Save Build'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
