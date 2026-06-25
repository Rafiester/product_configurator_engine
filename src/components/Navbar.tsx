'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useUI } from './ToastProvider';

export default function Navbar({ lang }: { lang: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { showToast } = useUI();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Click-outside handler for profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const isActive = (path: string) => pathname?.startsWith(path);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'id' : 'en';
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000`;
    window.location.reload();
  };

  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = 'auth=; path=/; max-age=0';
    setIsProfileOpen(false);
    showToast('success', t.logoutSuccess, t.logoutSuccessDesc);
    // Redirect to login page
    setTimeout(() => {
      window.location.href = '/login';
    }, 300);
  };

  const t = {
    en: {
      dashboard: 'Dashboard',
      masterData: 'Master Product',
      masterCategory: 'Master Category',
      configurator: 'Builder',
      adminUser: ' Empiw Tanti <3',
      logout: 'Logout',
      logoutSuccess: 'Logged Out',
      logoutSuccessDesc: 'You have been logged out successfully.'
    },
    id: {
      dashboard: 'Dasbor',
      masterData: 'Produk Master',
      masterCategory: 'Kategori Master',
      configurator: 'Builder',
      adminUser: ' Empiw Tanti <3',
      logout: 'Keluar',
      logoutSuccess: 'Berhasil Keluar',
      logoutSuccessDesc: 'Anda telah berhasil keluar.'
    }
  }[lang as 'en' | 'id'] || {
    dashboard: 'Dashboard',
    masterData: 'Master Product',
    masterCategory: 'Master Category',
    configurator: 'Builder',
    adminUser: ' Empiw Tanti <3',
    logout: 'Logout',
    logoutSuccess: 'Logged Out',
    logoutSuccessDesc: 'You have been logged out successfully.'
  };

  // Hide navbar on login page
  if (pathname === '/login') return null;

  return (
    <nav className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex w-full sm:w-auto">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-pink-600 hover:text-pink-500 transition-colors flex items-center">
                <svg className="w-8 h-8 mr-3 text-pink-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Dynamic Data</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'border-pink-300 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {t.dashboard}
              </Link>
              <Link
                href="/categories"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/categories')
                    ? 'border-pink-300 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {t.masterCategory}
              </Link>
              <Link
                href="/products"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/products')
                    ? 'border-pink-300 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {t.masterData}
              </Link>
              <Link
                href="/builders"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/builders')
                    ? 'border-pink-300 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {t.configurator}
              </Link>
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-bold border border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface2 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2"
              aria-label="Toggle Language"
            >
              <span>🌐</span>
              <span>{lang === 'en' ? 'EN' : 'ID'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2"
              aria-label="Toggle Dark Mode"
            >
              {mounted && theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            {/* Profile Dropdown - Click-based */}
            <div ref={profileRef} className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface2"
              >
                <div className="w-7 h-7 rounded-full bg-primary-DEFAULT/20 text-primary-DEFAULT flex items-center justify-center mr-2 text-xs font-bold">E</div>
                <div>{t.adminUser}</div>
                <svg className={`ml-1.5 h-4 w-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border py-1 z-50" style={{ animation: 'fadeInDown 0.15s ease-out' }}>
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-dark-border">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.adminUser}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">admin@dynamicdata.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{t.logout}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface2 focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapse Menu */}
      {isOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'border-pink-300 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2'
              }`}
            >
              {t.dashboard}
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsOpen(false)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                isActive('/categories')
                  ? 'border-pink-300 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2'
              }`}
            >
              {t.masterCategory}
            </Link>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                isActive('/products')
                  ? 'border-pink-300 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2'
              }`}
            >
              {t.masterData}
            </Link>
            <Link
              href="/builders"
              onClick={() => setIsOpen(false)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                isActive('/builders')
                  ? 'border-pink-300 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2'
              }`}
            >
              {t.configurator}
            </Link>
          </div>
          
          <div className="pt-4 pb-4 border-t border-gray-200 dark:border-dark-border px-4 flex items-center justify-between">
            <div className="flex flex-col items-start gap-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{t.adminUser}</div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline flex items-center gap-1 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t.logout}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="px-2.5 py-1 text-xs font-bold border border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface2 transition-colors flex items-center gap-1.5 focus:outline-none"
                aria-label="Toggle Language"
              >
                <span>🌐</span>
                <span>{lang === 'en' ? 'EN' : 'ID'}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  setIsOpen(false);
                }}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface2 transition-colors focus:outline-none"
                aria-label="Toggle Dark Mode"
              >
                {mounted && theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
