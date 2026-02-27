import { themeColors } from '@/shared/classes/constants/themeColors';
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
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>{icon}</View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: themeColors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: themeColors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: themeColors.textSecondary,
    marginTop: 4,
  },
});
