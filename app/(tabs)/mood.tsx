import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useProgress } from '@/hooks/useProgress';
import MonsterAvatar from '@/components/ui/MonsterAvatar';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: colors.mood.happy },
  { id: 'okay', emoji: '🙂', label: 'Okay', color: colors.mood.okay },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: colors.mood.frustrated },
  { id: 'tired', emoji: '😴', label: 'Tired', color: colors.mood.tired },
] as const;

export default function MoodScreen() {
  const insets = useSafeAreaInsets();
  const { addMoodEntry, progress } = useProgress();
  const [selectedMood, setSelectedMood] = useState<(typeof MOODS)[number]['id'] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const successScale = useSharedValue(0);

  const handleMoodSelect = async (moodId: (typeof MOODS)[number]['id']) => {
    setSelectedMood(moodId);
    await addMoodEntry(moodId);
    setShowSuccess(true);
    successScale.value = withSequence(withSpring(1.2), withSpring(1));

    setTimeout(() => {
      setShowSuccess(false);
      successScale.value = 0;
    }, 2500);
  };

  const animatedSuccessStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }));

  const recentMoods = progress.moodEntries.slice(-5).reverse();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mood Monster 😊</Text>
        <Text style={styles.subtitle}>How are you feeling right now?</Text>
      </View>

      <View style={styles.monsterContainer}>
        <MonsterAvatar mood={selectedMood || 'neutral'} size={160} />
      </View>

      <View style={styles.moodsGrid}>
        {MOODS.map(mood => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodButton,
              { backgroundColor: mood.color },
              selectedMood === mood.id && styles.moodButtonSelected,
            ]}
            onPress={() => handleMoodSelect(mood.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showSuccess && (
        <Animated.View style={[styles.successBanner, animatedSuccessStyle]}>
          <Text style={styles.successText}>Great job sharing your feelings! ⭐</Text>
        </Animated.View>
      )}

      {recentMoods.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Your Recent Moods:</Text>
          <View style={styles.historyList}>
            {recentMoods.map(entry => {
              const mood = MOODS.find(m => m.id === entry.mood);
              return (
                <View key={entry.id} style={styles.historyItem}>
                  <Text style={styles.historyEmoji}>{mood?.emoji}</Text>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyMood}>{mood?.label}</Text>
                    <Text style={styles.historyTime}>
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.tipCard}>
        <Text style={styles.tipEmoji}>💙</Text>
        <Text style={styles.tipText}>
          All feelings are okay! Tracking your mood helps you understand yourself better.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary.pink,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  monsterContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  moodButton: {
    flex: 1,
    minWidth: '45%',
    aspectRatio: 1.2,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    ...shadows.medium,
  },
  moodButtonSelected: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successBanner: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  successText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historySection: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  historyList: {
    gap: spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.background.main,
    borderRadius: borderRadius.sm,
  },
  historyEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  historyInfo: {
    flex: 1,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  historyTime: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  tipCard: {
    backgroundColor: colors.primary.pink,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tipEmoji: {
    fontSize: 32,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 20,
  },
});