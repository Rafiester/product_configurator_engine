'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/components/ToastProvider';

export default function ImportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showToast } = useUI();

  // Handle modal entry/exit animation triggers
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

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
      <div className="p-1.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block w-full sm:w-auto text-center sm:text-left">
        <button 
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-hover active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white shadow-sm text-sm transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Excel
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop with transition */}
          <div
            onClick={() => !isImporting && setIsOpen(false)}
            className={`fixed inset-0 bg-black/50 dark:bg-black/75 transition-opacity duration-350 ${
              showContent ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Modal Container with scale/opacity transition */}
          <div
            className={`relative w-full max-w-lg bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-gray-250 dark:border-dark-border overflow-hidden transition-all duration-300 transform ${
              showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-soft dark:bg-primary-darkSoft rounded-lg">
                  <svg className="w-5 h-5 text-primary-DEFAULT dark:text-primary-dark" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-905 dark:text-gray-100 leading-none">
                    Import Products from Excel
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Ingest PC components database spreadsheet.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isImporting}
                onClick={() => setIsOpen(false)}
                className="text-gray-450 hover:text-gray-650 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleImport}>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload an Excel (.xlsx) file containing Master Product details. The system will automatically ignore rows that match exactly with existing Category + Product Name combinations to prevent duplicates.
                </p>
                
                <div className="mt-4">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".xlsx,.xls" 
                    required 
                    disabled={isImporting}
                    className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-soft file:text-primary-DEFAULT hover:file:bg-primary-DEFAULT hover:file:text-white transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-gray-50 dark:bg-dark-surface2 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-200 dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isImporting}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <div className="p-0.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
                  <button
                    type="submit"
                    disabled={isImporting}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-hover active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white shadow-sm text-sm transition-colors disabled:opacity-50"
                  >
                    {isImporting ? 'Importing...' : 'Upload & Import'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
