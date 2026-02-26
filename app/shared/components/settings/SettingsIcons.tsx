import { themeColors } from '@/shared/classes/constants/themeColors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function IconDocument1() {
  return (
    <View style={styles.docWrap}>
      <View style={[styles.docLine, { width: 10 }]} />
    </View>
  );
}

export function IconDocument2() {
  return (
    <View style={styles.docWrap}>
      <View style={[styles.docLine, { width: 10 }]} />
      <View style={[styles.docLine, { width: 8 }]} />
    </View>
  );
}

export function IconDocument3() {
  return (
    <View style={styles.docWrap}>
      <View style={[styles.docLine, { width: 10 }]} />
      <View style={[styles.docLine, { width: 8 }]} />
      <View style={[styles.docLine, { width: 6 }]} />
    </View>
  );
}

export function IconContrastLow() {
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
    backgroundColor: themeColors.textSecondary,
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
