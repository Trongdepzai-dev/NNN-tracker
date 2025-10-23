import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Twitter, MessageCircle, Link2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../api/client';

interface ShareSectionProps {
  streak: number;
  userName: string;
  userId?: number;
  daysSucceeded: number;
}

const ShareSection: React.FC<ShareSectionProps> = ({ streak, userName, userId, daysSucceeded }) => {
  const { t } = useTranslation();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const generateShareLink = async () => {
    if (!userId) {
      toast.error(t('sharing.error', 'Không thể tạo link chia sẻ'));
      return;
    }

    try {
      const response = await api.createShare(userId, userName, streak, daysSucceeded);
      setShareUrl(response.shareUrl);
      toast.success(t('sharing.success', 'Đã tạo link chia sẻ thành công!'));
    } catch (error) {
      console.error('Failed to create share:', error);
      toast.error(t('sharing.error', 'Không thể tạo link chia sẻ'));
    }
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success(t('sharing.copied', 'Đã copy link!'));
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const shareTextTwitter = encodeURIComponent(t('sharing.tweet', { streak }));
  const shareTextTelegram = encodeURIComponent(t('sharing.telegram', { streak }));
  
  const shareUrlEncoded = shareUrl ? encodeURIComponent(shareUrl) : encodeURIComponent(window.location.href);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareTextTwitter}${shareUrl ? `&url=${shareUrlEncoded}` : ''}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`;
  const telegramUrl = `https://t.me/share/url?url=${shareUrlEncoded}&text=${shareTextTelegram}`;
  
  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <div className="w-full mt-8 p-4 rounded-lg bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-center">
      <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-4">{t('sharing.title')}</h3>
      
      {!shareUrl && (
        <button
          onClick={generateShareLink}
          className="mb-4 px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
        >
          <Link2 className="w-4 h-4" />
          {t('sharing.generate', 'Tạo link chia sẻ')}
        </button>
      )}

      {shareUrl && (
        <div className="mb-4 p-3 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] flex items-center gap-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-transparent text-[var(--color-text-primary)] text-sm outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-[var(--color-background-hover)] rounded transition-colors"
            aria-label="Copy link"
          >
            {isCopied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Link2 className="w-5 h-5 text-[var(--color-accent)]" />
            )}
          </button>
        </div>
      )}

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
