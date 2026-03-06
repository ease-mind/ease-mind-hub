import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const DURATION_MS = 280;

type ScreenFadeInProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenFadeIn({ children, style }: ScreenFadeInProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useFocusEffect(
    useCallback(() => {
      opacity.value = 0;
      translateY.value = 10;
      opacity.value = withTiming(1, { duration: DURATION_MS });
      translateY.value = withTiming(0, { duration: DURATION_MS });
    }, []),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
