import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Aesthetic pill-style dark/light mode toggle.
 * Uses the `dark` class on <html> via useDarkMode hook (passed as props).
 */
export function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1E1E24 0%, #252530 100%)'
          : 'linear-gradient(135deg, #F5F3EF 0%, #EAE8E4 100%)',
        border: isDark ? '1px solid #3A3A48' : '1px solid #D6D3D1',
        color: isDark ? '#A8A49E' : '#78716C',
        boxShadow: isDark
          ? 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.3)'
          : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Sliding indicator dot */}
      <span
        className="relative w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #E05638, #C8482A)'
            : 'linear-gradient(135deg, #FFFFFF, #F5F3EF)',
          boxShadow: isDark
            ? '0 0 8px rgba(224,86,56,0.5), 0 1px 3px rgba(0,0,0,0.3)'
            : '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        {isDark
          ? <Moon className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
          : <Sun className="w-2.5 h-2.5 text-amber-500" strokeWidth={2.5} />
        }
      </span>
      <span className="pr-0.5">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
