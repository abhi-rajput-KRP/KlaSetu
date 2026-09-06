import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ShopProvider } from '../context/ShopContext';
import LoadingScreen from '../components/LoadingScreen';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaProvider>
      <ShopProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FBF8F2' },
          }}
        />
        {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}
      </ShopProvider>
    </SafeAreaProvider>
  );
}
