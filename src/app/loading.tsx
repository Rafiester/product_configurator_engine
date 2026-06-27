'use client';

import { useState, useEffect } from 'react';

const PC_TIPS = [
  "⚡ Dual-channel RAM (2 sticks) performs significantly faster than a single stick.",
  "🔌 Never skimp on your PSU (Power Supply Unit) quality. A bad PSU can damage other components.",
  "📦 Check the maximum GPU length and CPU cooler height supported by your case before buying.",
  "🌡️ Don't forget to apply thermal paste (if not pre-applied) before mounting your CPU cooler.",
  "🚀 Installing your Operating System on an NVMe M.2 SSD makes boot times near-instant.",
  "💨 Good cable management isn't just about looks—it also improves airflow and cooling.",
  "🔄 Make sure your motherboard's BIOS supports your chosen CPU generation out of the box."
];

export default function Loading() {
  const [tipIndex, setTipIndex] = useState(0);
  const [dots, setDots] = useState('.');

  // Rotate tips automatically every 4 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % PC_TIPS.length);
    }, 4000);

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(tipInterval);
      clearInterval(dotInterval);
    };
  }, []);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % PC_TIPS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/60 dark:bg-[#0B0E14]/75 backdrop-blur-md transition-opacity duration-300">
      <div className="w-full max-w-sm p-6 text-center space-y-6 bg-white dark:bg-[#151922] border border-gray-200/80 dark:border-[#262D3D] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] mx-4 transform scale-100 transition-all duration-300 animate-fadeInUp">
        {/* Dynamic Spinning Element */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Outer track */}
            <div className="absolute inset-0 rounded-full border-4 border-pink-100 dark:border-pink-950/20" />
            {/* Inner neon spinner */}
            <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 border-r-pink-400 animate-spin" />
            {/* Center Pulsing Glow */}
            <div className="w-6 h-6 rounded-full bg-pink-500/20 dark:bg-pink-500/30 animate-ping absolute" />
            <div className="w-4 h-4 rounded-full bg-pink-500 relative" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Assembling Page{dots}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide uppercase">
            PC Builder System
          </p>
        </div>

        {/* Tips Box */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-surface2/60 border border-gray-150 dark:border-[#222735] text-left transition-all duration-300 min-h-[90px] flex flex-col justify-between">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300">
            {PC_TIPS[tipIndex]}
          </p>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={nextTip}
              className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors focus:outline-none flex items-center gap-1 cursor-pointer"
            >
              <span>Next Tip</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
