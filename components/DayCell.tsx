import React from 'react';
import { motion } from 'framer-motion';
import { BookText } from 'lucide-react';

interface DayCellProps {
  day: number;
  isChecked: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isFailed: boolean;
  hasJournalEntry: boolean;
  onCheckClick: (day: number) => void;
  onJournalClick: (day: number) => void;
}

const DayCell: React.FC<DayCellProps> = ({ day, isChecked, isToday, isDisabled, isFailed, hasJournalEntry, onCheckClick, onJournalClick }) => {
  const baseClasses = 'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full font-medium text-lg transition-colors duration-200 ease-in-out relative transform group';

  const stateClasses = isFailed
    ? 'bg-[var(--color-danger-background)] border border-[var(--color-danger-border)] text-[var(--color-danger-text)] font-bold cursor-not-allowed'
    : isDisabled
    ? 'text-[var(--color-text-secondary)] opacity-60 cursor-not-allowed'
    : isChecked
    ? 'text-[var(--color-checked-text)] font-bold shadow-lg'
    : 'text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]';

  const todayRing = isToday && !isFailed
    ? 'ring-2 ring-offset-2 ring-[var(--color-accent)] ring-offset-[var(--color-background)]'
    : '';

  const todayGlow = isToday && !isFailed ? { boxShadow: `0 0 12px 0px var(--color-accent)` } : {};
  const checkedStyle = isChecked ? { background: 'var(--color-checked-background)' } : {};

  const handleClick = () => {
    if (isDisabled) return;
    if (isChecked) {
      onJournalClick(day);
    } else {
      onCheckClick(day);
    }
  };
  
  return (
    <motion.button
      onClick={handleClick}
      disabled={isDisabled}
      className={`${baseClasses} ${stateClasses} ${todayRing}`}
      style={{ ...todayGlow, ...checkedStyle }}
      aria-label={`Day ${day}`}
      whileHover={!isDisabled ? { scale: 1.1, y: -4, backgroundColor: isChecked ? undefined : 'var(--color-background-hover)' } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span>{isFailed ? '✕' : day}</span>
      {hasJournalEntry && !isFailed && (
        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white opacity-75 group-hover:opacity-100"></span>
      )}
      {isChecked && !isFailed && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <BookText size={20} className="text-white opacity-70" />
        </div>
      )}
    </motion.button>
  );
};

export default DayCell;