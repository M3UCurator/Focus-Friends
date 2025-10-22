import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export default function BreathingScreen() {
  const insets = useSafeAreaInsets();
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(60);
  const [completedSessions, setCompletedSessions] = useState(0);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isBreathing) {
      // Breathing animation: 4 seconds in, 4 seconds out
      scale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 500 });
      opacity.value = withTiming(1, { duration: 500 });
    }
  }, [isBreathing]);

  useEffect(() => {
    let phaseInterval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (isBreathing) {
      // Alternate between inhale and exhale every 4 seconds
      phaseInterval = setInterval(() => {
        setPhase(prev => (prev === 'inhale' ? 'exhale' : 'inhale'));
      }, 4000);

      // Countdown from 60 seconds
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleComplete();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(phaseInterval);
      clearInterval(countdownInterval);
    };
  }, [isBreathing]);

  const handleComplete = () => {
    setIsBreathing(false);
    setCompletedSessions(prev => prev + 1);
    setCountdown(60);
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setPhase('inhale');
    setCountdown(60);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setCountdown(60);
  };

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Chill Spell 🐉</Text>
        <Text style={styles.subtitle}>Breathe like a calm dragon</Text>
      </View>

      <View style={styles.breathingContainer}>
        <Animated.View style={[styles.breathingCircle, animatedCircleStyle]}>
          <Text style={styles.dragonEmoji}>🐉</Text>
        </Animated.View>

        {isBreathing && (
          <View style={styles.instructionContainer}>
            <Text style={styles.phaseText}>
              {phase === 'inhale' ? 'Breathe In... 🌬️' : 'Breathe Out... ✨'}
            </Text>
            <Text style={styles.countdownText}>{countdown}s</Text>
          </View>
        )}
      </View>

      {!isBreathing ? (
        <>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startBreathing}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Breathing 🧘</Text>
          </TouchableOpacity>

          {completedSessions > 0 && (
            <View style={styles.statsCard}>
              <Text style={styles.statsEmoji}>⭐</Text>
              <Text style={styles.statsText}>
                You completed {completedSessions} breathing session{completedSessions > 1 ? 's' : ''} today!
              </Text>
            </View>
          )}
        </>
      ) : (
        <TouchableOpacity style={styles.stopButton} onPress={stopBreathing} activeOpacity={0.8}>
          <Text style={styles.stopButtonText}>Stop</Text>
        </TouchableOpacity>
      )}

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>How it works:</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>1</Text>
          <Text style={styles.tipText}>Watch the dragon circle grow and shrink</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>2</Text>
          <Text style={styles.tipText}>Breathe IN when it gets bigger</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>3</Text>
          <Text style={styles.tipText}>Breathe OUT when it gets smaller</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>4</Text>
          <Text style={styles.tipText}>Feel calm and focused! ✨</Text>
        </View>
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
    color: colors.primary.blue,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xxl,
    minHeight: 280,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary.blue,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  dragonEmoji: {
    fontSize: 80,
  },
  instructionContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary.blue,
    marginBottom: spacing.sm,
  },
  countdownText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  startButton: {
    backgroundColor: colors.primary.blue,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stopButton: {
    backgroundColor: colors.mood.frustrated,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  statsEmoji: {
    fontSize: 32,
  },
  statsText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...shadows.small,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.blue,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
});