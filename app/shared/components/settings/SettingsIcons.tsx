import { useCognitiveSettings } from '@/shared/contexts';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function IconDocument1() {
  const { themeColors } = useCognitiveSettings();
  return (
    <View style={styles.docWrap}>
      <View style={[styles.docLine, { width: 10, backgroundColor: themeColors.textSecondary }]} />
    </View>
  );
}

export function IconDocument2() {
  const { themeColors } = useCognitiveSettings();
  return (
    <View style={styles.docWrap}>
      <View style={[styles.docLine, { width: 10, backgroundColor: themeColors.textSecondary }]} />
      <View style={[styles.docLine, { width: 8, backgroundColor: themeColors.textSecondary }]} />
    </View>
  );
}

export function IconDocument3() {
  const { themeColors } = useCognitiveSettings();
  return (
    <View style={styles.docWrap}>
      <View style={[styles.docLine, { width: 10, backgroundColor: themeColors.textSecondary }]} />
      <View style={[styles.docLine, { width: 8, backgroundColor: themeColors.textSecondary }]} />
      <View style={[styles.docLine, { width: 6, backgroundColor: themeColors.textSecondary }]} />
    </View>
  );
}

export function IconContrastLow() {
  const { themeColors } = useCognitiveSettings();
  return (
    <View
      style={[
        styles.circle,
        {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: themeColors.textMuted,
        },
      ]}
    />
  );
}

export function IconContrastNormal() {
  const { themeColors } = useCognitiveSettings();
  return (
    <View style={[styles.circle, { backgroundColor: themeColors.accentOrange }]}>
      <View style={styles.circleInner} />
    </View>
  );
}

export function IconContrastHigh() {
  return (
    <View style={[styles.circle, { backgroundColor: '#1F2937' }]} />
  );
}

export function IconLightbulb() {
  const { themeColors } = useCognitiveSettings();
  return (
    <Text style={[styles.icon, { color: themeColors.textPrimary }]}>💡</Text>
  );
}

const styles = StyleSheet.create({
  docWrap: {
    gap: 2,
  },
  docLine: {
    height: 2,
    borderRadius: 1,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  circleInner: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 20,
  },
});
