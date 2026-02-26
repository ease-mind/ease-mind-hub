import { themeColors } from '@/shared/classes/constants/themeColors';
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
  return (
    <View style={styles.wrap}>
      <View style={styles.labels}>
        <Text style={styles.labelLeft}>
          {valueToLabel ? valueToLabel(value) : labelLeft}
        </Text>
        <Text style={styles.labelRight}>{labelRight}</Text>
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
        <View style={styles.markers}>
          {markers.map((m, i) => (
            <Text key={i} style={styles.marker}>
              {m}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  labelLeft: {
    fontSize: 14,
    color: themeColors.textPrimary,
  },
  labelRight: {
    fontSize: 14,
    color: themeColors.textSecondary,
  },
  slider: {
    width: '100%',
    height: 32,
  },
  markers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  marker: {
    fontSize: 11,
    color: themeColors.textMuted,
  },
});
