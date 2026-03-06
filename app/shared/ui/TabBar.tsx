import { useCognitiveSettings } from '@/shared/contexts';
import { Href, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const springConfig = { damping: 15, stiffness: 150 };

const SIZE = 24;

const TermometroIcon = require('@/assets/images/termometro.svg').default;
const TarefasIcon = require('@/assets/images/tarefas.svg').default;
const ConfigIcon = require('@/assets/images/config.svg').default;
const PerfilIcon = require('@/assets/images/perfil.svg').default;

const tabs: { name: `/${string}`; label: string; Icon: React.ComponentType<{ width: number; height: number; color: string }> }[] = [
  { name: '/thermometer', label: 'Termômetro', Icon: TermometroIcon },
  { name: '/tasks', label: 'Tarefas', Icon: TarefasIcon },
  { name: '/config', label: 'Configurações', Icon: ConfigIcon },
  { name: '/profile', label: 'Perfil', Icon: PerfilIcon },
];

function TabIcon({
  focused,
  Icon,
  themeColors,
}: {
  focused: boolean;
  Icon: React.ComponentType<{ width: number; height: number; color: string }>;
  themeColors: { bottomBarInactive: string };
}) {
  const color = focused ? '#FFFFFF' : themeColors.bottomBarInactive;
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withSpring(focused ? 1.05 : 1, springConfig);
  }, [focused]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={[styles.tabIconWrap, animatedStyle]}>
      <Icon width={SIZE} height={SIZE} color={color} />
    </Animated.View>
  );
}

function TabBarLabel({
  focused,
  children,
  themeColors,
  fontSize,
}: {
  focused: boolean;
  children: string;
  themeColors: { bottomBarInactive: string };
  fontSize: number;
}) {
  const textColor = focused ? '#FFFFFF' : themeColors.bottomBarInactive;
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.85, { duration: 200 });
  }, [focused]);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={animatedStyle}>
      <Text
        style={[styles.tabLabelBase, { color: textColor, textAlign: 'center', fontSize: Math.max(9, Math.min(12, fontSize - 3)) }, focused && styles.tabLabelActive]}
        numberOfLines={2}
      >
        {children}
      </Text>
    </Animated.View>
  );
}

function TabItemWrapper({
  children,
  isFocused,
  onPress,
  style,
  activeStyle,
}: {
  children: React.ReactNode;
  isFocused: boolean;
  onPress: () => void;
  style: object;
  activeStyle: object;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96, springConfig);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springConfig);
      }}
      onPress={onPress}
      style={[styles.tabItem, style, isFocused && activeStyle]}
    >
      <Animated.View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export function EasemindTabBar() {
  const { themeColors, spacing, fontSize } = useCognitiveSettings();
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const tabBarPaddingBottom = Math.max(insets.bottom, 12);
  const activeTab = '/' + (segments[1] ?? 'thermometer');

  return (
    <View style={[styles.tabBar, { paddingBottom: tabBarPaddingBottom, paddingTop: spacing, height: 64 + tabBarPaddingBottom, backgroundColor: themeColors.background, borderTopWidth: themeColors.borderDividerWidth, borderTopColor: themeColors.borderDivider }]}>
      {tabs.map((tab) => {
        const isFocused = tab.name === activeTab;
        return (
          <TabItemWrapper
            key={tab.name}
            isFocused={isFocused}
            onPress={() => router.replace(tab.name as Href)}
            style={{ paddingVertical: spacing / 2, paddingHorizontal: spacing / 2 }}
            activeStyle={[styles.tabItemActiveBg, { backgroundColor: themeColors.bottomBarActive, paddingVertical: spacing, paddingHorizontal: spacing }]}
          >
            <TabIcon focused={isFocused} Icon={tab.Icon} themeColors={themeColors} />
            <TabBarLabel focused={isFocused} themeColors={themeColors} fontSize={fontSize}>{tab.label}</TabBarLabel>
          </TabItemWrapper>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
    flexDirection: 'row',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActiveBg: {
    borderRadius: 10,
    marginHorizontal: 4,
    marginVertical: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  tabLabelBase: {
    fontWeight: '500',
    textAlign: 'center',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  tabIconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
