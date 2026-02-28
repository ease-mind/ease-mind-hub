import { ScreenHeader } from '@/shared/components';
import {
  IconContrastHigh,
  IconContrastLow,
  IconContrastNormal,
  IconDocument1,
  IconDocument2,
  IconDocument3,
  IconLightbulb,
  SegmentedOptions,
  SettingsCard,
  SliderRow,
  ToggleRow,
} from '@/shared/components/settings';
import { themeColors } from '@/shared/classes/constants/themeColors';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type ComplexityLevel = 'simples' | 'medio' | 'completo';
type ViewMode = 'resumo' | 'detalhado';
type ContrastLevel = 'baixo' | 'normal' | 'alto';

export default function ConfigScreen() {
  const [notificacoes, setNotificacoes] = useState(true);
  const [alertasSonoros, setAlertasSonoros] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [complexidade, setComplexidade] = useState<ComplexityLevel>('medio');
  const [modoFoco, setModoFoco] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState<ViewMode>('detalhado');
  const [contraste, setContraste] = useState<ContrastLevel>('normal');
  const [espacamento, setEspacamento] = useState(18);
  const [tamanhoFonte, setTamanhoFonte] = useState(16);
  const [alertasCognitivos, setAlertasCognitivos] = useState(true);
  const [alertarAposMinutos, setAlertarAposMinutos] = useState(30);

  const espacamentoMarkers = ['8px', '16px', '24px'];
  const fontMarkers = ['12px', '16px', '20px', '24px'];
  const alertMarkers = ['10 min', '30 min', '60 min'];

  const getEspacamentoLabel = (v: number) => {
    if (v <= 11) return 'Pequeno';
    if (v <= 22) return 'Normal';
    return 'Grande';
  };

  const getFontLabel = (v: number) => {
    if (v <= 14) return 'Pequeno';
    if (v <= 18) return 'Médio';
    return 'Grande';
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsCard
          title="Preferências"
          icon={<Feather name="settings" size={24} color={themeColors.accent} />}
        >
          <ToggleRow
            icon={<Feather name="bell" size={24} color={themeColors.textPrimary} />}
            label="Notificações"
            value={notificacoes}
            onValueChange={setNotificacoes}
          />
          <ToggleRow
            icon={<Feather name="volume-2" size={24} color={themeColors.textPrimary} />}
            label="Alertas sonoros"
            value={alertasSonoros}
            onValueChange={setAlertasSonoros}
          />
          <ToggleRow
            icon={<Feather name="moon" size={24} color={themeColors.textPrimary} />}
            label="Modo escuro"
            value={modoEscuro}
            onValueChange={setModoEscuro}
          />
        </SettingsCard>

        <SettingsCard
          title="Nível de Complexidade da Interface"
          subtitle="Ajuste a quantidade de informações exibidas"
          icon={<Feather name="layers" size={24} color={themeColors.accentOrange} />}
        >
          <SegmentedOptions
            options={[
              {
                value: 'simples' as ComplexityLevel,
                label: 'Simples',
                sublabel: 'Apenas o essencial',
                icon: <IconDocument1 />,
              },
              {
                value: 'medio' as ComplexityLevel,
                label: 'Médio',
                sublabel: 'Informações essenciais',
                icon: <IconDocument2 />,
              },
              {
                value: 'completo' as ComplexityLevel,
                label: 'Completo',
                sublabel: 'Todas as funções',
                icon: <IconDocument3 />,
              },
            ]}
            value={complexidade}
            onSelect={setComplexidade}
          />
        </SettingsCard>

        <SettingsCard
          title="Modo de Foco"
          subtitle="Oculte elementos que podem distrair"
          icon={<Feather name="target" size={24} color={themeColors.accent} />}
        >
          <ToggleRow
            icon={<Feather name="eye-off" size={24} color={themeColors.textPrimary} />}
            label="Modo Foco Desativado"
            value={!modoFoco}
            onValueChange={(v) => setModoFoco(!v)}
            description="Todos os elementos visíveis."
          />
        </SettingsCard>

        <SettingsCard
          title="Modo de Visualização"
          subtitle="Escolha entre um modo mais ou menos detalhado"
          icon={<Feather name="file-text" size={24} color={themeColors.accent} />}
        >
          <SegmentedOptions
            options={[
              {
                value: 'resumo' as ViewMode,
                label: 'Modo Resumo',
                sublabel: 'Informações importantes.',
                icon: <IconDocument1 />,
              },
              {
                value: 'detalhado' as ViewMode,
                label: 'Modo Detalhado',
                sublabel: 'Todas as informações.',
                icon: <IconDocument2 />,
              },
            ]}
            value={modoVisualizacao}
            onSelect={setModoVisualizacao}
          />
        </SettingsCard>

        <SettingsCard
          title="Contraste"
          subtitle="Ajuste o contraste visual da interface"
          icon={<Feather name="sun" size={24} color={themeColors.accentOrange} />}
        >
          <SegmentedOptions
            options={[
              {
                value: 'baixo' as ContrastLevel,
                label: 'Baixo',
                sublabel: 'Suave',
                icon: <IconContrastLow />,
              },
              {
                value: 'normal' as ContrastLevel,
                label: 'Normal',
                sublabel: 'Padrão',
                icon: <IconContrastNormal />,
              },
              {
                value: 'alto' as ContrastLevel,
                label: 'Alto',
                sublabel: 'Máximo',
                icon: <IconContrastHigh />,
              },
            ]}
            value={contraste}
            onSelect={setContraste}
          />
        </SettingsCard>

        <SettingsCard
          title="Espaçamento"
          subtitle="Controle o espaço entre elementos"
          icon={<Feather name="maximize-2" size={24} color={themeColors.accent} />}
        >
          <SliderRow
            labelLeft={`Espaçamento: ${espacamento}px`}
            labelRight={getEspacamentoLabel(espacamento)}
            value={espacamento}
            minimumValue={8}
            maximumValue={24}
            step={1}
            onValueChange={setEspacamento}
            markers={espacamentoMarkers}
            valueToLabel={(v) => `Espaçamento: ${Math.round(v)}px`}
          />
        </SettingsCard>

        <SettingsCard
          title="Tamanho da Fonte"
          subtitle="Ajuste o tamanho do texto"
          icon={<Feather name="type" size={24} color={themeColors.accent} />}
        >
          <SliderRow
            labelLeft={`Tamanho: ${tamanhoFonte}px`}
            labelRight={getFontLabel(tamanhoFonte)}
            value={tamanhoFonte}
            minimumValue={12}
            maximumValue={24}
            step={1}
            onValueChange={setTamanhoFonte}
            markers={fontMarkers}
            valueToLabel={(v) => `Tamanho: ${Math.round(v)}px`}
          />
          <View style={styles.exemploTexto}>
            <Text style={[styles.exemploTextoInner, { fontSize: tamanhoFonte }]}>
              Exemplo de texto com o tamanho selecionado
            </Text>
          </View>
        </SettingsCard>

        <SettingsCard
          title="Alertas Cognitivos"
          subtitle="Receba avisos sobre seu tempo de atividade"
          icon={<IconLightbulb />}
        >
          <ToggleRow
            icon={<Feather name="bell" size={24} color={themeColors.textPrimary} />}
            label="Alertas Ativados"
            value={alertasCognitivos}
            onValueChange={setAlertasCognitivos}
            description="Você receberá notificações."
          />
          <SliderRow
            labelLeft={`Alertar após ${alertarAposMinutos} minutos`}
            labelRight="Moderado"
            value={alertarAposMinutos}
            minimumValue={10}
            maximumValue={60}
            step={5}
            onValueChange={setAlertarAposMinutos}
            markers={alertMarkers}
            valueToLabel={(v) => `Alertar após ${Math.round(v)} minutos`}
          />
          <View style={styles.alertBox}>
            <IconLightbulb />
            <Text style={styles.alertBoxText}>
              Exemplo de Alerta: Você está há muito tempo nesta tarefa.
              Considere fazer uma pausa de 5 minutos.
            </Text>
          </View>
        </SettingsCard>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  exemploTexto: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  exemploTextoInner: {
    color: themeColors.textPrimary,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: themeColors.alertBoxBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themeColors.alertBoxBorder,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  alertBoxText: {
    flex: 1,
    fontSize: 13,
    color: themeColors.textPrimary,
  },
  footer: {
    marginTop: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: themeColors.textMuted,
    marginBottom: 4,
  },
});
