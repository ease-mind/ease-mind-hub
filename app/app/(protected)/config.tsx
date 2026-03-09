import { ScreenHeader, ScreenFadeIn } from '@/shared/components';
import {
  IconContrastHigh,
  IconContrastLow,
  IconContrastNormal,
  IconDocument1,
  IconDocument3,
  SegmentedOptions,
  SettingsCard,
  SliderRow,
} from '@/shared/components/settings';
import { useCognitiveSettings, useCognitiveSettingsData } from '@/data-access';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EasemindButton } from '@/shared/ui/Button';
import {
  CognitiveContrast,
  CognitiveSettingsData,
} from '@/shared/services/cognitiveSettingsService';

type ComplexityLevel = 'simples' | 'completo';
type ContrastLevel = 'baixo' | 'normal' | 'alto';

const espacamentoMarkers = ['12px', '14px', '18px'];
const fontMarkers = ['14px', '16px', '18px'];
const SPACING_OPTIONS: (12 | 14 | 18)[] = [12, 14, 18];
const FONT_SIZE_OPTIONS: (14 | 16 | 18)[] = [14, 16, 18];

function spacingToSliderIndex(spacing: 12 | 14 | 18): number {
  const i = SPACING_OPTIONS.indexOf(spacing);
  return i >= 0 ? i : 0;
}

function fontSizeToSliderIndex(fontSize: 14 | 16 | 18): number {
  const i = FONT_SIZE_OPTIONS.indexOf(fontSize);
  return i >= 0 ? i : 1;
}

const mapComplexityFromBackend = (value: CognitiveSettingsData['complexity']): ComplexityLevel => {
  return value === 'complete' ? 'completo' : 'simples';
};

const mapComplexityToBackend = (value: ComplexityLevel): CognitiveSettingsData['complexity'] => {
  return value === 'completo' ? 'complete' : 'simple';
};

const mapContrastFromBackend = (value: CognitiveContrast): ContrastLevel => {
  if (value === 'low') return 'baixo';
  if (value === 'high') return 'alto';
  return 'normal';
};

const mapContrastToBackend = (value: ContrastLevel): CognitiveContrast => {
  if (value === 'baixo') return 'low';
  if (value === 'alto') return 'high';
  return 'normal';
};

const SECTIONS = [
  'complexidade',
  'contraste',
  'espacamento',
  'tamanhoFonte',
] as const;

const TAB_BAR_HEIGHT = 64 + 24;

export default function ConfigScreen() {
  const insets = useSafeAreaInsets();
  const { themeColors, spacing, updateState: updateContextState, loadSettings } = useCognitiveSettings();
  const { getSettings, updateSettings, resetSettings, loading: apiLoading } = useCognitiveSettingsData();
  const [complexidade, setComplexidade] = useState<ComplexityLevel>('completo');
  const [contraste, setContraste] = useState<ContrastLevel>('normal');
  const [espacamento, setEspacamento] = useState<12 | 14 | 18>(12);
  const [tamanhoFonte, setTamanhoFonte] = useState<14 | 16 | 18>(16);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [simpleSectionIndex, setSimpleSectionIndex] = useState(0);

  const isSimpleLayout = complexidade === 'simples';

  const getEspacamentoLabel = (v: number) => {
    if (v <= 12) return 'Pequeno';
    if (v <= 14) return 'Normal';
    return 'Grande';
  };

  const getFontLabel = (v: number) => {
    if (v <= 14) return 'Pequeno';
    if (v <= 16) return 'Médio';
    return 'Grande';
  };

  const normalizeFontSize = (n: number): 14 | 16 | 18 => {
    if (n === 14 || n === 16 || n === 18) return n;
    if (n <= 15) return 14;
    if (n <= 17) return 16;
    return 18;
  };

  const normalizeSpacing = (n: number): 12 | 14 | 18 => {
    if (n === 12 || n === 14 || n === 18) return n;
    if (n <= 13) return 12;
    if (n <= 16) return 14;
    return 18;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (!isMounted) return;
        setComplexidade(mapComplexityFromBackend(settings.complexity));
        setContraste(mapContrastFromBackend(settings.contrast));
        setEspacamento(normalizeSpacing(Number(settings.spacing) || 12));
        setTamanhoFonte(normalizeFontSize(Number(settings.fontSize) || 14));
      } catch {
        Alert.alert(
          'Erro',
          'Não foi possível carregar suas configurações cognitivas. Serão usados os valores padrão.',
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, [getSettings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        complexity: mapComplexityToBackend(complexidade),
        contrast: mapContrastToBackend(contraste),
        spacing: espacamento,
        fontSize: tamanhoFonte,
      };

      const updated = await updateSettings(payload);
      setComplexidade(mapComplexityFromBackend(updated.complexity));
      setContraste(mapContrastFromBackend(updated.contrast));
      setEspacamento(normalizeSpacing(Number(updated.spacing) || 12));
      setTamanhoFonte(normalizeFontSize(Number(updated.fontSize) || 14));
      updateContextState({
        complexity: mapComplexityToBackend(complexidade),
        contrast: mapContrastToBackend(contraste),
        spacing: espacamento,
        fontSize: tamanhoFonte,
      });
      await loadSettings();
      Alert.alert('Configurações salvas', 'Suas preferências cognitivas foram atualizadas.');
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível salvar suas configurações cognitivas. Tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setResetting(true);
      const settings = await resetSettings();
      setComplexidade(mapComplexityFromBackend(settings.complexity));
      setContraste(mapContrastFromBackend(settings.contrast));
      setEspacamento(normalizeSpacing(Number(settings.spacing) || 12));
      setTamanhoFonte(normalizeFontSize(Number(settings.fontSize) || 14));
      updateContextState({
        complexity: settings.complexity,
        contrast: settings.contrast,
        spacing: normalizeSpacing(Number(settings.spacing) || 12),
        fontSize: normalizeFontSize(Number(settings.fontSize) || 14),
      });
      await loadSettings();
      Alert.alert(
        'Configurações restauradas',
        'Suas preferências cognitivas foram restauradas para os valores padrão.',
      );
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível restaurar as configurações cognitivas. Tente novamente.',
      );
    } finally {
      setResetting(false);
    }
  };

  const renderSectionComplexidade = () => (
    <SettingsCard
      title="Nível de Complexidade da Interface"
      subtitle="Simples: menos informações. Completo: todas as funções (padrão)."
      icon={<Feather name="layers" size={24} color={themeColors.accentOrange} />}
    >
      <SegmentedOptions
        options={[
          {
            value: 'simples' as ComplexityLevel,
            label: 'Simples',
            sublabel: 'Layout reduzido',
            icon: <IconDocument1 />,
          },
          {
            value: 'completo' as ComplexityLevel,
            label: 'Completo',
            sublabel: 'Padrão do app',
            icon: <IconDocument3 />,
          },
        ]}
        value={complexidade}
        onSelect={setComplexidade}
        horizontalCentered
      />
    </SettingsCard>
  );

  const renderSectionContraste = () => (
    <SettingsCard
      title="Contraste"
      subtitle="Ajuste o contraste visual da interface"
      icon={<Feather name="sun" size={24} color={themeColors.accentOrange} />}
    >
      <SegmentedOptions
        options={[
          { value: 'baixo' as ContrastLevel, label: 'Baixo', sublabel: 'Suave', icon: <IconContrastLow /> },
          { value: 'normal' as ContrastLevel, label: 'Normal', sublabel: 'Padrão', icon: <IconContrastNormal /> },
          { value: 'alto' as ContrastLevel, label: 'Alto', sublabel: 'Máximo', icon: <IconContrastHigh /> },
        ]}
        value={contraste}
        onSelect={setContraste}
      />
    </SettingsCard>
  );

  const renderSectionEspacamento = () => (
    <SettingsCard
      title="Espaçamento"
      subtitle="Controle o espaço entre elementos (afeta todas as telas)"
      icon={<Feather name="maximize-2" size={24} color={themeColors.accent} />}
    >
      <SliderRow
        labelLeft={`Espaçamento: ${espacamento}px`}
        labelRight={getEspacamentoLabel(espacamento)}
        value={spacingToSliderIndex(espacamento)}
        minimumValue={0}
        maximumValue={2}
        step={1}
        onValueChange={(v) => setEspacamento(SPACING_OPTIONS[Math.round(v)] ?? 12)}
        markers={espacamentoMarkers}
        valueToLabel={(v) => `Espaçamento: ${SPACING_OPTIONS[Math.round(v)] ?? 12}px`}
      />
    </SettingsCard>
  );

  const renderSectionTamanhoFonte = () => (
    <SettingsCard
      title="Tamanho da Fonte"
      subtitle="Ajuste o tamanho do texto (afeta todas as telas)"
      icon={<Feather name="type" size={24} color={themeColors.accent} />}
    >
      <SliderRow
        labelLeft={`Tamanho: ${tamanhoFonte}px`}
        labelRight={getFontLabel(tamanhoFonte)}
        value={fontSizeToSliderIndex(tamanhoFonte)}
        minimumValue={0}
        maximumValue={2}
        step={1}
        onValueChange={(v) => setTamanhoFonte(FONT_SIZE_OPTIONS[Math.round(v)] ?? 14)}
        markers={fontMarkers}
        valueToLabel={(v) => `Tamanho: ${FONT_SIZE_OPTIONS[Math.round(v)] ?? 14}px`}
      />
      <View style={[styles.exemploTexto, { padding: espacamento }]}>
        <Text style={[styles.exemploTextoInner, { fontSize: tamanhoFonte, color: themeColors.textPrimary }]}>
          Exemplo de texto com o tamanho selecionado
        </Text>
      </View>
    </SettingsCard>
  );

  const renderSectionByIndex = (index: number) => {
    switch (SECTIONS[index]) {
      case 'complexidade':
        return renderSectionComplexidade();
      case 'contraste':
        return renderSectionContraste();
      case 'espacamento':
        return renderSectionEspacamento();
      case 'tamanhoFonte':
        return renderSectionTamanhoFonte();
      default:
        return null;
    }
  };

  const sectionTitles: Record<(typeof SECTIONS)[number], string> = {
    complexidade: 'Nível de complexidade',
    contraste: 'Contraste',
    espacamento: 'Espaçamento',
    tamanhoFonte: 'Tamanho da fonte',
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <ScreenHeader
              title="Configurações"
              subtitle="Personalize o aplicativo"
            />
          ),
          headerShown: true,
        }}
      />
      <ScreenFadeIn>
      <ScrollView
        style={[styles.scroll, { backgroundColor: themeColors.background }]}
        contentContainerStyle={[styles.scrollContent, { padding: spacing, paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {isSimpleLayout ? (
          <>
            <View style={[styles.simpleSectionHeader, { marginBottom: spacing }]}>
              <Text style={[styles.simpleSectionTitle, { color: themeColors.textPrimary }]}>
                {sectionTitles[SECTIONS[simpleSectionIndex]]}
              </Text>
              <Text style={[styles.simpleSectionCounter, { color: themeColors.textMuted }]}>
                {simpleSectionIndex + 1} / {SECTIONS.length}
              </Text>
            </View>
            <View style={styles.simpleSectionContent}>
              {renderSectionByIndex(simpleSectionIndex)}
            </View>
            <View style={[styles.simpleNav, { marginBottom: spacing }]}>
              <TouchableOpacity
                style={[styles.simpleNavBtn, simpleSectionIndex === 0 && styles.simpleNavBtnDisabled]}
                onPress={() => setSimpleSectionIndex((i) => Math.max(0, i - 1))}
                disabled={simpleSectionIndex === 0}
              >
                <Feather name="chevron-left" size={24} color={themeColors.accent} />
                <Text style={[styles.simpleNavBtnText, { color: themeColors.accent }]}>Anterior</Text>
              </TouchableOpacity>
              {simpleSectionIndex < SECTIONS.length - 1 ? (
                <TouchableOpacity
                  style={styles.simpleNavBtn}
                  onPress={() => setSimpleSectionIndex((i) => i + 1)}
                >
                  <Text style={[styles.simpleNavBtnText, { color: themeColors.accent }]}>Próximo</Text>
                  <Feather name="chevron-right" size={24} color={themeColors.accent} />
                </TouchableOpacity>
              ) : (
                <View style={styles.simpleNavBtn} />
              )}
            </View>
            {simpleSectionIndex === SECTIONS.length - 1 && (
              <View style={[styles.footer, { marginTop: spacing / 2, gap: spacing / 2 }]}>
                <EasemindButton
                  variant="primary"
                  onPress={handleSave}
                  disabled={loading || saving || resetting}
                  fullWidth
                >
                  {saving ? 'Salvando...' : 'Salvar preferências'}
                </EasemindButton>
                <EasemindButton
                  variant="outlined"
                  onPress={handleReset}
                  disabled={loading || saving || resetting}
                  fullWidth
                >
                  {resetting ? 'Restaurar...' : 'Restaurar padrão'}
                </EasemindButton>
              </View>
            )}
          </>
        ) : (
          <>
            {renderSectionComplexidade()}
            {renderSectionContraste()}
            {renderSectionEspacamento()}
            {renderSectionTamanhoFonte()}
            <View style={[styles.footer, { marginTop: spacing / 2, gap: spacing / 2 }]}>
              <EasemindButton
                variant="primary"
                onPress={handleSave}
                disabled={loading || saving || resetting}
                fullWidth
              >
                {saving ? 'Salvando...' : 'Salvar preferências'}
              </EasemindButton>
              <EasemindButton
                variant="outlined"
                onPress={handleReset}
                disabled={loading || saving || resetting}
                fullWidth
              >
                {resetting ? 'Restaurar...' : 'Restaurar padrão'}
              </EasemindButton>
            </View>
          </>
        )}
      </ScrollView>
      </ScreenFadeIn>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {},
  simpleSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  simpleSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  simpleSectionCounter: {
    fontSize: 14,
  },
  simpleSectionContent: {
    minHeight: 120,
    marginBottom: 24,
  },
  simpleNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  simpleNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  simpleNavBtnDisabled: {
    opacity: 0.4,
  },
  simpleNavBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  exemploTexto: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginTop: 8,
  },
  exemploTextoInner: {},
  footer: {},
});
