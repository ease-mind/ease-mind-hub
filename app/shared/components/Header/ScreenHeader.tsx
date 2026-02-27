import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
};

/**
 * Barra superior no estilo do projeto antigo: logo à esquerda, título e subtítulo, slot opcional à direita.
 * Usado em termômetro, perfil, tarefas e configurações.
 */
export function ScreenHeader({ title, subtitle, rightElement }: ScreenHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo-auth.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: ColorsPalette.light['white.main'],
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logo: {
    width: 40,
    height: 34,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: ColorsPalette.light['grey.900'],
  },
  subtitle: {
    fontSize: 14,
    color: ColorsPalette.light['grey.500'],
    marginTop: 2,
  },
  right: {
    marginLeft: 8,
  },
});
