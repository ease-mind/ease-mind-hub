import { useCognitiveSettings } from '@/shared/contexts';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type SettingsCardProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function SettingsCard({
  title,
  subtitle,
  icon,
  children,
  style,
}: SettingsCardProps) {
  const { themeColors, spacing, fontSize } = useCognitiveSettings();
  return (
    <View style={[styles.card, { backgroundColor: themeColors.cardBackground, padding: spacing, marginBottom: spacing }, style]}>
      <View style={[styles.header, { marginBottom: spacing }]}>
        <View style={[styles.iconWrap, { marginRight: spacing }]}>{icon}</View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: themeColors.textPrimary, fontSize: Math.max(14, fontSize + 2) }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: themeColors.textSecondary, marginTop: spacing / 2, fontSize, lineHeight: fontSize + spacing }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {},
});
