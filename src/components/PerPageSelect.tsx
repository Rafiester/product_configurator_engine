'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function PerPageSelect({ currentPerPage }: { currentPerPage: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('perPage', e.target.value);
    params.set('page', '1'); // Reset to page 1 to prevent out-of-bounds error
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">Show</span>
      <select
        value={currentPerPage}
        onChange={handleChange}
        className="rounded-md border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface dark:text-gray-100 text-xs py-1 px-2.5 focus:border-primary-DEFAULT focus:ring-primary-DEFAULT"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <span className="text-sm text-gray-500 dark:text-gray-400">entries</span>
    </div>
  );
}
