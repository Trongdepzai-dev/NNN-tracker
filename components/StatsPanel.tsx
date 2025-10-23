import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, XCircle } from 'lucide-react';

interface StatsPanelProps {
  longestStreak: number;
  successRate: number;
  daysFailed: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
  <motion.div 
    className="bg-[var(--color-background)] p-4 rounded-lg border border-[var(--color-border)] flex flex-col items-center justify-center text-center"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    >
    <div className="text-[var(--color-accent)] mb-2">{icon}</div>
    <div className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{label}</div>
    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</div>
  </motion.div>
);

const StatsPanel: React.FC<StatsPanelProps> = ({ longestStreak, successRate, daysFailed }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full mt-6">
      <h3 className="font-bold text-lg text-center mb-4 text-[var(--color-text-primary)]">{t('dashboard.statsTitle')}</h3>
       <motion.div 
        className="grid grid-cols-3 gap-4"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
        }}
        initial="hidden"
        animate="visible"
      >
        <StatCard 
          icon={<TrendingUp className="w-7 h-7" />}
          label={t('dashboard.longestStreak')}
          value={longestStreak}
        />
        <StatCard 
          icon={<CheckCircle className="w-7 h-7" />}
          label={t('dashboard.successRate')}
          value={`${successRate.toFixed(0)}%`}
        />
        <StatCard 
          icon={<XCircle className="w-7 h-7" />}
          label={t('dashboard.daysFailed')}
          value={daysFailed}
        />
      </motion.div>
    </div>
  );
};

export default StatsPanel;
