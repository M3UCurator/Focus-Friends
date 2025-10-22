import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useProgress } from '@/hooks/useProgress';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

const DURATION_OPTIONS = [5, 10, 15, 20];

export default function FocusScreen() {
  const insets = useSafeAreaInsets();
  const { addFocusSession } = useProgress();
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const scale = useSharedValue(1);
  const successScale = useSharedValue(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    setShowSuccess(true);
    successScale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );
    await addFocusSession(selectedDuration);
    setTimeout(() => {
      setShowSuccess(false);
      successScale.value = 0;
    }, 3000);
  };

  const startTimer = () => {
    setTimeLeft(selectedDuration * 60);
    setIsRunning(true);
    scale.value = withSequence(withSpring(1.1), withSpring(1));
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const animatedTimerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedSuccessStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }));

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Magic Minutes ⏰</Text>
        <Text style={styles.subtitle}>Stay focused and earn stars!</Text>
      </View>

      {!isRunning && timeLeft === 0 && !showSuccess && (
        <>
          <View style={styles.durationSection}>
            <Text style={styles.sectionTitle}>Choose Your Time:</Text>
            <View style={styles.durationGrid}>
              {DURATION_OPTIONS.map(duration => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationButton,
                    selectedDuration === duration && styles.durationButtonActive,
                  ]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      selectedDuration === duration && styles.durationTextActive,
                    ]}
                  >
                    {duration}
                  </Text>
                  <Text
                    style={[
                      styles.minutesLabel,
                      selectedDuration === duration && styles.minutesLabelActive,
                    ]}
                  >
                    minutes
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startTimer} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>Start Focus Adventure! 🚀</Text>
          </TouchableOpacity>
        </>
      )}

      {isRunning && (
        <>
          <Animated.View style={[styles.timerContainer, animatedTimerStyle]}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>Keep going! You are doing great!</Text>
          </Animated.View>

          <TouchableOpacity style={styles.stopButton} onPress={stopTimer} activeOpacity={0.8}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        </>
      )}

      {showSuccess && (
        <Animated.View style={[styles.successContainer, animatedSuccessStyle]}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Amazing Work!</Text>
          <Text style={styles.successMessage}>
            You earned {Math.ceil(selectedDuration / 5)} stars! ⭐
          </Text>
          <Text style={styles.successSubtext}>Your focus power is growing!</Text>
        </Animated.View>
      )}

      <View style={styles.tipCard}>
        <Text style={styles.tipEmoji}>💡</Text>
        <Text style={styles.tipText}>
          Find a quiet spot, take a deep breath, and let the magic begin!
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
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary.purple,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  durationSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  durationButton: {
    flex: 1,
    minWidth: 70,
    aspectRatio: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.small,
  },
  durationButtonActive: {
    backgroundColor: colors.primary.purple,
    borderColor: colors.primary.purple,
  },
  durationText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
  },
  durationTextActive: {
    color: '#FFFFFF',
  },
  minutesLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  minutesLabelActive: {
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: colors.primary.purple,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timerContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '800',
    color: colors.primary.purple,
  },
  timerLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: colors.mood.frustrated,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.small,
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successContainer: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  successMessage: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  successSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  tipCard: {
    backgroundColor: colors.primary.blue,
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