import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../themes';

const AccentColorPicker: React.FC = () => {
  const { t } = useTranslation();
  const { theme, accentColor, setAccentColor } = useTheme();
  
  const defaultAccentColor = themes[theme]['--color-accent'];
  const currentColor = accentColor || defaultAccentColor;

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccentColor(e.target.value);
  };

  const handleReset = () => {
    setAccentColor(null);
  };

  return (
    <div className="w-full max-w-sm p-4 rounded-lg bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-center">
      <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-2">{t('accentPicker.title')}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">{t('accentPicker.description')}</p>
      <div className="flex justify-center items-center gap-4">
        <div className="relative w-12 h-12">
            <input
              type="color"
              value={currentColor}
              onChange={handleColorChange}
              className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
              aria-label="Accent color picker"
            />
            <div 
              className="w-full h-full rounded-full border-2 border-[var(--color-border)] transition-colors"
              style={{ backgroundColor: currentColor }}
            ></div>
        </div>
        <button
          onClick={handleReset}
          disabled={!accentColor}
          className="border border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold py-2 px-4 rounded-lg transition-colors hover:bg-[var(--color-background-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('accentPicker.reset')}
        </button>
      </div>
    </div>
  );
};

export default AccentColorPicker;