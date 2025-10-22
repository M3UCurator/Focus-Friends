import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '@/types/app';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
}

export default function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <View style={[styles.card, !earned && styles.cardLocked]}>
      <Text style={[styles.icon, !earned && styles.iconLocked]}>{badge.icon}</Text>
      <Text style={[styles.name, !earned && styles.textLocked]}>{badge.name}</Text>
      <Text style={[styles.description, !earned && styles.textLocked]} numberOfLines={2}>
        {badge.description}
      </Text>
      {earned && badge.earnedAt && (
        <Text style={styles.earnedDate}>
          ✓ {new Date(badge.earnedAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    minWidth: 140,
    ...shadows.small,
  },
  cardLocked: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  iconLocked: {
    opacity: 0.3,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  textLocked: {
    color: colors.text.light,
  },
  earnedDate: {
    fontSize: 10,
    color: colors.success,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
});