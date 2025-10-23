import type { Achievement, AchievementId } from './types';

export const MOTIVATIONAL_QUOTES: string[] = Array.from({ length: 30 }, (_, i) => `quotes.q${i + 1}`);

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  FIRST_WEEK: {
    id: 'FIRST_WEEK',
    title: 'achievements.FIRST_WEEK.title',
    description: 'achievements.FIRST_WEEK.description',
    icon: '🚀',
  },
  STREAK_7: {
    id: 'STREAK_7',
    title: 'achievements.STREAK_7.title',
    description: 'achievements.STREAK_7.description',
    icon: '🔥',
  },
  HALFWAY: {
    id: 'HALFWAY',
    title: 'achievements.HALFWAY.title',
    description: 'achievements.HALFWAY.description',
    icon: '🌗',
  },
  FINISHER: {
    id: 'FINISHER',
    title: 'achievements.FINISHER.title',
    description: 'achievements.FINISHER.description',
    icon: '🏆',
  },
};