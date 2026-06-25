'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/components/ToastProvider';
import { createBuilder } from '@/app/builders/actions';

const translations = {
  en: {
    title: 'Create New Builder',
    subtitle: 'Build a new system specification package.',
    builderName: 'Builder Name',
    builderNamePlaceholder: 'e.g. Budget Gaming PC',
    status: 'Status',
    statusPublish: 'Publish',
    statusUnpublish: 'Unpublish',
    cancel: 'Cancel',
    submit: 'Create Builder',
    triggerButton: 'Add Builder',
    saving: 'Creating...',
    successTitle: 'Builder Created',
    successMsg: 'Builder "{name}" has been created successfully.',
    errorTitle: 'Error',
    errorMsg: 'Failed to create builder.',
  },
  id: {
    title: 'Buat Builder Baru',
    subtitle: 'Buat paket spesifikasi sistem baru.',
    builderName: 'Nama Builder',
    builderNamePlaceholder: 'contoh: Gaming PC Hemat',
    status: 'Status',
    statusPublish: 'Publikasikan',
    statusUnpublish: 'Batal Publikasi',
    cancel: 'Batal',
    submit: 'Buat Builder',
    triggerButton: 'Tambah Builder',
    saving: 'Membuat...',
    successTitle: 'Builder Dibuat',
    successMsg: 'Builder "{name}" telah berhasil dibuat.',
    errorTitle: 'Kesalahan',
    errorMsg: 'Gagal membuat builder.',
  }
};

interface CreateBuilderModalProps {
  lang: string;
}

export default function CreateBuilderModal({ lang }: CreateBuilderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();
  const { showToast } = useUI();

  const t = translations[lang as 'en' | 'id'] || translations.en;

  // Handle modal entry/exit animation triggers
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const builderName = (formData.get('name') as string || '').trim();

    try {
      const res = await createBuilder(formData);
      if (res.success) {
        showToast(
          'success',
          t.successTitle,
          t.successMsg.replace('{name}', builderName)
        );
        setIsOpen(false);
        form.reset();
        router.refresh();
      } else {
        showToast('error', t.errorTitle, res.error || t.errorMsg);
      }
    } catch (err: any) {
      showToast('error', t.errorTitle, err.message || t.errorMsg);
    } finally {
      setIsPending(false);
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t.triggerButton}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop with transition */}
          <div
            onClick={() => !isPending && setIsOpen(false)}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-905 dark:text-gray-100 leading-none">
                    {t.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="text-gray-450 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                    {t.builderName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={t.builderNamePlaceholder}
                    className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                    {t.status} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    defaultValue="active"
                    className="shadow-sm bg-white border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full focus:border-primary-DEFAULT focus:ring-primary-DEFAULT sm:text-sm"
                  >
                    <option value="active">{t.statusPublish}</option>
                    <option value="inactive">{t.statusUnpublish}</option>
                  </select>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-gray-50 dark:bg-dark-surface2 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-200 dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-colors disabled:opacity-50"
                >
                  {t.cancel}
                </button>
                <div className="p-0.5 bg-primary-soft dark:bg-primary-darkSoft rounded-xl inline-block">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-hover dark:bg-primary-DEFAULT dark:hover:bg-primary-hover active:bg-primary-active border border-transparent rounded-lg font-semibold text-black dark:text-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-colors disabled:opacity-50"
                  >
                    {isPending ? t.saving : t.submit}
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
