import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../stores/authStore';
import { PropertyProvider } from '../stores/propertyStore';
import { InvestmentProvider } from '../stores/investmentStore';
import { WalletProvider } from '../stores/walletStore';
import { NotificationProvider } from '../stores/notificationStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <PropertyProvider>
        <InvestmentProvider>
          <WalletProvider>
            <NotificationProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="forgot-password" />
                <Stack.Screen name="kyc" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="ai-assistant" />
                <Stack.Screen name="property/[id]" />
                <Stack.Screen name="investment/[id]" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </NotificationProvider>
          </WalletProvider>
        </InvestmentProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}
