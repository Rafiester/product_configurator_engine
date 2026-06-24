'use client';

import { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
}

export default function Toast({ type, title, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-white dark:bg-dark-surface',
      border: 'border-l-4 border-l-primary-DEFAULT border-gray-200 dark:border-dark-border',
      text: 'text-primary-active dark:text-primary-dark',
      icon: (
        <svg className="w-5 h-5 text-primary-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    error: {
      bg: 'bg-white dark:bg-dark-surface',
      border: 'border-l-4 border-l-red-500 border-gray-200 dark:border-dark-border',
      text: 'text-red-500',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    info: {
      bg: 'bg-white dark:bg-dark-surface',
      border: 'border-l-4 border-l-blue-500 border-gray-200 dark:border-dark-border',
      text: 'text-blue-500',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.info;

  return (
    <div className={`pointer-events-auto flex w-full max-w-sm rounded-xl bg-white dark:bg-dark-surface border ${currentStyle.border} shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 animate-slide-in overflow-hidden`}>
      <div className="p-4 flex-1">
        <div className="flex items-start">
          <div className="shrink-0">{currentStyle.icon}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{message}</p>
          </div>
          <div className="ml-4 shrink-0 flex">
            <button
              onClick={onClose}
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
