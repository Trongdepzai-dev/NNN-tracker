export type CheckedDays = { [day: number]: boolean };

export type JournalEntries = { [day: number]: string };

export type Theme = 'dark' | 'light' | 'sepia' | 'cyberpunk' | 'forest' | 'ocean' | 'vampire' | 'matrix' | 'synthwave' | 'solarizedDark' | 'solarizedLight' | 'nord' | 'dracula' | 'gruvbox' | 'monokai' | 'matcha' | 'rosePine' | 'sunset';

export type CustomAccentColors = { [T in Theme]?: string };

export type AchievementId = 'FIRST_WEEK' | 'STREAK_7' | 'HALFWAY' | 'FINISHER';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
}

export interface LeaderboardEntry {
  name: string;
  streak: number;
}