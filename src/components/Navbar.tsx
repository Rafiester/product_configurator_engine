'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <nav className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex w-full sm:w-auto">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-DEFAULT" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Dynamic <span className="text-primary-DEFAULT">Data</span></span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'border-primary-DEFAULT text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/products"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/products')
                    ? 'border-primary-DEFAULT text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                Master Data
              </Link>
              <Link
                href="/configurators"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/configurators')
                    ? 'border-primary-DEFAULT text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                Configurator
              </Link>
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 gap-4">
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

            {/* Profile Dropdown Mock */}
            <div className="relative">
              <button className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <div>Admin User</div>
                <svg className="ml-1 -mr-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
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
                  ? 'border-primary-DEFAULT bg-primary-soft text-primary-active dark:bg-primary-darkSoft dark:text-primary-DEFAULT'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                isActive('/products')
                  ? 'border-primary-DEFAULT bg-primary-soft text-primary-active dark:bg-primary-darkSoft dark:text-primary-DEFAULT'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2'
              }`}
            >
              Master Data
            </Link>
            <Link
              href="/configurators"
              onClick={() => setIsOpen(false)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                isActive('/configurators')
                  ? 'border-primary-DEFAULT bg-primary-soft text-primary-active dark:bg-primary-darkSoft dark:text-primary-DEFAULT'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface2'
              }`}
            >
              Configurator
            </Link>
          </div>
          
          <div className="pt-4 pb-4 border-t border-gray-200 dark:border-dark-border px-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</div>
            </div>
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
      )}
    </nav>
  );
}
