import { MD3LightTheme } from 'react-native-paper';
import { ColorsPalette } from './Pallete';
export const Colors = {
  light: {
    ...ColorsPalette.light,
    primary: ColorsPalette.light["coral.500"],
    accent: ColorsPalette.light["coral.700"],
    background: ColorsPalette.light.background,
    surface: ColorsPalette.light["white.main"],
    text: ColorsPalette.light["grey.900"],
    error: ColorsPalette.light["red.200"],
    disabled: ColorsPalette.light["grey.400"],
    placeholder: ColorsPalette.light["grey.400"],
    onSurface: ColorsPalette.light["grey.900"],
    notification: ColorsPalette.light["coral.500"],
  },
  dark: {
    ...ColorsPalette.dark,
    primary: ColorsPalette.dark["coral.500"],
    accent: ColorsPalette.dark["coral.700"],
    background: ColorsPalette.dark.background,
    surface: ColorsPalette.dark["black.main"],
    text: ColorsPalette.dark["coral.accent"],
    error: ColorsPalette.dark["red.200"],
    disabled: ColorsPalette.dark["grey.400"],
    placeholder: ColorsPalette.dark["grey.400"],
    onSurface: ColorsPalette.dark["coral.accent"],
    notification: ColorsPalette.dark["coral.500"],
  },
};

export const PaperLightTheme = {
  ...Colors.light,
  dark: false,
  roundness: 4,
  colors: {
    primary: Colors.light.primary,
    accent: Colors.light.accent,
    background: Colors.light["white.main"],
    surface: Colors.light["white.main"],
    text: Colors.light.text,
    error: Colors.light.error,
    disabled: Colors.light.disabled,
    placeholder: Colors.light.placeholder,
    onSurface: Colors.light.onSurface,
    notification: Colors.light.notification,
  },
};

export const PaperDarkTheme = {
  ...Colors.dark,
  dark: true,
  roundness: 4,
  colors: {
    primary: Colors.dark.primary,
    accent: Colors.dark.accent,
    background: Colors.dark.background,
    surface: Colors.dark.surface,
    text: Colors.dark.text,
    error: Colors.dark.error,
    disabled: Colors.dark.disabled,
    placeholder: Colors.dark.placeholder,
    onSurface: Colors.dark.onSurface,
    notification: Colors.dark.notification,
  },
};

export const datePickerTheme = {
    ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: ColorsPalette.light['coral.800'],  
    onPrimary: '#FFFFFF',
    primaryContainer: ColorsPalette.light['coral.200'],
    onPrimaryContainer: ColorsPalette.light['coral.900'],    
    surface: '#FFFFFF',
    surfaceVariant: '#FFFFFF',
  },
};