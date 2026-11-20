import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('feedora-theme');
      if (stored) return stored === 'dark';
    } catch {}
    return false; // Default to clean, editorial warm white theme
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try { localStorage.setItem('feedora-theme', isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);

  return [isDark, setIsDark];
}
