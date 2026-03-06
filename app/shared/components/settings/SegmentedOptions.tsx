import { useCognitiveSettings } from '@/shared/contexts';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const springConfig = { damping: 16, stiffness: 200 };

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
  horizontalCentered?: boolean;
};

function AnimatedOption<T>({
  opt,
  selected,
  onSelect,
  themeColors,
  spacing,
  fontSize,
  optionStyle,
}: {
  opt: SegmentedOption<T>;
  selected: boolean;
  onSelect: (value: T) => void;
  themeColors: { textPrimary: string; textSecondary: string; segmentedSelected: string; segmentedBorder: string };
  spacing: number;
  fontSize: number;
  optionStyle: (object | number)[];
}) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withSpring(selected ? 1.02 : 1, springConfig);
  }, [selected]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onSelect(opt.value)}
        style={[
          ...optionStyle,
          selected && {
            backgroundColor: themeColors.segmentedSelected,
            borderColor: themeColors.segmentedBorder,
          },
        ]}
      >
        {opt.icon ? (
          <View style={[styles.optionIcon, { marginBottom: spacing / 2 }]}>{opt.icon}</View>
        ) : null}
        <Text
          style={[
            styles.optionLabel,
            { color: themeColors.textPrimary, fontSize, lineHeight: fontSize + spacing },
          ]}
        >
          {opt.label}
        </Text>
        {opt.sublabel ? (
          <Text
            style={[
              styles.optionSublabel,
              { color: themeColors.textSecondary, marginTop: spacing / 2, fontSize: Math.max(12, fontSize - 2), lineHeight: fontSize + spacing / 2 },
            ]}
          >
            {opt.sublabel}
          </Text>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

const OPTION_BASE_WIDTH = 140;

export function SegmentedOptions<T = string>({
  options,
  value,
  onSelect,
  style,
  horizontalCentered = false,
}: SegmentedOptionsProps<T>) {
  const { themeColors, spacing, fontSize } = useCognitiveSettings();
  const wrapStyle = horizontalCentered
    ? [styles.wrap, styles.wrapCentered, { gap: spacing }, style]
    : [styles.wrap, { gap: spacing }, style];
  const optionStyle = horizontalCentered
    ? [styles.option, styles.optionCentered, { padding: spacing }]
    : [styles.option, { padding: spacing }];
  return (
    <View style={wrapStyle}>
      {options.map((opt) => (
        <AnimatedOption
          key={String(opt.value)}
          opt={opt}
          selected={opt.value === value}
          onSelect={onSelect}
          themeColors={themeColors}
          spacing={spacing}
          fontSize={fontSize}
          optionStyle={optionStyle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wrapCentered: {
    flexWrap: 'nowrap',
    justifyContent: 'center',
    width: '100%',
  },
  option: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCentered: {
    flex: 0,
    minWidth: OPTION_BASE_WIDTH,
    maxWidth: OPTION_BASE_WIDTH,
  },
  optionIcon: {},
  optionLabel: {
    fontWeight: '600',
  },
  optionSublabel: {},
});
