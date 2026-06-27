'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string }[];
  placeholder?: string;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = '-- Select Product --',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.id === value);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-dark-surface dark:text-gray-100 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT transition-all text-left"
      >
        <span className="truncate pr-2">
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-dark-surface border border-gray-250 dark:border-dark-border rounded-lg shadow-xl overflow-hidden animate-fadeInUp">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-150 dark:border-dark-border bg-gray-50 dark:bg-dark-surface2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="w-full px-2.5 py-1 text-xs border border-gray-300 dark:border-gray-700 dark:bg-gray-800 bg-white text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-primary-DEFAULT"
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 dark:divide-dark-border/50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors truncate block ${
                    opt.id === value
                      ? 'bg-primary-soft text-black font-semibold dark:bg-primary-darkSoft dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface2'
                  }`}
                >
                  {opt.name}
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-gray-400 dark:text-gray-500 text-center">
                No products found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
