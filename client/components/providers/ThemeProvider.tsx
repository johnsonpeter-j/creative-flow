'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeColors, defaultTheme, applyTheme, getStoredTheme, saveTheme } from '@/lib/theme';

interface ThemeContextType {
  theme: ThemeColors;
  setTheme: (theme: ThemeColors) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeColors>(defaultTheme);

  useEffect(() => {
    // Load theme from localStorage on mount
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const setTheme = (newTheme: ThemeColors) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

