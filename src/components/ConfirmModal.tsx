'use client';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'danger';
}

interface ConfirmModalProps {
  isOpen: boolean;
  options: ConfirmOptions;
  onClose: (confirmed: boolean) => void;
}

export default function ConfirmModal({ isOpen, options, onClose }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={() => onClose(false)}
        className="fixed inset-0 bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Panel */}
        <div className="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-surface shadow-xl rounded-2xl border border-gray-200 dark:border-white/10 z-10 sm:my-8 sm:align-middle">
          
          <div className="sm:flex sm:items-start">
            {/* Warning / Danger Icon */}
            {options.type === 'danger' ? (
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            ) : (
              // Info / Check Icon
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-gray-100">
                {options.title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {options.message}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              onClick={() => onClose(true)} 
              className={`w-full inline-flex justify-center rounded-xl border border-transparent px-6 py-2.5 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors ${
                options.type === 'danger' 
                  ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                  : 'bg-primary-DEFAULT hover:bg-primary-DEFAULT dark:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT focus:ring-primary-DEFAULT text-black dark:text-white'
              }`}
            >
              {options.confirmText || 'Confirm'}
            </button>
            <button 
              type="button" 
              onClick={() => onClose(false)} 
              className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-2.5 bg-white dark:bg-dark-surface2 text-base font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              {options.cancelText || 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
