import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '@/hooks/useProgress';
import MonsterAvatar from '@/components/ui/MonsterAvatar';
import StarDisplay from '@/components/ui/StarDisplay';
import AdventureButton from '@/components/ui/AdventureButton';
import { colors, spacing, borderRadius } from '@/constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { progress, loading } = useProgress();

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.loading}>Loading your adventure...</Text>
      </View>
    );
  }

  const latestMood =
    progress.moodEntries.length > 0
      ? progress.moodEntries[progress.moodEntries.length - 1].mood
      : 'neutral';

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
    >
            <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>
            Hi, {progress.username || 'Focus Friend'}! 🌟
          </Text>
          <StarDisplay count={progress.totalStars} size="large" />
        </View>
        <MonsterAvatar mood={latestMood} size={140} />
        <Text style={styles.subtitle}>Ready for an adventure?</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{progress.focusSessions.length}</Text>
          <Text style={styles.statLabel}>Focus Sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{progress.badges.length}</Text>
          <Text style={styles.statLabel}>Badges Earned</Text>
        </View>
      </View>

      <View style={styles.adventuresSection}>
        <Text style={styles.sectionTitle}>Pick Your Adventure</Text>
        <View style={styles.adventureGrid}>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <AdventureButton
                title="Magic Minutes"
                emoji="⏰"
                color={colors.primary.purple}
                onPress={() => router.push('/(tabs)/focus')}
              />
            </View>
            <View style={styles.gridItem}>
              <AdventureButton
                title="Chill Spell"
                emoji="🐉"
                color={colors.primary.blue}
                onPress={() => router.push('/(tabs)/breathing')}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <AdventureButton
                title="Mood Monster"
                emoji="😊"
                color={colors.primary.pink}
                onPress={() => router.push('/(tabs)/mood')}
              />
            </View>
            <View style={styles.gridItem}>
              <AdventureButton
                title="My Rewards"
                emoji="🏆"
                color={colors.mood.happy}
                onPress={() => router.push('/(tabs)/rewards')}
              />
            </View>
          </View>
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
  loading: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary.purple,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.text.light,
  },
  adventuresSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  adventureGrid: {
    gap: spacing.md,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gridItem: {
    flex: 1,
  },
});