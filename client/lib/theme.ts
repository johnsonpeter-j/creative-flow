/**
 * Theme configuration
 * Colors can be dynamically changed based on user preferences
 */

export interface ThemeColors {
  frame: string;        // C67C4E - dark color for Frame, Side Bar Icon
  accent: string;      // EDD6C8 - dark light color
  text: string;        // 313131 - Dark color for font
  background: string;  // EDEDED - Light Color for Background
}

export const defaultTheme: ThemeColors = {
  frame: '#C67C4E',
  accent: '#EDD6C8',
  text: '#313131',
  background: '#EDEDED',
};

/**
 * Apply theme colors to CSS variables
 */
export function applyTheme(theme: ThemeColors = defaultTheme) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  root.style.setProperty('--color-frame', theme.frame);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-background', theme.background);
}

/**
 * Get theme from localStorage or return default
 */
export function getStoredTheme(): ThemeColors {
  if (typeof window === 'undefined') return defaultTheme;
  
  try {
    const stored = localStorage.getItem('app-theme');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
  }
  
  return defaultTheme;
}

/**
 * Save theme to localStorage
 */
export function saveTheme(theme: ThemeColors) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('app-theme', JSON.stringify(theme));
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
}

