import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ImportModal from '@/components/ImportModal';
import { cookies } from 'next/headers';

const t = {
  en: {
    title: 'Metrics Dashboard',
    subtitle: 'Real-time overview of catalogs, active builds, margins, and operational performance.',
    liveData: 'LIVE SYSTEM DATA',
    totalProducts: 'Total Products',
    publishedCatalog: 'Published items in catalog',
    configurators: 'Configurators',
    publishedBuilds: 'Published Builds',
    avgMargin: 'Average Margin %',
    weightedAverage: 'Weighted average across builds',
    potentialRevenue: 'Potential Revenue',
    sumConfigurator: 'Sum of configurator values',
    quickActions: 'Quick Actions',
    quickActionsDesc: 'Shortcuts to manage catalog items, compile configurations, or import/export master files.',
    newProduct: 'New Product',
    newProductDesc: 'Add component to master database',
    newConfigurator: 'New Configurator',
    newConfiguratorDesc: 'Build new system specification',
    importProducts: 'Import Products',
    importProductsDesc: 'Upload catalog from Excel',
    exportMaster: 'Export Master Data',
    exportMasterDesc: 'Download database spreadsheet',
    categoryDist: 'Product Category Distribution',
    categoryDistDesc: 'Spread of active products in catalog by component category.',
    products: 'Products',
    marginHealth: 'Margin Health',
    marginHealthDesc: 'Average catalog profit margins by component category.',
    healthy: 'Healthy',
    target: 'Target',
    low: 'Low',
    topConfigurators: 'Top Configurators',
    topConfiguratorsDesc: 'Top 5 configuration builds ranked by estimated margin amount.',
    noConfigurators: 'No configuration builds created yet.',
    recentActivities: 'Recent Activities',
    recentActivitiesDesc: 'Timeline tracking recent additions or edits to catalog and builds.',
    noActivities: 'No recent activities recorded.',
    publish: 'Publish',
    unpublish: 'Unpublish',
    createdProduct: 'Created product "{name}"',
    updatedProduct: 'Updated product "{name}"',
    createdConfigurator: 'Created configurator "{name}"',
    updatedConfigurator: 'Updated configurator "{name}"'
  },
  id: {
    title: 'Dasbor Metrik',
    subtitle: 'Tinjauan real-time katalog, konfigurasi aktif, margin, dan kinerja operasional.',
    liveData: 'DATA SISTEM LANGSUNG',
    totalProducts: 'Total Produk',
    publishedCatalog: 'Item terbitan di katalog',
    configurators: 'Konfigurator',
    publishedBuilds: 'Konfigurasi Terbit',
    avgMargin: 'Rata-rata Margin %',
    weightedAverage: 'Rata-rata tertimbang di semua konfigurasi',
    potentialRevenue: 'Potensi Pendapatan',
    sumConfigurator: 'Jumlah nilai konfigurasi',
    quickActions: 'Tindakan Cepat',
    quickActionsDesc: 'Pintasan untuk mengelola item katalog, menyusun konfigurasi, atau impor/ekspor file master.',
    newProduct: 'Produk Baru',
    newProductDesc: 'Tambah komponen ke database master',
    newConfigurator: 'Konfigurator Baru',
    newConfiguratorDesc: 'Buat spesifikasi sistem baru',
    importProducts: 'Impor Produk',
    importProductsDesc: 'Unggah katalog dari Excel',
    exportMaster: 'Ekspor Data Master',
    exportMasterDesc: 'Unduh spreadsheet database',
    categoryDist: 'Distribusi Kategori Produk',
    categoryDistDesc: 'Penyebaran produk aktif di katalog berdasarkan kategori komponen.',
    products: 'Produk',
    marginHealth: 'Kesehatan Margin',
    marginHealthDesc: 'Rata-rata margin keuntungan katalog berdasarkan kategori komponen.',
    healthy: 'Sehat',
    target: 'Target',
    low: 'Rendah',
    topConfigurators: 'Konfigurator Teratas',
    topConfiguratorsDesc: '5 konfigurasi teratas diurutkan berdasarkan perkiraan jumlah margin.',
    noConfigurators: 'Belum ada konfigurasi yang dibuat.',
    recentActivities: 'Aktivitas Terbaru',
    recentActivitiesDesc: 'Linimasa pelacakan penambahan atau pengeditan terbaru pada katalog dan konfigurasi.',
    noActivities: 'Tidak ada aktivitas terbaru yang tercatat.',
    publish: 'Terbit',
    unpublish: 'Batal Terbit',
    createdProduct: 'Membuat produk "{name}"',
    updatedProduct: 'Memperbarui produk "{name}"',
    createdConfigurator: 'Membuat konfigurator "{name}"',
    updatedConfigurator: 'Memperbarui konfigurator "{name}"'
  }
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const lang = cookieStore.get('lang')?.value || 'en';
  const activeT = t[lang as 'en' | 'id'] || t.en;

  // Query all necessary data concurrently
  const [
    totalProducts,
    totalConfigurators,
    activeConfigurators,
    allMappings,
    configuratorsWithProducts,
    catalogProducts
  ] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.configurator.count(),
    prisma.configurator.count({ where: { status: 'active' } }),
    prisma.configuratorProductMapping.findMany(),
    prisma.configurator.findMany({
      include: {
        products: true
      }
    }),
    prisma.product.findMany({
      where: { deletedAt: null },
      select: {
        category: true,
        sdp: true,
        page_price: true
      }
    })
  ]);

  // 1. Calculate Average Margin % across all configurators with builds
  let totalConfiguratorsMarginPercent = 0;
  let configuratorsWithProductsCount = 0;

  configuratorsWithProducts.forEach(c => {
    if (c.products.length > 0) {
      const sdpSum = c.products.reduce((sum, p) => sum + Number(p.totalSdp), 0);
      const pageSum = c.products.reduce((sum, p) => sum + Number(p.pagePrice), 0);
      if (pageSum > 0) {
        const marginPercent = ((pageSum - sdpSum) / pageSum) * 100;
        totalConfiguratorsMarginPercent += marginPercent;
        configuratorsWithProductsCount += 1;
      }
    }
  });

  const avgMarginPercent = configuratorsWithProductsCount > 0
    ? totalConfiguratorsMarginPercent / configuratorsWithProductsCount
    : 0;

  // 2. Calculate Potential Revenue (sum of pagePrice of all mapping items)
  const potentialRevenue = allMappings.reduce((sum, m) => sum + Number(m.pagePrice), 0);

  // 3. Product Category Distribution (Donut Chart)
  const categories = [
    'CPU',
    'GPU',
    'RAM',
    'SSD',
    'Motherboard',
    'PSU',
    'Chassis',
    'Cooler',
    'Accessories'
  ];

  const categoryCounts: { [key: string]: number } = {};
  categories.forEach(cat => {
    categoryCounts[cat] = 0;
  });

  catalogProducts.forEach(p => {
    const cat = p.category;
    if (categories.includes(cat)) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    } else {
      categoryCounts['Accessories'] = (categoryCounts['Accessories'] || 0) + 1;
    }
  });

  const categoryCountsTotal = categories.reduce((sum, cat) => sum + categoryCounts[cat], 0);

  // Soft modern pastel palette matching guidelines
  const categoryColors: { [key: string]: string } = {
    GPU: '#F472B6',         // Pastel Pink (primary)
    CPU: '#60A5FA',         // Soft Blue
    RAM: '#34D399',         // Soft Emerald
    SSD: '#FBBF24',         // Soft Amber
    Motherboard: '#A78BFA', // Soft Purple
    PSU: '#F472B6',         // Soft Pink (reuse matching theme)
    Chassis: '#22D3EE',     // Soft Cyan
    Cooler: '#2DD4BF',      // Soft Teal
    Accessories: '#9CA3AF'  // Soft Gray
  };

  let accumulatedPercent = 0;
  const donutSegments = categories.map(cat => {
    const count = categoryCounts[cat] || 0;
    const percent = categoryCountsTotal > 0 ? count / categoryCountsTotal : 0;
    const dashArray = `${(percent * 251.327).toFixed(2)} 251.327`;
    const rotateAngle = (accumulatedPercent * 360) - 90;
    accumulatedPercent += percent;
    return {
      category: cat,
      count,
      percent: (percent * 100).toFixed(1),
      dashArray,
      rotateAngle,
      color: categoryColors[cat]
    };
  });

  // 4. Margin Health Horizontal Bar Chart (from Catalog Products)
  const categoryMarginTotals: { [category: string]: { sumPercent: number; count: number } } = {};
  categories.forEach(cat => {
    categoryMarginTotals[cat] = { sumPercent: 0, count: 0 };
  });

  catalogProducts.forEach(p => {
    const pagePrice = Number(p.page_price);
    const sdp = Number(p.sdp);
    const margin = pagePrice - sdp;
    const marginPercent = pagePrice > 0 ? (margin / pagePrice) * 100 : 0;

    const cat = p.category;
    if (categories.includes(cat)) {
      categoryMarginTotals[cat].sumPercent += marginPercent;
      categoryMarginTotals[cat].count += 1;
    } else {
      categoryMarginTotals['Accessories'].sumPercent += marginPercent;
      categoryMarginTotals['Accessories'].count += 1;
    }
  });

  const marginHealthData = categories.map(cat => {
    const data = categoryMarginTotals[cat];
    const avgMargin = data && data.count > 0 ? data.sumPercent / data.count : 0;
    
    // Color code guidelines
    let color = '#F472B6'; // Pastel pink (10% - 15%)
    let bgClass = 'bg-[#F472B6]';
    let textClass = 'text-[#F472B6]';
    if (avgMargin >= 15) {
      color = '#10B981'; // Green
      bgClass = 'bg-emerald-500';
      textClass = 'text-emerald-500';
    } else if (avgMargin < 10) {
      color = '#F97316'; // Orange
      bgClass = 'bg-orange-500';
      textClass = 'text-orange-500';
    }

    return {
      category: cat,
      avgMargin: parseFloat(avgMargin.toFixed(1)),
      color,
      bgClass,
      textClass
    };
  });

  // 5. Top 5 Configurators
  const topConfigurators = configuratorsWithProducts.map(c => {
    const marginSum = c.products.reduce((sum, p) => sum + Number(p.margin), 0);
    return {
      id: c.id,
      name: c.name,
      status: c.status,
      margin: marginSum
    };
  });
  topConfigurators.sort((a, b) => b.margin - a.margin);
  const displayTopConfigurators = topConfigurators.slice(0, 5);

  // 6. Recent Activities timeline (derived dynamically from timestamps)
  const [recentProducts, recentConfigurators] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      take: 5
    }),
    prisma.configurator.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5
    })
  ]);

  const activities: { type: string; title: string; time: Date }[] = [];

  recentProducts.forEach(p => {
    const isNew = Math.abs(p.createdAt.getTime() - p.updatedAt.getTime()) < 2000;
    const titleTemplate = isNew ? activeT.createdProduct : activeT.updatedProduct;
    activities.push({
      type: 'product',
      title: titleTemplate.replace('{name}', p.name),
      time: p.updatedAt
    });
  });

  recentConfigurators.forEach(c => {
    const isNew = Math.abs(c.createdAt.getTime() - c.updatedAt.getTime()) < 2000;
    const titleTemplate = isNew ? activeT.createdConfigurator : activeT.updatedConfigurator;
    activities.push({
      type: 'configurator',
      title: titleTemplate.replace('{name}', c.name),
      time: c.updatedAt
    });
  });

  activities.sort((a, b) => b.time.getTime() - a.time.getTime());
  const displayActivities = activities.slice(0, 6);

  return (
    <div className="py-6 min-h-screen dashboard-bg transition-colors duration-200">
      {/* Strict Theme Compliance Stylesheet Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-bg {
          background-color: #FFFFFF;
        }
        .dark .dashboard-bg {
          background-color: #0F1115;
        }
        .dashboard-card {
          background-color: #FFFFFF;
          border-color: #E5E7EB;
          color: #111827;
        }
        .dark .dashboard-card {
          background-color: #171A21;
          border-color: #2A2F3A;
          color: #F3F4F6;
        }
        .dashboard-border {
          border-color: #E5E7EB;
        }
        .dark .dashboard-border {
          border-color: #2A2F3A;
        }
        .dashboard-text-muted {
          color: #4B5563;
        }
        .dark .dashboard-text-muted {
          color: #9CA3AF;
        }
      `}} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeT.title}</h1>
            <p className="text-sm dashboard-text-muted mt-1">{activeT.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-soft text-[#F472B6]">
            <span className="w-2 h-2 rounded-full bg-[#F472B6] animate-pulse"></span>
            {activeT.liveData}
          </div>
        </div>


        {/* 1. KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card: Products */}
          <div className="dashboard-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold dashboard-text-muted">{activeT.totalProducts}</span>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight">{totalProducts}</h3>
              <p className="text-xs dashboard-text-muted mt-1">{activeT.publishedCatalog}</p>
            </div>
          </div>

          {/* Card: Configurators */}
          <div className="dashboard-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold dashboard-text-muted">{activeT.configurators}</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight">{totalConfigurators}</h3>
              <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {activeConfigurators} {activeT.publishedBuilds}
              </p>
            </div>
          </div>

          {/* Card: Average Margin % */}
          <div className="dashboard-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold dashboard-text-muted">{activeT.avgMargin}</span>
              <div className="p-2 bg-[#F472B6]/10 text-[#F472B6] rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#F472B6]">
                {avgMarginPercent.toFixed(1)}%
              </h3>
              <p className="text-xs dashboard-text-muted mt-1">{activeT.weightedAverage}</p>
            </div>
          </div>

          {/* Card: Potential Revenue */}
          <div className="dashboard-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold dashboard-text-muted">{activeT.potentialRevenue}</span>
              <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight">
                RM {potentialRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs dashboard-text-muted mt-1">{activeT.sumConfigurator}</p>
            </div>
          </div>

        </div>

        {/* Quick Actions (Moved below KPI row) */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{activeT.quickActions}</h3>
            <p className="text-xs dashboard-text-muted mt-0.5">{activeT.quickActionsDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: New Product */}
            <Link href="/products/create" className="dashboard-card border rounded-2xl p-6 hover:border-[#F472B6] transition-colors group flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-[#F472B6]/10 group-hover:text-[#F472B6] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
              <div className="mt-auto">
                <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 leading-tight">{activeT.newProduct}</h4>
                <p className="text-xs dashboard-text-muted mt-0.5">{activeT.newProductDesc}</p>
              </div>
            </Link>

            {/* Card 2: New Configurator */}
            <Link href="/configurators/create" className="dashboard-card border rounded-2xl p-6 hover:border-[#F472B6] transition-colors group flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:bg-[#F472B6]/10 group-hover:text-[#F472B6] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
              <div className="mt-auto">
                <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 leading-tight">{activeT.newConfigurator}</h4>
                <p className="text-xs dashboard-text-muted mt-0.5">{activeT.newConfiguratorDesc}</p>
              </div>
            </Link>

            {/* Card 3: Import Excel */}
            <div className="dashboard-card border rounded-2xl p-6 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
              </div>
              <div className="flex sm:flex-row sm:items-end justify-between gap-3 mt-auto w-full">
                <div className="truncate">
                  <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 leading-tight">{activeT.importProducts}</h4>
                  <p className="text-xs dashboard-text-muted mt-0.5 truncate">{activeT.importProductsDesc}</p>
                </div>
                <div className="shrink-0 -mb-1.5 -mr-1.5">
                  <ImportModal />
                </div>
              </div>
            </div>

            {/* Card 4: Export Master Data */}
            <a href="/api/products/export" className="dashboard-card border rounded-2xl p-6 hover:border-[#F472B6] transition-colors group flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl group-hover:bg-[#F472B6]/10 group-hover:text-[#F472B6] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
              <div className="mt-auto">
                <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 leading-tight">{activeT.exportMaster}</h4>
                <p className="text-xs dashboard-text-muted mt-0.5">{activeT.exportMasterDesc}</p>
              </div>
            </a>

          </div>
        </div>

        {/* 2. Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card: Product Category Distribution */}
          <div className="dashboard-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{activeT.categoryDist}</h3>
              <p className="text-xs dashboard-text-muted mt-0.5">{activeT.categoryDistDesc}</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-8 flex-1">
              
              {/* Donut Chart SVG */}
              <div className="relative flex items-center justify-center w-48 h-48 shrink-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-100 dark:text-gray-800/40"
                  />
                  {donutSegments.map((segment, idx) => (
                    Number(segment.count) > 0 && (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={segment.color}
                        strokeWidth="8"
                        strokeDasharray={segment.dashArray}
                        transform={`rotate(${segment.rotateAngle} 50 50)`}
                        className="transition-[stroke-width] duration-300 hover:stroke-[10px] cursor-pointer"
                        style={{ strokeDashoffset: 0 }}
                      />
                    )
                  ))}
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                    {totalProducts}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold dashboard-text-muted mt-0.5">
                    {activeT.products}
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-y-2 gap-x-6 flex-1 w-full sm:w-auto">
                {donutSegments.map((segment, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
                    <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">{segment.category}</span>
                    <span className="ml-auto text-gray-500 dark:text-gray-400 tabular-nums">
                      {segment.count} ({segment.percent}%)
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Card: Margin Health */}
          <div className="dashboard-card border rounded-2xl p-6 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{activeT.marginHealth}</h3>
              <p className="text-xs dashboard-text-muted mt-0.5">{activeT.marginHealthDesc}</p>
              
              {/* Legend of rules */}
              <div className="flex gap-4 mt-2 text-[10px] font-bold">
                <div className="flex items-center gap-1 text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  &gt;= 15% {activeT.healthy}
                </div>
                <div className="flex items-center gap-1 text-[#F472B6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6]"></span>
                  10%-15% {activeT.target}
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  &lt; 10% {activeT.low}
                </div>
              </div>
            </div>

            {/* Horizontal Bar list */}
            <div className="mt-5 space-y-3.5">
              {marginHealthData.map((data, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">{data.category}</span>
                    <span className={`${data.textClass} font-bold tabular-nums`}>{data.avgMargin}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${data.bgClass}`}
                      style={{ width: `${Math.min(Math.max(data.avgMargin, 0), 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 3. Top Rankings and Recent Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card: Top Configurators */}
          <div className="dashboard-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{activeT.topConfigurators}</h3>
              <p className="text-xs dashboard-text-muted mt-0.5">{activeT.topConfiguratorsDesc}</p>
            </div>
            
            <div className="mt-4 divide-y divide-gray-150 dark:divide-dark-border/40 flex-1 flex flex-col justify-center">
              {displayTopConfigurators.length > 0 ? (
                displayTopConfigurators.map((c, idx) => (
                  <div key={c.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-soft text-[#F472B6] text-xs font-bold shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-xs">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400 tabular-nums">
                        RM {c.margin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'active'
                          ? 'bg-green-150 text-green-800 dark:bg-green-950/30 dark:text-green-450'
                          : 'bg-gray-150 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {c.status === 'active' ? activeT.publish : activeT.unpublish}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm dashboard-text-muted">
                  {activeT.noConfigurators}
                </div>
              )}
            </div>
          </div>

          {/* Card: Recent Activities */}
          <div className="dashboard-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{activeT.recentActivities}</h3>
              <p className="text-xs dashboard-text-muted mt-0.5">{activeT.recentActivitiesDesc}</p>
            </div>
            
            <div className="mt-5 flex-1 flex flex-col justify-center">
              <div className="flow-root">
                <ul role="list" className="-mb-8">
                  {displayActivities.length > 0 ? (
                    displayActivities.map((activity, activityIdx) => (
                      <li key={activityIdx}>
                        <div className="relative pb-6">
                          {activityIdx !== displayActivities.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-dark-border/40" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-[#171A21] ${
                                activity.type === 'product'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : 'bg-emerald-500/10 text-emerald-500'
                              }`}>
                                {activity.type === 'product' ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
                                )}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-150 leading-tight">{activity.title}</p>
                              </div>
                              <div className="text-right text-xs whitespace-nowrap dashboard-text-muted">
                                <time dateTime={activity.time.toISOString()}>
                                  {new Date(activity.time).toLocaleDateString()} {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="py-8 text-center text-sm dashboard-text-muted">
                      {activeT.noActivities}
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>

        </div>


      </div>
    </div>
  );
}

