import { themeColors } from '@/shared/classes/constants/themeColors';
import React from 'react';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native';

type ToggleRowProps = {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
};

export function ToggleRow({
  icon,
  label,
  value,
  onValueChange,
  description,
}: ToggleRowProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: themeColors.toggleOff,
            true: themeColors.toggleOn,
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={themeColors.toggleOff}
          style={styles.switch}
        />
      </View>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: themeColors.textPrimary,
  },
  switch: {
    ...(Platform.OS === 'android' && { transform: [{ scale: 0.9 }] }),
  },
  description: {
    fontSize: 13,
    color: themeColors.textMuted,
    marginTop: 4,
    marginLeft: 36,
  },
});
