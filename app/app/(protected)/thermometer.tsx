import { useAuth, symptomService, Symptom, UserSymptomRecord } from '@/shared';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ThermometerScreen() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSymptoms();
  }, []);

  useEffect(() => {
    if (user?._id) {
      handleSelectedSymptoms();
    }
  }, [user]);

  useEffect(() => {
    if (selectedSymptoms.length > 5) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [selectedSymptoms]);

  useEffect(() => {
    if (selectedSymptoms.length > 0 && user?._id) {
      const timer = setTimeout(() => {
        handleSaveSymptoms();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedSymptoms, user]);

  const handleSelectedSymptoms = async () => {
    if (!user?._id) return;

    const result = await symptomService.getLatestUserSymptoms(user._id);

    if (result?.selectedSymptoms) {
      setSelectedSymptoms(result.selectedSymptoms);
    }
  };

  const loadSymptoms = async () => {
    setLoading(true);
    try {
      const data = await symptomService.getAll();
      setSymptoms(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar sintomas');
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]
    );
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

  const handleSaveSymptoms = async () => {
    if (!user?._id || selectedSymptoms.length === 0) return;

    setSaving(true);
    const data: UserSymptomRecord = {
      userId: user._id,
      selectedSymptoms,
      temperature: getTemperature(),
      level: getTemperatureLevel() || 'Calmo',
      timestamp: new Date(),
      categoryCount: {
        communication: getCategoryCount('communication'),
        physical: getCategoryCount('physical'),
        stereotypies: getCategoryCount('stereotypies'),
      },
    };

    try {
      await symptomService.saveUserSymptoms(data);
    } catch (err: any) {
      console.error('Erro ao salvar sintomas:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    Alert.alert('Resetar Sintomas', 'Deseja limpar todos os sintomas selecionados?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Resetar',
        style: 'destructive',
        onPress: () => {
          setSelectedSymptoms([]);
          setShowAlert(false);
        },
      },
    ]);
  };

  const temperaturePercentage = symptoms.length > 0 ? (selectedSymptoms.length / symptoms.length) * 100 : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>e.</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={ColorsPalette.light['lime.700']} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>e.</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <MaterialIcons name="error-outline" size={64} color={ColorsPalette.light['coral.500']} />
          <Text style={{ fontSize: 16, color: '#666', marginTop: 16, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity onPress={loadSymptoms} style={styles.retryButton}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>e.</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Como você está se sentindo?</Text>
          <Text style={styles.subtitle}>Avalie seus sintomas e monitore seu estado emocional</Text>
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
            {getTemperature() === 0 ? 'Selecione os sintomas para avaliar' : 
             getTemperature() <= 36 ? 'Você está em um estado tranquilo e equilibrado' :
             getTemperature() <= 38 ? 'Fique atento aos sinais de alerta' :
             'Considere fazer uma pausa e praticar técnicas de relaxamento'}
          </Text>

          <Text style={styles.symptomCount}>{selectedSymptoms.length} sintomas identificados</Text>
        </View>

        {showAlert && (
          <View style={styles.alertBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialIcons name="warning" size={24} color="#FFC107" />
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8, color: '#856404' }}>Atenção: Sinais de Alerta</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#856404' }}>
              Você está entrando na fase de alerta. Considere fazer uma pausa.
            </Text>
          </View>
        )}

        <View style={styles.categoriesContainer}>
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <MaterialIcons name="cancel" size={24} color={ColorsPalette.light['coral.500']} />
              <Text style={styles.categoryTitle}>Falha na Comunicação</Text>
            </View>
            <View style={styles.symptomsGrid}>
              {symptoms
                .filter((s) => s.category === 'communication')
                .map((symptom) => (
                  <TouchableOpacity
                    key={symptom.id}
                    onPress={() => handleSymptomToggle(symptom.id)}
                    style={[
                      styles.symptomCard,
                      selectedSymptoms.includes(symptom.id) && styles.symptomCardSelected,
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View
                        style={[
                          styles.radio,
                          selectedSymptoms.includes(symptom.id) && styles.radioSelected,
                        ]}
                      >
                        {selectedSymptoms.includes(symptom.id) && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.symptomText}>{symptom.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <Feather name="zap" size={24} color="#FFC107" />
              <Text style={styles.categoryTitle}>Sintomas Físicos</Text>
            </View>
            <View style={styles.symptomsGrid}>
              {symptoms
                .filter((s) => s.category === 'physical')
                .map((symptom) => (
                  <TouchableOpacity
                    key={symptom.id}
                    onPress={() => handleSymptomToggle(symptom.id)}
                    style={[
                      styles.symptomCard,
                      selectedSymptoms.includes(symptom.id) && styles.symptomCardSelected,
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View
                        style={[
                          styles.radio,
                          selectedSymptoms.includes(symptom.id) && styles.radioSelected,
                        ]}
                      >
                        {selectedSymptoms.includes(symptom.id) && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.symptomText}>{symptom.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#2196F3" />
              <Text style={styles.categoryTitle}>Aumento de Estereotipias</Text>
            </View>
            <View style={styles.symptomsGrid}>
              {symptoms
                .filter((s) => s.category === 'stereotypies')
                .map((symptom) => (
                  <TouchableOpacity
                    key={symptom.id}
                    onPress={() => handleSymptomToggle(symptom.id)}
                    style={[
                      styles.symptomCard,
                      selectedSymptoms.includes(symptom.id) && styles.symptomCardSelected,
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View
                        style={[
                          styles.radio,
                          selectedSymptoms.includes(symptom.id) && styles.radioSelected,
                        ]}
                      >
                        {selectedSymptoms.includes(symptom.id) && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.symptomText}>{symptom.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>

        {selectedSymptoms.length > 0 && (
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <MaterialCommunityIcons name="reload" size={20} color="#FFF" />
            <Text style={styles.resetButtonText}>Resetar Sintomas</Text>
          </TouchableOpacity>
        )}

        {saving && (
          <View style={styles.savingIndicator}>
            <ActivityIndicator size="small" color={ColorsPalette.light['coral.500']} />
            <Text style={styles.savingText}>Salvando automaticamente...</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ColorsPalette.light['coral.500'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    fontStyle: 'italic',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ColorsPalette.light['coral.500'],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
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
  alertBanner: {
    backgroundColor: '#FFF3CD',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  symptomsGrid: {
    gap: 12,
  },
  symptomCard: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  symptomCardSelected: {
    borderColor: ColorsPalette.light['coral.500'],
    backgroundColor: '#FFF1F2',
  },
  symptomText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: ColorsPalette.light['coral.500'],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ColorsPalette.light['coral.500'],
  },
  resetButton: {
    backgroundColor: ColorsPalette.light['coral.500'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: ColorsPalette.light['lime.700'],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  savingText: {
    fontSize: 14,
    color: '#6B7280',
  },
});