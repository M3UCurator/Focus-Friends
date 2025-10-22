import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius } from '@/constants/theme';

interface MonsterAvatarProps {
  mood?: 'happy' | 'okay' | 'frustrated' | 'tired' | 'neutral';
  size?: number;
}

const MONSTER_FACES = {
  happy: '😊',
  okay: '🙂',
  frustrated: '😤',
  tired: '😴',
  neutral: '🐱',
};

const MONSTER_COLORS = {
  happy: colors.mood.happy,
  okay: colors.mood.okay,
  frustrated: colors.mood.frustrated,
  tired: colors.mood.tired,
  neutral: colors.primary.purple,
};

export default function MonsterAvatar({ mood = 'neutral', size = 120 }: MonsterAvatarProps) {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size, backgroundColor: MONSTER_COLORS[mood] },
        animatedStyle,
      ]}
    >
      <Text style={[styles.face, { fontSize: size * 0.5 }]}>{MONSTER_FACES[mood]}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  face: {
    textAlign: 'center',
  },
});