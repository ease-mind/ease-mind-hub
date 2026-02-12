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
      main: lightPalette["lime.contrast"],
      light: lightPalette["lime.700"],
      dark: lightPalette["lime.contrast"],
      contrastText: lightPalette["lime.50"],
    },
    secondary: {
      main: lightPalette["lime.500"],
      light: lightPalette["lime.400"],
      dark: lightPalette["lime.600"],
      contrastText: lightPalette["lime.contrast"],
    },
    tertiary: defaultTheme.palette.augmentColor({
      color: {
        main: lightPalette["lime.100"],
        light: lightPalette["lime.50"],
        dark: lightPalette["lime.200"],
        contrastText: lightPalette["lime.highcontrast"],
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
      primary: lightPalette["lime.900"],
      secondary: lightPalette["lime.500"],
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: lightPalette["navigation"],
          color: lightPalette["lime.contrast"],
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: lightPalette["lime.900"],
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: lightPalette["lime.800"],
          textDecorationColor: lightPalette["lime.800"],
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
  ...getTypographyDefinition(darkPalette["lime.highcontrast"]),
  palette: {
    mode: "dark",
    background: {
      paper: darkPalette["background"],
      default: darkPalette["background"],
      gradient: darkPalette["background.gradient"],
    },
    primary: {
      main: darkPalette["lime.contrast"],
      light: darkPalette["lime.700"],
      dark: darkPalette["lime.contrast"],
      contrastText: darkPalette["lime.50"],
    },
    secondary: {
      main: darkPalette["lime.500"],
      light: darkPalette["lime.400"],
      dark: darkPalette["lime.600"],
      contrastText: darkPalette["lime.subcontrast"],
    },
    tertiary: defaultTheme.palette.augmentColor({
      color: {
        main: darkPalette["lime.800"],
        light: darkPalette["lime.900"],
        dark: darkPalette["lime.600"],
        contrastText: darkPalette["lime.subcontrast"],
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
      primary: darkPalette["lime.accent"],
      secondary: darkPalette["lime.accent"],
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkPalette["navigation"],
          color: darkPalette["lime.contrast"],
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: darkPalette["grey.main"],
        },
        "&.Mui-selected:hover": {
          backgroundColor: darkPalette["lime.600"],
        },
        "&:hover": {
          backgroundColor: darkPalette["lime.600"], //hover do options do select
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: darkPalette["lime.accent"],
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: darkPalette["lime.900"],
          textDecorationColor: darkPalette["lime.900"],
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
          "--variant-containedColor": darkPalette["lime.900"] + " !important",
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
