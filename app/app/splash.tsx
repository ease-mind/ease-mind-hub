import { useAuth } from '@/shared/contexts';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const SPLASH_DURATION_MS = 2200;

export default function SplashScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasRedirected.current) return;
    if (!minTimeElapsed || isLoading) return;

    hasRedirected.current = true;

    if (isAuthenticated) {
      router.replace('/(protected)/thermometer');
    } else {
      router.replace('/(auth)/account-access');
    }
  }, [isAuthenticated, isLoading, minTimeElapsed]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-auth.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>EaseMind</Text>
      <Text style={styles.subtitle}>Cuidando da sua saúde cognitiva.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 132,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
