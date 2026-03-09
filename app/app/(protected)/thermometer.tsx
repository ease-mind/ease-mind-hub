import { useSymptom, SymptomEntity, UserSymptomRecordEntity } from '@/data-access';
import { useCognitiveSettings, useAuth } from '@/data-access';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { ScreenHeader, ScreenFadeIn } from '@/shared/components';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThermometerModal } from '@/shared/components/ThermometerModal';

import IconCalm from '@/assets/images/icone-calmo.svg';
import IconAlert from '@/assets/images/icone-alerta.svg';
import IconOverload from '@/assets/images/icone-sobrecarregado.svg';

const AddIcon = require('@/assets/images/add.svg').default;

const TAB_BAR_HEIGHT = 64 + 24;

export default function ThermometerScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { themeColors, spacing, fontSize, contrast, complexity } = useCognitiveSettings();
  const { getAllSymptoms, saveUserSymptoms, getLatestUserSymptoms, loading: symptomLoading } = useSymptom();
  const [symptoms, setSymptoms] = useState<SymptomEntity[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const symptomsData = await getAllSymptoms();
      setSymptoms(Array.isArray(symptomsData) ? symptomsData : []);

      if (user?._id) {
        const result = await getLatestUserSymptoms(user._id);
        if (result?.selectedSymptoms) {
          setSelectedSymptoms(result.selectedSymptoms);
        }
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
      setSymptoms([]);
    } finally {
      setLoading(false);
    }
  };

  const getTemperature = () => {
    const count = selectedSymptoms.length;
    if (count === 0) return 0;
    if (count <= 3) return 36;
    if (count <= 7) return 38;
    if (count <= 9) return 40;
    return 40;
  };

  const getTemperatureColor = () => {
    const temp = getTemperature();
    if (temp === 0) return 'rgb(16, 185, 129)';
    if (temp <= 36) return 'rgb(16, 185, 129)';
    if (temp <= 38) return '#FFC107';
    if (temp >= 39) return '#F44336';
    return '#F44336';
  };

  const getTemperatureLevel = () => {
    const temp = getTemperature();
    if (temp === 0) return 'Calmo';
    if (temp <= 36) return 'Calmo';
    if (temp <= 38) return 'Alerta';
    if (temp >= 39) return 'Sobrecarga';
  };

  const getThermometerIcon = () => {
    const temp = getTemperature();
    if (temp === 0 || temp <= 36) return IconCalm;
    if (temp <= 38) return IconAlert;
    return IconOverload;
  };

  const getCategoryCount = (category: string) => {
    return selectedSymptoms.filter((id) => symptoms.find((s) => s.id === id)?.category === category).length;
  };

  const getContrastStyles = () => {
    if (contrast === 'high') {
      return {
        borderWidth: 2,
        borderColor: themeColors.textPrimary,
        shadowOpacity: 0.15,
        fontWeight: '700' as const,
      };
    }
    if (contrast === 'low') {
      return {
        borderWidth: 0,
        borderColor: 'transparent',
        shadowOpacity: 0.05,
        fontWeight: '400' as const,
      };
    }

    return {
      borderWidth: 1,
      borderColor: themeColors.borderDivider,
      shadowOpacity: 0.08,
      fontWeight: '600' as const,
    };
  };

  const contrastStyles = getContrastStyles();

  const handleReset = async () => {
    if (!user?._id) return;

    setSelectedSymptoms([]);

    setSaving(true);
    const data: UserSymptomRecordEntity = {
      userId: user._id,
      selectedSymptoms: [],
      temperature: 0,
      level: 'Calmo',
      timestamp: new Date(),
      categoryCount: {
        communication: 0,
        physical: 0,
        stereotypies: 0,
      }
    };

    try {
      await saveUserSymptoms(data);
      await loadData();
    } catch (err) {
      console.error('Erro ao resetar sintomas:', err);
    } finally {
      setSaving(false);
    }
  };

  const temperaturePercentage = symptoms.length > 0 ? (selectedSymptoms.length / symptoms.length) * 100 : 0;

  const ThermometerHeader = () => (
    <ScreenHeader
      title="Termômetro Sensorial"
      subtitle="Monitore seu estado emocional"
      rightElement={
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.9}
        >
          <AddIcon width={56} height={56} />
        </TouchableOpacity>
      }
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['left', 'right']}>
        <Stack.Screen
          options={{
            header: () => <ThermometerHeader />,
            headerShown: true,
          }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={ColorsPalette.light['coral.700']} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['left', 'right']}>
        <Stack.Screen
          options={{
            header: () => <ThermometerHeader />,
            headerShown: true,
          }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing * 2 }}>
          <MaterialIcons name="error-outline" size={fontSize * 4} color={themeColors.accent} />
          <Text style={{ fontSize, color: themeColors.textSecondary, marginTop: spacing, textAlign: 'center', lineHeight: fontSize + spacing }}>{error}</Text>
          <TouchableOpacity onPress={loadData} style={[styles.retryButton, { marginTop: spacing * 2, paddingHorizontal: spacing * 2, paddingVertical: spacing * 1.5, backgroundColor: themeColors.accent }]}>
            <Text style={{ fontSize, color: '#FFF', fontWeight: 'bold' }}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['left', 'right']}>
      <Stack.Screen
        options={{
          header: () => <ThermometerHeader />,
          headerShown: true,
        }}
      />
      <ScreenFadeIn>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: spacing * 2, paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 }]}>
          <View style={[styles.thermometerSection, { paddingVertical: spacing * 2, paddingHorizontal: spacing * 2 }]}>
            <View style={[styles.thermometerContainer, { marginBottom: spacing / 2 }]}>
              <View style={[styles.thermometerBackground, { backgroundColor: themeColors.sliderTrack }]} />

              <View
                style={[
                  styles.thermometerFill,
                  {
                    height: `${Math.min(temperaturePercentage, 100)}%`,
                    backgroundColor: getTemperatureColor(),
                  },
                ]}
              />

              <View style={[styles.thermometerBulb, { borderColor: getTemperatureColor() }]}>
                {(() => {
                  const IconComponent = getThermometerIcon();
                  return <IconComponent width={48} height={48} />;
                })()}
              </View>
            </View>

            {getTemperatureLevel() && (
              <Text style={[styles.temperatureLevel, { color: getTemperatureColor(), fontSize: fontSize + 18, marginBottom: spacing / 2 }]}>{getTemperatureLevel()}</Text>
            )}

            <Text style={[styles.temperatureDescription, { fontSize, color: themeColors.textSecondary, marginBottom: spacing / 2, lineHeight: fontSize + spacing }]}>
              {getTemperature() === 0 ? 'Clique no ícone no topo para fazer uma avaliação' :
                getTemperature() <= 36 ? 'Você está em um estado tranquilo e equilibrado' :
                  getTemperature() <= 38 ? 'Você está na fase de alerta. Considere fazer uma pausa e praticar técnicas de respiração.' :
                    'Considere fazer uma pausa e praticar técnicas de relaxamento'}
            </Text>

            <View style={[styles.symptomCountContainer, { marginTop: spacing / 2, flexDirection: 'column', alignItems: 'center', gap: spacing }]}>
              <Text style={[styles.symptomCount, { fontSize, color: themeColors.textPrimary, fontWeight: '600', lineHeight: fontSize + spacing, textAlign: 'center' }]}>{selectedSymptoms.length} sintomas identificados</Text>

              {selectedSymptoms.length > 0 && (
                <TouchableOpacity onPress={handleReset} style={[styles.resetButton, { paddingHorizontal: spacing * 2, paddingVertical: spacing, backgroundColor: themeColors.accent }]}>
                  <MaterialCommunityIcons name="refresh" size={fontSize} color="#FFF" />
                  <Text style={[styles.resetButtonText, { fontSize, marginLeft: spacing / 2 }]}>Resetar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {complexity !== 'simple' && (
            <View style={[styles.categoriesContainer, { paddingHorizontal: spacing * 2, gap: spacing, marginBottom: spacing * 2 }]}>
              <View style={[
                styles.categoryCard,
                {
                  backgroundColor: themeColors.cardBackground,
                  padding: spacing * 1.5,
                  marginBottom: 0,
                  borderRadius: spacing * 1.5,
                  borderWidth: contrastStyles.borderWidth,
                  borderColor: contrastStyles.borderColor,
                  shadowOpacity: contrastStyles.shadowOpacity,
                }
              ]}>
                <View style={[styles.categoryHeader, { gap: spacing }]}>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryTitle, { fontSize, color: themeColors.textPrimary, marginBottom: spacing / 2, lineHeight: fontSize + spacing, fontWeight: contrastStyles.fontWeight }]}>Falha na Comunicação</Text>
                  </View>
                </View>
                <View style={[styles.categoryCount, { backgroundColor: themeColors.sliderTrack, paddingHorizontal: spacing * 2, paddingVertical: spacing, borderRadius: spacing }]}>
                  <Text style={[styles.categoryCountNumber, { fontSize: fontSize * 1.5, color: themeColors.accent, fontWeight: contrastStyles.fontWeight }]}>{getCategoryCount('communication')}</Text>
                </View>
              </View>

              <View style={[
                styles.categoryCard,
                {
                  backgroundColor: themeColors.cardBackground,
                  padding: spacing * 1.5,
                  marginBottom: 0,
                  borderRadius: spacing * 1.5,
                  borderWidth: contrastStyles.borderWidth,
                  borderColor: contrastStyles.borderColor,
                  shadowOpacity: contrastStyles.shadowOpacity,
                }
              ]}>
                <View style={[styles.categoryHeader, { gap: spacing }]}>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryTitle, { fontSize, color: themeColors.textPrimary, marginBottom: spacing / 2, lineHeight: fontSize + spacing, fontWeight: contrastStyles.fontWeight }]}>Sintomas Físicos</Text>
                  </View>
                </View>
                <View style={[styles.categoryCount, { backgroundColor: themeColors.sliderTrack, paddingHorizontal: spacing * 2, paddingVertical: spacing, borderRadius: spacing }]}>
                  <Text style={[styles.categoryCountNumber, { fontSize: fontSize * 1.5, color: themeColors.accent, fontWeight: contrastStyles.fontWeight }]}>{getCategoryCount('physical')}</Text>
                </View>
              </View>

              <View style={[
                styles.categoryCard,
                {
                  backgroundColor: themeColors.cardBackground,
                  padding: spacing * 1.5,
                  marginBottom: 0,
                  borderRadius: spacing * 1.5,
                  borderWidth: contrastStyles.borderWidth,
                  borderColor: contrastStyles.borderColor,
                  shadowOpacity: contrastStyles.shadowOpacity,
                }
              ]}>
                <View style={[styles.categoryHeader, { gap: spacing }]}>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryTitle, { fontSize, color: themeColors.textPrimary, marginBottom: spacing / 2, lineHeight: fontSize + spacing, fontWeight: contrastStyles.fontWeight }]}>Aumento de Estereotipias</Text>
                  </View>
                </View>
                <View style={[styles.categoryCount, { backgroundColor: themeColors.sliderTrack, paddingHorizontal: spacing * 2, paddingVertical: spacing, borderRadius: spacing }]}>
                  <Text style={[styles.categoryCountNumber, { fontSize: fontSize * 1.5, color: themeColors.accent, fontWeight: contrastStyles.fontWeight }]}>{getCategoryCount('stereotypies')}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: spacing * 3 }} />
        </ScrollView>
      </ScreenFadeIn>
      <ThermometerModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={loadData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  content: {
    flex: 1,
  },
  scrollContent: {},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  thermometerSection: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  thermometerContainer: {
    position: 'relative',
    width: 140,
    height: 400,
    alignItems: 'center',
    marginBottom: 24,
  },
  thermometerBackground: {
    position: 'absolute',
    width: 120,
    height: 280,
    backgroundColor: '#E5E7EB',
    borderRadius: 60,
    borderWidth: 0,
    top: 0,
  },
  thermometerFill: {
    position: 'absolute',
    width: 120,
    height: 0,
    borderRadius: 60,
    bottom: 120,
    opacity: 0.9,
  },
  thermometerLabel: {
    position: 'absolute',
    zIndex: 2,
  },
  thermometerLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  thermometerBulb: {
    position: 'absolute',
    bottom: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  temperatureLevel: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  temperatureDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  symptomCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  symptomCountContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
    gap: 12,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorsPalette.light['coral.700'],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 40
  },
  categoryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  categoryCount: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  categoryCountNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ColorsPalette.light['coral.500'],
  },
  categoryCountLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: ColorsPalette.light['coral.700'],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});