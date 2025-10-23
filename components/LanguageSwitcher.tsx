import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'vi', label: 'VI' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--color-background-secondary)] border border-[var(--color-border)]">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`px-3 py-1 rounded-md text-sm font-bold transition-colors whitespace-nowrap ${
            i18n.language === code || (i18n.language.startsWith(code))
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

export default LanguageSwitcher;
