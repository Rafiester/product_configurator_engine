'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/components/ToastProvider';

export default function ImportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showToast } = useUI();

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      showToast('error', 'Validation Error', 'Please select a valid .xlsx file.');
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        showToast('success', 'Import Successful', result.message);
        setIsOpen(false);
        router.refresh();
      } else {
        showToast('error', 'Import Failed', result.message || 'Import failed.');
      }
    } catch (err) {
      showToast('error', 'Import Error', 'An error occurred during import.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
        <button 
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white shadow-sm text-sm transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          Import Excel
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => !isImporting && setIsOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-dark-surface rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleImport}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-dark-border">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-gray-100" id="modal-title">
                        Import Products from Excel
                      </h3>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Upload an Excel (.xlsx) file containing Master Data. The system will automatically ignore rows that match exactly with existing Category + Product Name combinations to prevent duplicates.
                        </p>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          accept=".xlsx,.xls" 
                          required 
                          disabled={isImporting}
                          className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-soft file:text-primary-DEFAULT hover:file:bg-primary-DEFAULT hover:file:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="submit" 
                    disabled={isImporting}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-DEFAULT text-base font-semibold text-black dark:text-white hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-DEFAULT sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isImporting ? 'Importing...' : 'Upload & Import'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    disabled={isImporting}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-DEFAULT sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
