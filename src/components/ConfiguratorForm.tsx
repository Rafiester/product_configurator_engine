'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUI } from '@/components/ToastProvider';

interface ConfiguratorFormProps {
  initialData?: {
    name: string;
    status: string;
  };
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  submitButtonText: string;
  successMessage: string;
}

export default function ConfiguratorForm({
  initialData,
  action,
  submitButtonText,
  successMessage,
}: ConfiguratorFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { showToast } = useUI();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await action(formData);
      if (res.success) {
        showToast('success', 'Success', successMessage);
        router.push('/configurators');
        router.refresh();
      } else {
        showToast('error', 'Error', res.error || 'Failed to save configurator.');
        setIsPending(false);
      }
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'An error occurred.');
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-dark-border">
        Configurator Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Configurator Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            defaultValue={initialData?.name || ''}
            placeholder="e.g. Budget Gaming PC" 
            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm" 
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select 
            id="status" 
            name="status" 
            defaultValue={initialData?.status || 'active'}
            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-end gap-6 border-t border-gray-200 dark:border-dark-border pt-6">
        <Link href="/configurators" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          Cancel
        </Link>
        <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-primary-DEFAULT hover:bg-primary-hover active:bg-primary-active text-black dark:text-white font-semibold py-2.5 px-8 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : submitButtonText}
          </button>
        </div>
      </div>
    </form>
  );
}
