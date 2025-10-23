import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Rocket, Flame, Moon, Trophy } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';
import type { AchievementId } from '../types';

interface AchievementsListProps {
  unlockedAchievements: AchievementId[];
  newlyUnlockedId: AchievementId | null;
}

const achievementIcons: Record<AchievementId, React.ReactNode> = {
  FIRST_WEEK: <Rocket className="w-8 h-8" />,
  STREAK_7: <Flame className="w-8 h-8" />,
  HALFWAY: <Moon className="w-8 h-8" />,
  FINISHER: <Trophy className="w-8 h-8" />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const AchievementsList: React.FC<AchievementsListProps> = ({ unlockedAchievements, newlyUnlockedId }) => {
  const { t } = useTranslation();
  const allAchievements = Object.values(ACHIEVEMENTS);

  return (
    <div className="mt-8 w-full">
      <h3 className="text-xl font-bold text-center mb-4 text-[var(--color-text-primary)]">{t('achievements.title')}</h3>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {allAchievements.map((achievement) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          const isNewlyUnlocked = newlyUnlockedId === achievement.id;

          return (
            <motion.div
              key={achievement.id}
              variants={itemVariants}
              className={`p-4 rounded-lg border flex items-center gap-4 transition-all duration-300 relative overflow-hidden group ${
                isUnlocked ? 'bg-[var(--color-background-secondary)] border-[var(--color-border)]' : 'bg-[var(--color-background)] opacity-50 border-[var(--color-border)]'
              }`}
            >
              {isUnlocked && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: `0 0 35px 10px var(--color-glow)` }}></div>}
              <motion.div 
                className="text-3xl z-10 text-[var(--color-accent)]"
                animate={{ scale: isNewlyUnlocked ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {achievementIcons[achievement.id]}
              </motion.div>
              <div className="z-10">
                <h4 className="font-bold text-[var(--color-text-primary)]">{t(achievement.title)}</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">{t(achievement.description)}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AchievementsList;