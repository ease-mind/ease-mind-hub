import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { colorsPalette } from "../styles/palette";

declare module "@mui/material/styles" {
  interface TypographyVariantsOptions {
    xs?: TypographyVariantsOptions["h1"];
    sm?: TypographyVariantsOptions["h1"];
    md?: TypographyVariantsOptions["h1"];
    lg?: TypographyVariantsOptions["h1"];
    xxl?: TypographyVariantsOptions["h1"];
  }
}
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xxl: true;
  }
}
const lightPalette = colorsPalette.light;
const darkPalette = colorsPalette.dark;

let defaultTheme = createTheme({
  spacing: [0, 8, 16, 24, 32, 64],
});

const getTypographyDefinition = (color: string) => ({
  typography: {
    fontFamily: "Inter, sans-serif",
    xs: { fontSize: 13, fontFamily: "Inter, sans-serif", color },
    sm: { fontSize: 16, fontFamily: "Inter, sans-serif", color },
    md: { fontSize: 22, fontFamily: "Inter, sans-serif", color },
    lg: { fontSize: 26, fontFamily: "Inter, sans-serif", fontWeight: 500 },
    xxl: { fontSize: 34, fontFamily: "Inter, sans-serif", fontWeight: 500 },
    h1: { fontSize: 25, fontWeight: 600 },
    button: { fontSize: 16 },
  },
});

defaultTheme = responsiveFontSizes(defaultTheme);

export const lightTheme = createTheme(defaultTheme, {
  ...getTypographyDefinition(lightPalette["grey.900"]),
  palette: {
    mode: "light",
    background: {
      paper: lightPalette["background"],
      default: lightPalette["background"],
      gradient: lightPalette["background.gradient"],
    },
    primary: {
      main: lightPalette["coral.contrast"],
      light: lightPalette["coral.700"],
      dark: lightPalette["coral.contrast"],
      contrastText: lightPalette["coral.50"],
    },
    secondary: {
      main: lightPalette["coral.500"],
      light: lightPalette["coral.400"],
      dark: lightPalette["coral.600"],
      contrastText: lightPalette["coral.contrast"],
    },
    tertiary: defaultTheme.palette.augmentColor({
      color: {
        main: lightPalette["coral.100"],
        light: lightPalette["coral.50"],
        dark: lightPalette["coral.200"],
        contrastText: lightPalette["coral.highcontrast"],
      },
      name: "tertiary",
    }),
    black: defaultTheme.palette.augmentColor({
      color: {
        main: lightPalette["black.main"],
        contrastText: lightPalette["white.main"],
      },
      name: "black",
    }),
    white: defaultTheme.palette.augmentColor({
      color: {
        main: lightPalette["white.main"],
        contrastText: lightPalette["black.main"],
      },
      name: "white",
    }),
    text: {
      primary: lightPalette["coral.900"],
      secondary: lightPalette["coral.500"],
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: lightPalette["navigation"],
          color: lightPalette["coral.contrast"],
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: lightPalette["coral.900"],
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: lightPalette["coral.800"],
          textDecorationColor: lightPalette["coral.800"],
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--variant-containedColor": lightPalette["grey.800"],
          "--variant-textColor": lightPalette["grey.900"],
          "--variant-outlinedBorder": lightPalette["grey.500"],
          "--Paper-overlay": "none !important",
        },
        body: {
          backgroundColor: lightPalette,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: lightPalette['white.main']
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: lightPalette["red.200"],
          },
          '&.Mui-error input': {
            color: lightPalette["red.200"],
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            color: lightPalette["red.200"],
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            color: lightPalette["red.200"],
          },
        },
        input: {
          '&.Mui-error': {
            color: lightPalette["red.200"],
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: lightPalette["grey.800"],
          "&.Mui-error": {
            color: lightPalette["red.200"],
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&": {
            color: lightPalette["grey.400"],
          },
        },
      },
    },
  },
  cssVariables: true,
});

export const darkTheme = createTheme(defaultTheme, {
  ...getTypographyDefinition(darkPalette["coral.highcontrast"]),
  palette: {
    mode: "dark",
    background: {
      paper: darkPalette["background"],
      default: darkPalette["background"],
      gradient: darkPalette["background.gradient"],
    },
    primary: {
      main: darkPalette["coral.contrast"],
      light: darkPalette["coral.700"],
      dark: darkPalette["coral.contrast"],
      contrastText: darkPalette["coral.50"],
    },
    secondary: {
      main: darkPalette["coral.500"],
      light: darkPalette["coral.400"],
      dark: darkPalette["coral.600"],
      contrastText: darkPalette["coral.subcontrast"],
    },
    tertiary: defaultTheme.palette.augmentColor({
      color: {
        main: darkPalette["coral.800"],
        light: darkPalette["coral.900"],
        dark: darkPalette["coral.600"],
        contrastText: darkPalette["coral.subcontrast"],
      },
      name: "tertiary",
    }),
    black: defaultTheme.palette.augmentColor({
      color: {
        main: darkPalette["black.main"],
        contrastText: darkPalette["white.main"],
      },
      name: "black",
    }),
    white: defaultTheme.palette.augmentColor({
      color: {
        main: darkPalette["white.main"],
        contrastText: darkPalette["black.main"],
      },
      name: "white",
    }),
    text: {
      primary: darkPalette["coral.accent"],
      secondary: darkPalette["coral.accent"],
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkPalette["navigation"],
          color: darkPalette["coral.contrast"],
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: darkPalette["grey.main"],
        },
        "&.Mui-selected:hover": {
          backgroundColor: darkPalette["coral.600"],
        },
        "&:hover": {
          backgroundColor: darkPalette["coral.600"], //hover do options do select
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: darkPalette["coral.accent"],
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: darkPalette["coral.900"],
          textDecorationColor: darkPalette["coral.900"],
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--variant-textColor": darkPalette["grey.50"] + " !important",
          "--variant-containedColor": darkPalette["grey.50"] + " !important",
          "--variant-outlinedBorder": darkPalette["grey.200"] + " !important",
        },
        ".MuiButtonBase-root": {
          "--variant-textColor": darkPalette["grey.50"] + " !important",
          "--variant-containedColor": darkPalette["coral.900"] + " !important",
          "--variant-outlinedBorder": lightPalette["grey.200"] + " !important",
        },
        ".MuiPaper-root": {
          "--Paper-overlay": "none !important",
        },
        body: {
          backgrounColor: darkPalette.background,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: darkPalette.background
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: darkPalette["red.200"],
          },
          '&.Mui-error input': {
            color: darkPalette["red.200"],
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            color: darkPalette["red.200"],
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            color: darkPalette["red.200"],
          },
        },
        input: {
          '&.Mui-error': {
            color: darkPalette["red.200"],
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: darkPalette["grey.main"],
          "&.Mui-error": {
            color: darkPalette["red.200"],
          },
        },
      },
    },
  },
  cssVariables: true,
});
