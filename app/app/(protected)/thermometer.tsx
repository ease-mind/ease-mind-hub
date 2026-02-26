import { useAuth, symptomService, Symptom, UserSymptomRecord } from '@/shared';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { ScreenHeader } from '@/shared/components';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThermometerModal } from '@/shared/components/ThermometerModal';

export default function ThermometerScreen() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCalmAlert, setShowCalmAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
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
    if (temp === 0) return '#E0E0E0';
    if (temp <= 36) return '#4CAF50';
    if (temp <= 38) return '#FFC107';
    if (temp >= 39) return '#FF9800';
    return '#FF4353';
  };

  const getTemperatureLevel = () => {
    const temp = getTemperature();
    if (temp === 0) return '';
    if (temp <= 36) return 'Calmo';
    if (temp <= 38) return 'Alerta';
    if (temp >= 39) return 'Sobrecarga';
  };

  const getEmoji = () => {
    if (selectedSymptoms.length === 0) return '😊';
    if (getTemperature() <= 36) return '😊';
    if (getTemperature() <= 38) return '😐';
    if (getTemperature() <= 40) return '😰';
    return '😟';
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

  useEffect(() => {
    const temp = getTemperature();
    
    if (temp > 0 && temp <= 36) {
      setShowCalmAlert(true);
      setShowWarningAlert(false);
    } else if (temp > 38) {
      setShowWarningAlert(true);
      setShowCalmAlert(false);
    } else {
      setShowCalmAlert(false);
      setShowWarningAlert(false);
    }
  }, [selectedSymptoms]);

  const temperaturePercentage = symptoms.length > 0 ? (selectedSymptoms.length / symptoms.length) * 100 : 0;

  const ThermometerHeader = () => (
    <ScreenHeader
      title="Termômetro Sensorial"
      subtitle="Monitore seu estado emocional"
      rightElement={
        <TouchableOpacity onPress={() => setModalVisible(true)} hitSlop={12}>
          <Feather name="plus-circle" size={24} color={ColorsPalette.light['coral.700']} />
        </TouchableOpacity>
      }
    />
  );

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Termômetro Sensorial</Text>
          <Text style={styles.subtitle}>Monitore seu estado emocional e identifique sinais de sobrecarga</Text>
        </View>

        <View style={styles.thermometerSection}>
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

            <View style={[styles.thermometerLabel, { top: 40 }]}>
              <Text style={styles.thermometerLabelText}>Sobrecarga</Text>
            </View>

            <View style={[styles.thermometerLabel, { top: '50%' }]}>
              <Text style={styles.thermometerLabelText}>Alerta</Text>
            </View>

            <View style={[styles.thermometerBulb, { borderColor: getTemperatureColor() }]}>
              <Text style={{ fontSize: 48 }}>{getEmoji()}</Text>
            </View>
          </View>

          {getTemperatureLevel() && (
            <Text style={[styles.temperatureLevel, { color: getTemperatureColor() }]}>{getTemperatureLevel()}</Text>
          )}

          <Text style={styles.temperatureDescription}>
            {getTemperature() === 0 ? 'Clique no ícone no topo para fazer uma avaliação' : 
             getTemperature() <= 36 ? 'Você está em um estado tranquilo e equilibrado' :
             getTemperature() <= 38 ? 'Fique atento aos sinais de alerta' :
             'Considere fazer uma pausa e praticar técnicas de relaxamento'}
          </Text>

          <View style={styles.symptomCountContainer}>
            <Text style={styles.symptomCount}>{selectedSymptoms.length} sintomas identificados</Text>
            
            {selectedSymptoms.length > 0 && (
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <MaterialCommunityIcons name="refresh" size={18} color="#FFF" />
                <Text style={styles.resetButtonText}>Resetar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <MaterialIcons name="cancel" size={24} color={ColorsPalette.light['coral.500']} />
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>Falha na Comunicação</Text>
                <Text style={styles.categoryDescription}>Dificuldades de expressão e compreensão</Text>
              </View>
            </View>
            <View style={styles.categoryCount}>
              <Text style={styles.categoryCountNumber}>{getCategoryCount('communication')}</Text>
            </View>
          </View>

          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <Feather name="zap" size={24} color="#FFC107" />
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>Sintomas Físicos</Text>
                <Text style={styles.categoryDescription}>Manifestações corporais de estresse</Text>
              </View>
            </View>
            <View style={styles.categoryCount}>
              <Text style={styles.categoryCountNumber}>{getCategoryCount('physical')}</Text>
            </View>
          </View>

          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#2196F3" />
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>Aumento de Estereotipias</Text>
                <Text style={styles.categoryDescription}>Comportamentos repetitivos intensificados</Text>
              </View>
            </View>
            <View style={styles.categoryCount}>
              <Text style={styles.categoryCountNumber}>{getCategoryCount('stereotypies')}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
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