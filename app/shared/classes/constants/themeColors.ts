import { ColorsPalette } from './Pallete';

const light = ColorsPalette.light;

export type ThemeColors = {
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentOrange: string;
  toggleOn: string;
  toggleOff: string;
  segmentedSelected: string;
  segmentedBorder: string;
  sliderTrack: string;
  sliderThumb: string;
  alertBoxBg: string;
  alertBoxBorder: string;
  bottomBarInactive: string;
  bottomBarActive: string;
  borderDivider: string;
  borderDividerWidth: number;
};

export const themeColorsNormal: ThemeColors = {
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  textPrimary: '#111827',
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
  borderDivider: '#E5E7EB',
  borderDividerWidth: 1,
};

export const themeColorsLow: ThemeColors = {
  ...themeColorsNormal,
  background: '#F9FAFB',
  cardBackground: '#F9FAFB',
  textPrimary: '#374151',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  accent: '#e07a85',
  segmentedSelected: '#FFE8E8',
  segmentedBorder: '#e07a85',
  sliderTrack: '#E5E7EB',
  borderDivider: '#E5E7EB',
  borderDividerWidth: 1,
};

export const themeColorsHigh: ThemeColors = {
  ...themeColorsNormal,
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#1F2937',
  textMuted: '#374151',
  accent: light['coral.600'],
  segmentedSelected: '#FFCDC8',
  segmentedBorder: '#000000',
  sliderTrack: '#D1D5DB',
  bottomBarInactive: '#374151',
  bottomBarActive: light['coral.600'],
  borderDivider: '#000000',
  borderDividerWidth: 2,
};

export const themeColors = themeColorsNormal;
