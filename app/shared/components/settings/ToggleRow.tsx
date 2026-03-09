import { useCognitiveSettings } from '@/data-access';
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
  const { themeColors, spacing, fontSize } = useCognitiveSettings();
  return (
    <View style={[styles.wrap, { marginBottom: spacing }]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { marginRight: spacing }]}>{icon}</View>
        <Text style={[styles.label, { color: themeColors.textPrimary, fontSize, lineHeight: fontSize + spacing }]}>{label}</Text>
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
        <Text style={[styles.description, { color: themeColors.textMuted, marginTop: spacing / 2, marginLeft: 36, fontSize: Math.max(12, fontSize - 2), lineHeight: fontSize + spacing / 2 }]}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
  switch: {
    ...(Platform.OS === 'android' && { transform: [{ scale: 0.9 }] }),
  },
  description: {},
});
