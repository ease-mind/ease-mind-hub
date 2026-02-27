/**
 * Cores no estilo do projeto antigo, mapeadas para o Pallete do projeto novo.
 * Use nos componentes portados (tarefas, configurações) para manter o mesmo visual.
 */
import { ColorsPalette } from './Pallete';

const light = ColorsPalette.light;

export const themeColors = {
  background: light['white.main'],
  cardBackground: light['white.main'],
  textPrimary: light['grey.900'],
  textSecondary: light['grey.500'],
  textMuted: light['grey.400'],
  accent: light['coral.500'],
  accentOrange: '#EA580C',
  toggleOn: light['coral.500'],
  toggleOff: '#D1D5DB',
  segmentedSelected: light['coral.100'],
  segmentedBorder: light['coral.500'],
  sliderTrack: light['grey.200'],
  sliderThumb: '#3B82F6',
  alertBoxBg: '#FEFCE8',
  alertBoxBorder: '#FDE047',
  bottomBarInactive: light['grey.500'],
  bottomBarActive: light['coral.500'],
};
