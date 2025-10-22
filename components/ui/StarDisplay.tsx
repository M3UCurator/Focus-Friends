import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { colors, spacing } from '@/constants/theme';

interface StarDisplayProps {
  count: number;
  size?: 'small' | 'large';
}

export default function StarDisplay({ count, size = 'small' }: StarDisplayProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isLarge = size === 'large';

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={[styles.star, isLarge && styles.starLarge]}>⭐</Text>
      <Text style={[styles.count, isLarge && styles.countLarge]}>{count}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  star: {
    fontSize: 20,
  },
  starLarge: {
    fontSize: 32,
  },
  count: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  countLarge: {
    fontSize: 28,
    fontWeight: '800',
  },
});