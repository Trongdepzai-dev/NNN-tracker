const isReplit = typeof window !== 'undefined' && window.location.hostname.includes('replit.dev');
const API_BASE_URL = isReplit
  ? `${window.location.protocol}//${window.location.hostname.replace('5000', '3000')}/api`
  : (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:3000/api'
    : '/api';

export interface LeaderboardEntry {
  name: string;
  streak: number;
}

export interface UserProgress {
  checkedDays: { [key: number]: boolean };
  journalEntries: { [key: number]: string };
}

export interface ShareResponse {
  shareId: string;
  shareUrl: string;
}

export interface SharedData {
  userName: string;
  streak: number;
  daysSucceeded: number;
  shareData: any;
  createdAt: string;
}

export const api = {
  async registerUser(name: string): Promise<{ userId: number; name: string; existing: boolean }> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to register user');
    }
    
    return response.json();
  },

  async saveProgress(
    userId: number, 
    day: number, 
    checked: boolean, 
    journalEntry?: string
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, day, checked, journalEntry }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save progress');
    }
  },

  async getUserProgress(userId: number): Promise<UserProgress> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/progress`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user progress');
    }
    
    return response.json();
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    
    return response.json();
  },

  async createShare(
    userId: number,
    userName: string,
    streak: number,
    daysSucceeded: number,
    shareData?: any
  ): Promise<ShareResponse> {
    const response = await fetch(`${API_BASE_URL}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName, streak, daysSucceeded, shareData }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create share');
    }
    
    return response.json();
  },

  async getSharedData(shareId: string): Promise<SharedData> {
    const response = await fetch(`${API_BASE_URL}/share/${shareId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch shared data');
    }
    
    return response.json();
  },
};
