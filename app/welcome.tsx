import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useProgress } from '@/hooks/useProgress';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { setUsername } = useProgress();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const bounce = useSharedValue(0);

  React.useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const handleContinue = async () => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      setError('Please enter your name');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name should be at least 2 characters');
      return;
    }

    await setUsername(trimmedName);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.mascotContainer, animatedStyle]}>
          <Text style={styles.mascot}>🐱✨</Text>
        </Animated.View>

        <Text style={styles.title}>Welcome to Focus Friends!</Text>
        <Text style={styles.subtitle}>Let me know your name so we can be friends!</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>My name is...</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={name}
            onChangeText={text => {
              setName(text);
              setError('');
            }}
            placeholder="Enter your name"
            placeholderTextColor={colors.text.light}
            maxLength={20}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!name.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Let&apos;s Go! 🚀</Text>
        </TouchableOpacity>

        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 Tip: You can always change your name later in the app!
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotContainer: {
    marginBottom: spacing.xl,
  },
  mascot: {
    fontSize: 120,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary.purple,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    fontWeight: '600',
    lineHeight: 26,
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    borderWidth: 3,
    borderColor: colors.primary.purple,
    ...shadows.medium,
  },
  inputError: {
    borderColor: colors.mood.frustrated,
  },
  errorText: {
    color: colors.mood.frustrated,
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary.purple,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tipCard: {
    backgroundColor: colors.primary.blue,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  tipText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});