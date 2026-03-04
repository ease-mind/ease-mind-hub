import { useAuth, symptomService, Symptom, UserSymptomRecord, useCognitiveSettings } from '@/shared';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { ScreenHeader } from '@/shared/components';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThermometerModal } from '@/shared/components/ThermometerModal';

import IconCalm from '@/assets/images/icone-calmo.svg';
import IconAlert from '@/assets/images/icone-alerta.svg';
import IconOverload from '@/assets/images/icone-sobrecarregado.svg';

const AddIcon = require('@/assets/images/add.svg').default;

export default function ThermometerScreen() {
  const { user } = useAuth();
  const { settings } = useCognitiveSettings();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
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
      const symptomsData = await symptomService.getAll();
      setSymptoms(symptomsData);
      
      if (user?._id) {
        const result = await symptomService.getLatestUserSymptoms(user._id);
        if (result?.selectedSymptoms) {
          setSelectedSymptoms(result.selectedSymptoms);
        }
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
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

  const handleReset = async () => {
    if (!user?._id) return;
    
    setSelectedSymptoms([]);
    
    setSaving(true);
    const data: UserSymptomRecord = {
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
      await symptomService.saveUserSymptoms(data);
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
  const getSpacing = () => {
    switch (settings.spacing) {
      case 24: return { base: 24, large: 32, small: 16, card: 24 };
      case 12: return { base: 12, large: 16, small: 8, card: 16 };
      default: return { base: 20, large: 24, small: 12, card: 20 };
    }
  };

  const getFontSizes = () => {
    const multiplier = settings.fontSize / 18;
    return {
      title: Math.round(28 * multiplier),
      subtitle: Math.round(16 * multiplier),
      level: Math.round(32 * multiplier),
      description: Math.round(16 * multiplier),
      count: Math.round(18 * multiplier),
      categoryTitle: Math.round(16 * multiplier),
      categoryCount: Math.round(24 * multiplier),
      button: Math.round(14 * multiplier),
    };
  };

  const spacing = getSpacing();
  const fontSize = getFontSizes();

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
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
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <Stack.Screen
          options={{
            header: () => <ThermometerHeader />,
            headerShown: true,
          }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <MaterialIcons name="error-outline" size={64} color={ColorsPalette.light['coral.500']} />
          <Text style={{ fontSize: 16, color: '#666', marginTop: 16, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity onPress={loadData} style={styles.retryButton}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Stack.Screen
        options={{
          header: () => <ThermometerHeader />,
          headerShown: true,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: spacing.large }]}>
        <View style={[styles.thermometerSection, { paddingVertical: spacing.large, paddingHorizontal: spacing.base }]}>
          <View style={styles.thermometerContainer}>
            <View style={styles.thermometerBackground} />

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
                return <IconComponent width={60} height={60} />;
              })()}
            </View>
          </View>

          {getTemperatureLevel() && (
            <Text style={[styles.temperatureLevel, { color: getTemperatureColor(), fontSize: fontSize.level }]}>{getTemperatureLevel()}</Text>
          )}

          <Text style={[styles.temperatureDescription, { fontSize: fontSize.description, paddingHorizontal: spacing.base, marginBottom: spacing.small }]}>
            {getTemperature() === 0 ? 'Clique no ícone no topo para fazer uma avaliação' : 
             getTemperature() <= 36 ? 'Você está em um estado tranquilo e equilibrado' :
             getTemperature() <= 38 ? 'Fique atento aos sinais de alerta' :
             'Considere fazer uma pausa e praticar técnicas de relaxamento'}
          </Text>

          <View style={[styles.symptomCountContainer, { marginTop: spacing.small }]}>
            <Text style={[styles.symptomCount, { fontSize: fontSize.count }]}>{selectedSymptoms.length} sintomas identificados</Text>
            
            {selectedSymptoms.length > 0 && (
              <TouchableOpacity onPress={handleReset} style={[styles.resetButton, { paddingHorizontal: spacing.small, paddingVertical: spacing.small / 2 }]}>
                <MaterialCommunityIcons name="refresh" size={18} color="#FFF" />
                <Text style={[styles.resetButtonText, { marginLeft: spacing.small / 2, fontSize: fontSize.button }]}>Resetar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={[styles.categoriesContainer, { paddingHorizontal: spacing.base, gap: spacing.small }]}>
          <View style={[styles.categoryCard, { padding: spacing.card, marginBottom: spacing.small / 2 }]}>
            <View style={[styles.categoryHeader, { gap: spacing.small }]}>
              <MaterialIcons name="cancel" size={24} color={ColorsPalette.light['coral.500']} />
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryTitle, { fontSize: fontSize.categoryTitle }]}>Falha na Comunicação</Text>
              </View>
            </View>
            <View style={[styles.categoryCount, { paddingHorizontal: spacing.small, paddingVertical: spacing.small }]}>
              <Text style={[styles.categoryCountNumber, { fontSize: fontSize.categoryCount }]}>{getCategoryCount('communication')}</Text>
            </View>
          </View>

          <View style={[styles.categoryCard, { padding: spacing.card, marginBottom: spacing.small / 2 }]}>
            <View style={[styles.categoryHeader, { gap: spacing.small }]}>
              <Feather name="zap" size={24} color="#FFC107" />
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryTitle, { fontSize: fontSize.categoryTitle }]}>Sintomas Físicos</Text>
              </View>
            </View>
            <View style={[styles.categoryCount, { paddingHorizontal: spacing.small, paddingVertical: spacing.small }]}>
              <Text style={[styles.categoryCountNumber, { fontSize: fontSize.categoryCount }]}>{getCategoryCount('physical')}</Text>
            </View>
          </View>

          <View style={[styles.categoryCard, { padding: spacing.card, marginBottom: spacing.small / 2 }]}>
            <View style={[styles.categoryHeader, { gap: spacing.small }]}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#2196F3" />
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryTitle, { fontSize: fontSize.categoryTitle }]}>Aumento de Estereotipias</Text>
              </View>
            </View>
            <View style={[styles.categoryCount, { paddingHorizontal: spacing.small, paddingVertical: spacing.small }]}>
              <Text style={[styles.categoryCountNumber, { fontSize: fontSize.categoryCount }]}>{getCategoryCount('stereotypies')}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: spacing.large }} />
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 32,
  },
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
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  thermometerContainer: {
    position: 'relative',
    width: 200,
    height: 380,
    alignItems: 'center',
    marginBottom: 24,
  },
  thermometerBackground: {
    position: 'absolute',
    width: 180,
    height: 280,
    backgroundColor: '#E5E7EB',
    borderRadius: 90,
    borderWidth: 0,
    top: 0,
  },
  thermometerFill: {
    position: 'absolute',
    width: 180,
    height: 0,
    borderRadius: 90,
    bottom: 100,
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
    width: 100,
    height: 100,
    borderRadius: 50,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
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