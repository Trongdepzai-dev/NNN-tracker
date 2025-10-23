import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface JournalModalProps {
  day: number | null;
  initialText: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
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

const JournalModal: React.FC<JournalModalProps> = ({ day, initialText, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
    }
  }, [isOpen, initialText]);
  
  const handleSave = () => {
    onSave(text);
    toast.success(t('journalModal.savedToast', { day }));
    onClose();
  };

  if (!day) return null;

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
            className="relative bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl shadow-lg p-6 max-w-md w-full"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-center mb-4 text-[var(--color-text-primary)]">
              {t('journalModal.title', { day })}
            </h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('journalModal.placeholder')}
              className="w-full h-40 p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition-shadow"
              maxLength={500}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] font-bold py-2 px-4 rounded-lg transition-colors hover:bg-[var(--color-background-hover)]"
              >
                {t('journalModal.close')}
              </button>
              <button
                onClick={handleSave}
                className="submit-button-glow text-[var(--color-background)] font-bold py-2 px-6 rounded-lg"
              >
                {t('journalModal.save')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JournalModal;
