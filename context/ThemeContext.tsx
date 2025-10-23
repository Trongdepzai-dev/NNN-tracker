import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { themes } from '../themes';
import type { Theme, CustomAccentColors } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: string | undefined;
  setAccentColor: (color: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function lightenHexColor(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const lighten = (color: number) => Math.min(255, Math.round(color + (255 - color) * (percent / 100)));

    const r = lighten(rgb.r).toString(16).padStart(2, '0');
    const g = lighten(rgb.g).toString(16).padStart(2, '0');
    const b = lighten(rgb.b).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('nnn-theme', 'dark');
  const [customAccentColors, setCustomAccentColors] = useLocalStorage<CustomAccentColors>('nnn-custom-accent-colors-2024', {});

  const setAccentColor = (color: string | null) => {
    setCustomAccentColors(prev => {
      const newColors = { ...prev };
      if (color) {
        newColors[theme] = color;
      } else {
        delete newColors[theme];
      }
      return newColors;
    });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const themeColors = themes[theme];

    // Apply base theme colors first
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Override with custom accent color if it exists for the current theme
    const customAccent = customAccentColors[theme];
    if (customAccent) {
      root.style.setProperty('--color-accent', customAccent);
      
      const lighterAccent = lightenHexColor(customAccent, 20);
      root.style.setProperty('--color-accent-gradient', `linear-gradient(90deg, ${lighterAccent}, ${customAccent})`);
      
      const rgb = hexToRgb(customAccent);
      if (rgb) {
        root.style.setProperty('--color-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`);
      }
    }
  }, [theme, customAccentColors]);

  const value = { 
    theme, 
    setTheme,
    accentColor: customAccentColors[theme],
    setAccentColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
