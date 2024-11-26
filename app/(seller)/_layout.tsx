import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalUser } from '@/context/local-user/useLocalUser';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  const localUser = useLocalUser();
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    if(!localUser?.data) router.push('/(auth)/signin');
    else if(!localUser.data.isSeller) router.push('/(seller)/onboarding-seller');
  }, []);
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="seller" options={{ headerShown: false }} />
        <Stack.Screen name="add-new-inventory/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-seller/index" options={{ headerShown: false }} />
        <Stack.Screen name="withdraw-earnings/index" options={{ headerShown: false }} />
        <Stack.Screen name="company-details/index" options={{ headerShown: false }} />
        <Stack.Screen name="bank-details/index" options={{ headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}


export default RootLayout;
