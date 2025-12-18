/**
 * Shared style utilities using theme colors
 */

export const themeStyles = {
  // Text colors
  text: { color: 'var(--color-text)' },
  textMuted: { color: 'var(--color-text)', opacity: 0.7 },
  
  // Background colors
  background: { backgroundColor: 'var(--color-background)' },
  accent: { backgroundColor: 'var(--color-accent)' },
  
  // Border colors
  border: { borderColor: 'var(--color-frame)' },
  
  // Frame/primary color
  frame: { color: 'var(--color-frame)' },
  frameBg: { backgroundColor: 'var(--color-frame)' },
  
  // Input styles
  input: {
    backgroundColor: 'var(--color-background)',
    borderColor: 'var(--color-frame)',
    color: 'var(--color-text)',
  },
  
  inputFocus: {
    borderColor: 'var(--color-frame)',
    '--tw-ring-color': 'var(--color-frame)',
  } as React.CSSProperties,
  
  // Button styles
  buttonPrimary: {
    backgroundColor: 'var(--color-frame)',
    color: 'var(--color-background)',
  },
  
  buttonHover: {
    opacity: 0.9,
  },
};

