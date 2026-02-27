import { themeColors } from '@/shared/classes/constants/themeColors';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export type SegmentedOption<T = string> = {
  value: T;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
};

type SegmentedOptionsProps<T = string> = {
  options: SegmentedOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  style?: ViewStyle;
};

export function SegmentedOptions<T = string>({
  options,
  value,
  onSelect,
  style,
}: SegmentedOptionsProps<T>) {
  return (
    <View style={[styles.wrap, style]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={String(opt.value)}
            activeOpacity={0.8}
            onPress={() => onSelect(opt.value)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            {opt.icon ? (
              <View style={styles.optionIcon}>{opt.icon}</View>
            ) : null}
            <Text
              style={[
                styles.optionLabel,
                selected && styles.optionLabelSelected,
              ]}
            >
              {opt.label}
            </Text>
            {opt.sublabel ? (
              <Text
                style={[
                  styles.optionSublabel,
                  selected && styles.optionSublabelSelected,
                ]}
              >
                {opt.sublabel}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: themeColors.segmentedSelected,
    borderColor: themeColors.segmentedBorder,
  },
  optionIcon: {
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: themeColors.textPrimary,
  },
  optionLabelSelected: {
    color: themeColors.textPrimary,
  },
  optionSublabel: {
    fontSize: 12,
    color: themeColors.textSecondary,
    marginTop: 2,
  },
  optionSublabelSelected: {
    color: themeColors.textSecondary,
  },
});
