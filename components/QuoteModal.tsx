import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface QuoteModalProps {
  quote: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  exit: { opacity: 0, scale: 0.9, y: 50 },
};

const QuoteModal: React.FC<QuoteModalProps> = ({ quote, isOpen, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[var(--color-overlay)] flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl shadow-lg p-8 max-w-md w-full text-center"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-8xl text-[var(--color-border)] opacity-50 z-0">
              “
            </div>
            <div className="relative z-10">
              <p className="text-sm text-[var(--color-text-secondary)] mb-2 font-semibold tracking-widest uppercase">{t('quoteModal.title')}</p>
              <p className="text-xl italic text-[var(--color-text-primary)]">"{quote}"</p>
              <button
                onClick={onClose}
                className="mt-8 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                {t('quoteModal.close')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;