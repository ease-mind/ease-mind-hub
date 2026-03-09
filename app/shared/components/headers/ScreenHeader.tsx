import { useCognitiveSettings } from '@/data-access';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
};

export function ScreenHeader({ title, subtitle, rightElement }: ScreenHeaderProps) {
  const { themeColors, spacing, fontSize } = useCognitiveSettings();
  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background, borderBottomWidth: themeColors.borderDividerWidth, borderBottomColor: themeColors.borderDivider }]}>
      <View style={[styles.header, { paddingHorizontal: spacing, paddingVertical: spacing }]}>
        <Image
          source={require('@/assets/images/logo-auth.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={[styles.headerText, { marginLeft: spacing }]}>
          <Text style={[styles.title, { color: themeColors.textPrimary, fontSize: Math.max(20, fontSize + 6), lineHeight: fontSize + spacing + 1 }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: themeColors.textSecondary, fontSize, marginTop: spacing / 12, lineHeight: fontSize + spacing }]}>{subtitle}</Text> : null}
        </View>
        {rightElement ? (
          <View style={styles.rightIcon}>{rightElement}</View>
        ) : (
          <View style={styles.rightIcon} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 34,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {},
  right: {
    marginLeft: 8,
  },
  rightIcon: {
    width: 56,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
