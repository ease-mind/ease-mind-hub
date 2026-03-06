import { useCognitiveSettings } from '@/shared/contexts';
import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SliderRowProps = {
  labelLeft: string;
  labelRight: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  onValueChange: (value: number) => void;
  markers?: string[];
  valueToLabel?: (value: number) => string;
};

export function SliderRow({
  labelLeft,
  labelRight,
  value,
  minimumValue,
  maximumValue,
  step = 1,
  onValueChange,
  markers = [],
  valueToLabel,
}: SliderRowProps) {
  const { themeColors, spacing, fontSize } = useCognitiveSettings();
  return (
    <View style={[styles.wrap, { marginBottom: spacing }]}>
      <View style={[styles.labels, { marginBottom: spacing / 2 }]}>
        <Text style={[styles.labelLeft, { color: themeColors.textPrimary, fontSize, lineHeight: fontSize + spacing }]}>
          {valueToLabel ? valueToLabel(value) : labelLeft}
        </Text>
        <Text style={[styles.labelRight, { color: themeColors.textSecondary, fontSize, lineHeight: fontSize + spacing }]}>{labelRight}</Text>
      </View>
      <Slider
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        onValueChange={onValueChange}
        minimumTrackTintColor={themeColors.sliderThumb}
        maximumTrackTintColor={themeColors.sliderTrack}
        thumbTintColor={themeColors.sliderThumb}
        style={styles.slider}
      />
      {markers.length > 0 ? (
        <View style={[styles.markers, { marginTop: spacing / 2 }]}>
          {markers.map((m, i) => (
            <Text key={i} style={[styles.marker, { color: themeColors.textMuted, fontSize: Math.max(11, fontSize - 3) }]}>
              {m}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelLeft: {},
  labelRight: {},
  slider: {
    width: '100%',
    height: 32,
  },
  markers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  marker: {},
});
