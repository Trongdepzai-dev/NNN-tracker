import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  value: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  const { t } = useTranslation();
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full my-6 px-2">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-[var(--color-text-secondary)]">{t('progress.label')}</span>
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">{t('progress.days', { value, max })}</span>
      </div>
      <div className="w-full bg-[var(--color-background-secondary)] rounded-full h-5 border border-[var(--color-border)] overflow-hidden">
        <div
          className="h-5 rounded-full transition-all duration-500 ease-out relative"
          style={{ 
              width: `${percentage}%`,
              background: 'var(--color-accent-gradient)',
           }}
        >
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)',
              backgroundSize: '1rem 1rem',
              animation: 'progress-bar-stripes 1s linear infinite'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;