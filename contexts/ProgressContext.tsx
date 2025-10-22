import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, FocusSession, MoodEntry, Badge, AVAILABLE_BADGES } from '@/types/app';

const STORAGE_KEY = '@focus_friends_progress';

interface ProgressContextType {
  progress: UserProgress;
  addFocusSession: (duration: number) => Promise<void>;
  addMoodEntry: (mood: 'happy' | 'okay' | 'frustrated' | 'tired') => Promise<void>;
  checkAndAwardBadges: () => Promise<void>;
  setUsername: (name: string) => Promise<void>;
  loading: boolean;
}

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
const initialProgress: UserProgress = {
  username: '',
  totalStars: 0,
  focusSessions: [],
  moodEntries: [],
  badges: [],
  streakDays: 0,
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.focusSessions = parsed.focusSessions.map((session: any) => ({
          ...session,
          completedAt: new Date(session.completedAt),
        }));
        parsed.moodEntries = parsed.moodEntries.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        parsed.badges = parsed.badges.map((badge: any) => ({
          ...badge,
          earnedAt: badge.earnedAt ? new Date(badge.earnedAt) : undefined,
        }));
        setProgress(parsed);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (newProgress: UserProgress) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const addFocusSession = async (duration: number) => {
    const starsEarned = Math.ceil(duration / 5); // 1 star per 5 minutes
    const newSession: FocusSession = {
      id: Date.now().toString(),
      duration,
      completedAt: new Date(),
      starsEarned,
    };

    const newProgress = {
      ...progress,
      totalStars: progress.totalStars + starsEarned,
      focusSessions: [...progress.focusSessions, newSession],
    };

    await saveProgress(newProgress);
    await checkAndAwardBadges();
  };

  const addMoodEntry = async (mood: 'happy' | 'okay' | 'frustrated' | 'tired') => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      timestamp: new Date(),
    };

    const newProgress = {
      ...progress,
      moodEntries: [...progress.moodEntries, newEntry],
    };

    await saveProgress(newProgress);
    await checkAndAwardBadges();
  };
  const setUsername = async (name: string) => {
    const newProgress = {
      ...progress,
      username: name.trim(),
    };
    await saveProgress(newProgress);
  };

  const checkAndAwardBadges = async () => {
    const newBadges: Badge[] = [...progress.badges];
    let badgesAwarded = false;

    // Check First Adventure
    if (progress.focusSessions.length >= 1 && !progress.badges.find(b => b.id === 'first_focus')) {
      const badge = AVAILABLE_BADGES.find(b => b.id === 'first_focus');
      if (badge) {
        newBadges.push({ ...badge, earnedAt: new Date() });
        badgesAwarded = true;
      }
    }

    // Check Calm Champion (3 mood entries)
    if (progress.moodEntries.length >= 3 && !progress.badges.find(b => b.id === 'calm_master')) {
      const badge = AVAILABLE_BADGES.find(b => b.id === 'calm_master');
      if (badge) {
        newBadges.push({ ...badge, earnedAt: new Date() });
        badgesAwarded = true;
      }
    }

    // Check Star Collector
    if (progress.totalStars >= 50 && !progress.badges.find(b => b.id === 'star_collector')) {
      const badge = AVAILABLE_BADGES.find(b => b.id === 'star_collector');
      if (badge) {
        newBadges.push({ ...badge, earnedAt: new Date() });
        badgesAwarded = true;
      }
    }

    if (badgesAwarded) {
      const newProgress = { ...progress, badges: newBadges };
      await saveProgress(newProgress);
    }
  };
  return (
    <ProgressContext.Provider
      value={{
        progress,
        addFocusSession,
        addMoodEntry,
        checkAndAwardBadges,
        setUsername,
        loading,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}