import React from 'react';
import { motion } from 'framer-motion';
import DayCell from './DayCell';
import type { CheckedDays, JournalEntries } from '../types';

interface CalendarGridProps {
  checkedDays: CheckedDays;
  journalEntries: JournalEntries;
  todayInNovember: number;
  onDayClick: (day: number) => void;
  onJournalClick: (day: number) => void;
  isDisabled?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const cellVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100 } 
  },
};

const CalendarGrid: React.FC<CalendarGridProps> = ({ checkedDays, journalEntries, todayInNovember, onDayClick, onJournalClick, isDisabled = false }) => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <motion.div 
      className={`grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-3 sm:gap-4 justify-items-center transition-opacity duration-300 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {days.map((day) => {
        const isChecked = checkedDays[day] || false;
        const hasJournalEntry = !!journalEntries[day];
        const isToday = day === todayInNovember;
        const isFuture = day > todayInNovember;
        const isFailed = day < todayInNovember && !isChecked;

        return (
          <motion.div
            key={day}
            variants={cellVariants}
          >
            <DayCell
              day={day}
              isChecked={isChecked}
              isToday={isToday}
              isDisabled={isFuture || isFailed || isDisabled}
              isFailed={isFailed}
              hasJournalEntry={hasJournalEntry}
              onCheckClick={onDayClick}
              onJournalClick={onJournalClick}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CalendarGrid;