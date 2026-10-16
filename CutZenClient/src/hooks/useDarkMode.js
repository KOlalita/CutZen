import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cutzen_theme';

function getInitialDarkMode() {
  if (typeof window === 'undefined') return false;

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme) return storedTheme === 'dark';

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [isDarkMode]);

  return {
    isDarkMode,
    toggleDarkMode: () => setIsDarkMode((current) => !current),
  };
}
