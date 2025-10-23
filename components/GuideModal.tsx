import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CalendarDays, BookOpen, Trophy, Settings2, TimerOff } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300,
      staggerChildren: 0.1,
    }
  },
  exit: { opacity: 0, scale: 0.95, y: 50 },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: <CalendarDays className="w-8 h-8 text-[var(--color-accent)]" />,
      title: t('guide.sections.checkIn.title'),
      description: t('guide.sections.checkIn.description'),
    },
    {
      icon: <BookOpen className="w-8 h-8 text-[var(--color-accent)]" />,
      title: t('guide.sections.journal.title'),
      description: t('guide.sections.journal.description'),
    },
    {
      icon: <Trophy className="w-8 h-8 text-[var(--color-accent)]" />,
      title: t('guide.sections.achievements.title'),
      description: t('guide.sections.achievements.description'),
    },
    {
      icon: <Settings2 className="w-8 h-8 text-[var(--color-accent)]" />,
      title: t('guide.sections.settings.title'),
      description: t('guide.sections.settings.description'),
    },
    {
      icon: <TimerOff className="w-8 h-8 text-[var(--color-accent)]" />,
      title: t('guide.sections.cooldown.title'),
      description: t('guide.sections.cooldown.description'),
    },
  ];

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
            className="relative w-full max-w-lg p-8 rounded-2xl glass-pane"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-text-primary)]">
              {t('guide.title')}
            </h2>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <motion.div key={index} className="flex items-start gap-4" variants={itemVariants}>
                  <div className="text-3xl mt-1">{section.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">{section.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{section.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={onClose}
                className="submit-button-glow text-[var(--color-background)] font-bold py-2 px-8 rounded-lg"
              >
                {t('guide.closeButton')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuideModal;