import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_KEY = 'fitai-theme-preference';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const ThemeContext = createContext(null);

function getStoredTheme() {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system'
    ? stored
    : 'system';
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const media = window.matchMedia(MEDIA_QUERY);
    const updateSystemTheme = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    setSystemTheme(media.matches ? 'dark' : 'light');

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateSystemTheme);
      return () => media.removeEventListener('change', updateSystemTheme);
    }

    media.addListener(updateSystemTheme);
    return () => media.removeListener(updateSystemTheme);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const resolvedTheme = theme === 'system' ? systemTheme : theme;
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.style.colorScheme = resolvedTheme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme, systemTheme]);

  const value = useMemo(
    () => ({
      theme,
      systemTheme,
      resolvedTheme: theme === 'system' ? systemTheme : theme,
      setTheme,
    }),
    [theme, systemTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreference() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemePreference must be used within a ThemeProvider');
  }
  return context;
}
