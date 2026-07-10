import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { FlyToCartAnimation } from '@/components/FlyToCartAnimation';
import { AnimationProvider, useAnimation } from '@/context/AnimationContext';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function LayoutController() {
  const { width, height } = useWindowDimensions();
  const { setCartIconPosition } = useAnimation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Dynamically calculate cart icon center in the bottom tab bar (2 tabs)
    setCartIconPosition({
      x: width * 0.75,
      y: height - (insets.bottom + 25),
    });
  }, [width, height, insets.bottom, setCartIconPosition]);

  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="book/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="cart" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="checkout" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="transaction/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="reader/[id]" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
      <FlyToCartAnimation />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimationProvider>
          <LayoutController />
        </AnimationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
