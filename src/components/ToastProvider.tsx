'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'danger';
}

interface UIContextType {
  showToast: (type: ToastType, title: string, message: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirmClose = (confirmed: boolean) => {
    if (confirmState) {
      confirmState.resolve(confirmed);
      setConfirmState(null);
    }
  };

  return (
    <UIContext.Provider value={{ showToast, confirm }}>
      {children}
      {/* Render Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            type={t.type}
            title={t.title}
            message={t.message}
            onClose={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
          />
        ))}
      </div>
      {/* Render Confirm Modal */}
      {confirmState && (
        <ConfirmModal
          isOpen={confirmState.isOpen}
          options={confirmState.options}
          onClose={handleConfirmClose}
        />
      )}
    </UIContext.Provider>
  );
}
