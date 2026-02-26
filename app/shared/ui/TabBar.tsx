import { themeColors } from '@/shared/classes/constants/themeColors';
import { Href, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

function TabIcon({ focused, Icon }: { focused: boolean; Icon: React.ComponentType<{ width: number; height: number; color: string }> }) {
  const color = focused ? '#FFFFFF' : themeColors.bottomBarInactive;
  return (
    <View style={styles.tabIconWrap}>
      <Icon width={SIZE} height={SIZE} color={color} />
    </View>
  );
}

function TabBarLabel({ focused, children }: { focused: boolean; children: string }) {
  const textColor = focused ? '#FFFFFF' : themeColors.bottomBarInactive;
  return (
    <Text
      style={[styles.tabLabelBase, { color: textColor, textAlign: 'center' }, focused && styles.tabLabelActive]}
      numberOfLines={2}
    >
      {children}
    </Text>
  );
}

export function EasemindTabBar() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const tabBarPaddingBottom = Math.max(insets.bottom, 12);
  const activeTab = '/' + (segments[1] ?? 'thermometer');

  return (
    <View style={[styles.tabBar, { paddingBottom: tabBarPaddingBottom, height: 64 + tabBarPaddingBottom }]}>
      {tabs.map((tab) => {
        const isFocused = tab.name === activeTab;
        return (
          <Pressable
            key={tab.name}
            style={[styles.tabItem, isFocused && styles.tabItemActiveBg]}
            onPress={() => router.replace(tab.name as Href)}
          >
            <TabIcon focused={isFocused} Icon={tab.Icon} />
            <TabBarLabel focused={isFocused}>{tab.label}</TabBarLabel>
          </Pressable>
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
    backgroundColor: themeColors.bottomBarActive,
    borderRadius: 10,
    marginHorizontal: 4,
    marginVertical: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  tabLabelBase: {
    fontSize: 9,
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
