import Link from 'next/link';
import { createConfigurator } from '../actions';

export default function CreateConfiguratorPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
              <svg className="w-6 h-6 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 leading-tight m-0">
              Add Configurator
            </h2>
          </div>
          <Link href="/configurators" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            &larr; Back to Configurators
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-dark-surface shadow-sm rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
          <form action={createConfigurator} className="p-8">
            
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
                  className="bg-primary-DEFAULT hover:bg-primary-hover active:bg-primary-active text-black dark:text-white font-semibold py-2.5 px-8 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2"
                >
                  Create Configurator
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
