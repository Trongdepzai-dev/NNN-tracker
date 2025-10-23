import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GuideButtonProps {
  onClick: () => void;
}

const GuideButton: React.FC<GuideButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-full -translate-y-1/2 ml-2 p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)] focus:ring-[var(--color-accent)]"
      aria-label={t('guide.buttonLabel')}
    >
      <HelpCircle className="w-6 h-6" strokeWidth={2}/>
    </button>
  );
};

export default GuideButton;