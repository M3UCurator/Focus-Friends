import { Stack } from 'expo-router';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ProgressProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ProgressProvider>
  );
}