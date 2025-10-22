export interface FocusSession {
  id: string;
  duration: number; // minutes
  completedAt: Date;
  starsEarned: number;
}

export interface MoodEntry {
  id: string;
  mood: 'happy' | 'okay' | 'frustrated' | 'tired';
  timestamp: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
}

export interface UserProgress {
  username: string;
  totalStars: number;
  focusSessions: FocusSession[];
  moodEntries: MoodEntry[];
  badges: Badge[];
  streakDays: number;
}

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first_focus',
    name: 'First Adventure',
    description: 'Complete your first focus session!',
    icon: '🌟',
  },
  {
    id: 'calm_master',
    name: 'Calm Champion',
    description: 'Track your mood 3 times calmly',
    icon: '🧘',
  },
  {
    id: 'breathing_buddy',
    name: 'Breathing Buddy',
    description: 'Complete 5 breathing exercises',
    icon: '🐉',
  },
  {
    id: 'focus_streak',
    name: 'Focus Hero',
    description: 'Complete focus sessions 3 days in a row',
    icon: '⚡',
  },
  {
    id: 'star_collector',
    name: 'Star Collector',
    description: 'Collect 50 stars',
    icon: '✨',
  },
];