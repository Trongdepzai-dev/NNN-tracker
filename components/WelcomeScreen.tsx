import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  onNameSubmit: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNameSubmit }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
       <motion.div 
        className="w-full max-w-md mx-auto p-8 sm:p-10 rounded-2xl glass-pane"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div 
          className="flex justify-center mb-6"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
            <ShieldCheck style={{ color: 'var(--color-accent)' }} size={64} strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ background: 'var(--color-accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('welcomeScreen.title')}
        </h1>
        <p className="mt-4 mb-10 text-base text-[var(--color-text-secondary)]">{t('welcomeScreen.description')}</p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="input-group mb-8">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="floating-input"
              maxLength={20}
              required
              autoFocus
              placeholder={t('welcomeScreen.inputLabel')}
            />
            <label htmlFor="name" className="floating-label">{t('welcomeScreen.inputLabel')}</label>
          </div>
          <motion.button
            type="submit"
            className="w-full text-[var(--color-background)] font-bold py-3 px-6 rounded-lg submit-button-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
            disabled={!name.trim()}
            whileHover={{ scale: !name.trim() ? 1 : 1.05 }}
            whileTap={{ scale: !name.trim() ? 1 : 0.98 }}
          >
            {t('welcomeScreen.button')}
          </motion.button>
        </form>
      </motion.div>
       <p className="text-xs text-center text-[var(--color-text-secondary)] mt-8">
        {t('footer.madeBy')}
      </p>
    </div>
  );
};

export default WelcomeScreen;