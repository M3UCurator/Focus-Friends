import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '@/hooks/useProgress';
import StarDisplay from '@/components/ui/StarDisplay';
import BadgeCard from '@/components/ui/BadgeCard';
import { AVAILABLE_BADGES } from '@/types/app';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const { progress } = useProgress();

  const earnedBadgeIds = progress.badges.map(b => b.id);
  const allBadges = AVAILABLE_BADGES.map(badge => ({
    ...badge,
    earned: earnedBadgeIds.includes(badge.id),
    earnedAt: progress.badges.find(b => b.id === badge.id)?.earnedAt,
  }));

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Rewards 🏆</Text>
        <Text style={styles.subtitle}>Look at all your amazing progress!</Text>
      </View>

      <View style={styles.starsCard}>
        <Text style={styles.starsEmoji}>✨</Text>
        <View style={styles.starsInfo}>
          <Text style={styles.starsLabel}>Total Stars Collected</Text>
          <StarDisplay count={progress.totalStars} size="large" />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progress.focusSessions.length}</Text>
          <Text style={styles.statLabel}>Focus Sessions</Text>
          <Text style={styles.statEmoji}>⏰</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progress.badges.length}</Text>
          <Text style={styles.statLabel}>Badges Earned</Text>
          <Text style={styles.statEmoji}>🏅</Text>
        </View>
      </View>

      <View style={styles.badgesSection}>
        <Text style={styles.sectionTitle}>Your Badge Collection</Text>
        <View style={styles.badgesGrid}>
          {allBadges.map(badge => (
            <BadgeCard key={badge.id} badge={badge} earned={badge.earned} />
          ))}
        </View>
      </View>

      <View style={styles.encouragementCard}>
        <Text style={styles.encouragementEmoji}>🌟</Text>
        <Text style={styles.encouragementText}>
          You are doing AMAZING! Every star and badge shows how hard you are working. Keep going,
          Focus Friend!
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
    color: colors.mood.happy,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  starsCard: {
    backgroundColor: colors.mood.happy,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  starsEmoji: {
    fontSize: 64,
  },
  starsInfo: {
    flex: 1,
  },
  starsLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.small,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary.purple,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  statEmoji: {
    fontSize: 24,
  },
  badgesSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  encouragementCard: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.medium,
  },
  encouragementEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  encouragementText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 24,
  },
});