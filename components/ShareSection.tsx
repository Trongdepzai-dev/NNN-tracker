import React from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, Twitter, MessageCircle } from 'lucide-react'; // Using MessageCircle for Telegram

interface ShareSectionProps {
  streak: number;
}

const ShareSection: React.FC<ShareSectionProps> = ({ streak }) => {
  const { t } = useTranslation();

  const shareTextTwitter = encodeURIComponent(t('sharing.tweet', { streak }));
  const shareTextTelegram = encodeURIComponent(t('sharing.telegram', { streak }));
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareTextTwitter}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${shareTextTelegram}`;
  
  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <div className="w-full mt-8 p-4 rounded-lg bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-center">
      <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-4">{t('sharing.title')}</h3>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => openShareWindow(twitterUrl)}
          aria-label="Share on Twitter"
          className="p-3 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-accent)] hover:bg-[var(--color-background-hover)] transition-colors"
        >
          <Twitter className="w-6 h-6" />
        </button>
        <button
          onClick={() => openShareWindow(facebookUrl)}
          aria-label="Share on Facebook"
          className="p-3 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-accent)] hover:bg-[var(--color-background-hover)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M9.197 21.5H13.197V13.498H16.161L16.67 9.506H13.197V7.511C13.197 6.425 13.217 5.5 15.172 5.5H16.813V2.167C15.853 2.089 14.892 2 13.927 2C11.899 2 10.428 3.195 10.428 5.783V9.506H7.197V13.498H10.428V21.5Z"></path></svg>
        </button>
        <button
          onClick={() => openShareWindow(telegramUrl)}
          aria-label="Share on Telegram"
          className="p-3 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-accent)] hover:bg-[var(--color-background-hover)] transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ShareSection;
