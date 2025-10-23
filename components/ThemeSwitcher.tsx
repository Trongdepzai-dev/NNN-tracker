import React from 'react';
import { useTheme } from '../context/ThemeContext';
import type { Theme } from '../types';

const THEME_OPTIONS: { name: Theme; label: string }[] = [
  { name: 'dark', label: 'Dark' },
  { name: 'light', label: 'Light' },
  { name: 'sepia', label: 'Sepia' },
  { name: 'cyberpunk', label: 'Cyber' },
  { name: 'forest', label: 'Forest' },
  { name: 'ocean', label: 'Ocean' },
  { name: 'vampire', label: 'Vamp' },
  { name: 'synthwave', label: 'Synth' },
  { name: 'solarizedDark', label: 'Solar Dark' },
  { name: 'solarizedLight', label: 'Solar Light' },
  { name: 'nord', label: 'Nord' },
  { name: 'dracula', label: 'Dracula' },
  { name: 'gruvbox', label: 'Gruvbox' },
  { name: 'monokai', label: 'Monokai' },
  { name: 'matcha', label: 'Matcha' },
  { name: 'rosePine', label: 'Rosé' },
  { name: 'sunset', label: 'Sunset' },
];

const SECRET_THEMES: { name: Theme; label: string }[] = [
  { name: 'matrix', label: 'Matrix' },
];

interface ThemeSwitcherProps {
  unlockedSecretThemes: string[];
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ unlockedSecretThemes }) => {
  const { theme, setTheme } = useTheme();

  const availableSecretThemes = SECRET_THEMES.filter(t => unlockedSecretThemes.includes(t.name));
  const allThemes = [...THEME_OPTIONS, ...availableSecretThemes];

  return (
    <div className="flex items-center gap-2 p-1 rounded-lg bg-[var(--color-background-secondary)] border border-[var(--color-border)] max-w-full overflow-x-auto">
      {allThemes.map(({ name, label }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            theme === name
              ? 'bg-[var(--color-accent)] text-[var(--color-background)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
