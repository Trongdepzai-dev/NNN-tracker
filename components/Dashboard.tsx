import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Flame } from 'lucide-react';
import ProgressChart from './ProgressChart';
import StatsPanel from './StatsPanel';
import ShareSection from './ShareSection';
import type { LeaderboardEntry, CheckedDays } from '../types';

interface DashboardProps {
  currentUser: LeaderboardEntry;
  checkedDays: CheckedDays;
  todayInNovember: number;
  onBack: () => void;
}

const exampleLeaderboard: LeaderboardEntry[] = [
  { name: 'Chiến Binh Dũng Cảm', streak: 28 },
  { name: 'Mastermind', streak: 25 },
  { name: 'Iron Will', streak: 22 },
  { name: 'Kẻ Bất Bại', streak: 19 },
  { name: 'Thợ Rèn Ý Chí', streak: 15 },
  { name: 'Người Mới', streak: 8 },
  { name: 'Chí Lớn', streak: 5 },
];


const Dashboard: React.FC<DashboardProps> = ({ currentUser, checkedDays, todayInNovember, onBack }) => {
  const { t } = useTranslation();
  
  const fullLeaderboard = [...exampleLeaderboard, currentUser]
    .sort((a, b) => b.streak - a.streak);
  
  const calculateLongestStreak = useCallback(() => {
    let longest = 0;
    let current = 0;
    const sortedDays = Object.keys(checkedDays).map(Number).sort((a,b) => a-b);
    let lastDay = 0;

    for (let i = 1; i <= 30; i++) {
        if (checkedDays[i]) {
            current++;
        } else {
            longest = Math.max(longest, current);
            current = 0;
        }
    }
    longest = Math.max(longest, current);
    return longest;
  }, [checkedDays]);

  const stats = useMemo(() => {
    const longestStreak = calculateLongestStreak();
    const daysSucceeded = Object.values(checkedDays).filter(Boolean).length;
    const pastDays = todayInNovember > 0 ? todayInNovember -1 : 0;
    const successRate = pastDays > 0 ? (daysSucceeded / pastDays) * 100 : 0;
    const daysFailed = pastDays - daysSucceeded;

    return { longestStreak, successRate, daysFailed };
  }, [checkedDays, todayInNovember, calculateLongestStreak]);

  return (
    <div className="w-full">
      <header className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ background: 'var(--color-accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('dashboard.title')}
        </h1>
        <p className="text-xl mt-2 text-[var(--color-text-secondary)] font-medium">{t('dashboard.description')}</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}>
        <StatsPanel 
          longestStreak={stats.longestStreak}
          successRate={stats.successRate}
          daysFailed={stats.daysFailed}
        />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
        <ProgressChart checkedDays={checkedDays} todayInNovember={todayInNovember} />
      </motion.div>


      <motion.div 
        className="bg-[var(--color-background-secondary)] rounded-lg border border-[var(--color-border)] p-4 space-y-3 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
      >
        {fullLeaderboard.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.name === currentUser.name && entry.streak === currentUser.streak;
            const isDeveloper = entry.name === 'B.Trọng';

            let rankDisplay: React.ReactNode;
            if (rank === 1) rankDisplay = '🥇';
            else if (rank === 2) rankDisplay = '🥈';
            else if (rank === 3) rankDisplay = '🥉';
            else rankDisplay = `#${rank}`;

            const rowClasses = isCurrentUser
              ? 'bg-[var(--color-accent)] text-[var(--color-background)] border-transparent shadow-lg'
              : 'bg-[var(--color-background)] border-[var(--color-border)]';
            
            const textColor = isCurrentUser ? 'text-[var(--color-background)]' : 'text-[var(--color-text-primary)]';
            const streakColor = isCurrentUser ? 'text-[var(--color-background)]' : 'text-[var(--color-accent)]';

            return (
                <div
                    key={`${entry.name}-${rank}`}
                    className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${rowClasses}`}
                >
                    <div className="w-12 text-center text-xl font-bold">
                        <span className={isCurrentUser ? 'text-[var(--color-background)] opacity-90' : 'text-[var(--color-text-secondary)]'}>{rankDisplay}</span>
                    </div>
                    <div className="flex-grow">
                        <p className={`font-bold ${textColor}`}>
                        {entry.name} {isDeveloper && <span className={`admin-badge ${isCurrentUser ? 'admin-badge--inverted' : ''}`}>{t('adminBadge')}</span>}
                        {isCurrentUser && <span className="text-xs font-normal ml-2 opacity-80">{t('dashboard.you')}</span>}
                        </p>
                    </div>
                    <div className={`flex items-center gap-2 font-bold text-lg ${textColor}`}>
                        <span>{entry.streak}</span>
                        <Flame className={`w-5 h-5 ${streakColor}`} />
                    </div>
                </div>
            )
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}>
        <ShareSection streak={currentUser.streak} />
      </motion.div>
      
      <div className="text-center mt-8">
        <button
            onClick={onBack}
            className="border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] font-bold py-2 px-6 rounded-lg transition-colors hover:bg-[var(--color-background-hover)]"
        >
            {t('dashboard.backButton')}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;