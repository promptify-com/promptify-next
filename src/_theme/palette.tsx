import { alpha } from "@mui/material";

interface SurfaceVariants {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}
export interface CustomPalette {
  primary: { light: string; main: string; dark: string; contrastText: string };
  info: { light: string; main: string; dark: string; contrastText: string };
  warning: { light: string; main: string; dark: string };
  error: { light: string; main: string; dark: string };
  success: { light: string; main: string; dark: string };
  grey: Record<string, string>;
  divider: string;
  background: { default: string; paper: string };
  common: { black: string; white: string };
  text: { primary: string; secondary: string; warning: string };
  action: { hover: string; disabled: string; selected: string };
  onPrimary: string;
  onSecondary: string;
  primaryContainer: string;
  secondaryContainer: string;
  onPrimaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  onBackground: string;
  errorContainer: string;
  onError: string;
  onErrorContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerLow: string;
  surfaceContainerHighest: string;
  surfaceContainerLowest: string;
  surfaceDim: string;
  surface: SurfaceVariants;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  inverseOnSurface: string;
  inverseSurface: string;
  surfaceContainer: string;
  unstable_sx?: any;
  applyStyles?: any;
}

// Colors
export const brand = {
  50: "hsl(210, 100%, 95%)",
  100: "hsl(210, 100%, 92%)",
  200: "hsl(210, 100%, 80%)",
  300: "hsl(210, 100%, 65%)",
  400: "hsl(210, 98%, 48%)",
  500: "hsl(210, 98%, 42%)",
  600: "hsl(210, 98%, 55%)",
  700: "hsl(210, 100%, 35%)",
  800: "hsl(210, 100%, 16%)",
  900: "hsl(210, 100%, 21%)",
};
export const gray = {
  50: "hsl(220, 35%, 97%)",
  100: "hsl(220, 30%, 94%)",
  200: "hsl(220, 20%, 88%)",
  300: "hsl(220, 20%, 80%)",
  400: "hsl(240, 3.8%, 46.1%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 20%, 35%)",
  700: "hsl(220, 20%, 25%)",
  800: "hsl(220, 30%, 6%)",
  900: "hsl(240 5.9% 10%)",
};
export const green = {
  50: "hsl(120, 80%, 98%)",
  100: "hsl(120, 75%, 94%)",
  200: "hsl(120, 75%, 87%)",
  300: "hsl(120, 61%, 77%)",
  400: "hsl(120, 44%, 53%)",
  500: "hsl(120, 59%, 30%)",
  600: "hsl(120, 70%, 25%)",
  700: "hsl(120, 75%, 16%)",
  800: "hsl(120, 84%, 10%)",
  900: "hsl(120, 87%, 6%)",
};
export const orange = {
  50: "hsl(45, 100%, 97%)",
  100: "hsl(45, 92%, 90%)",
  200: "hsl(45, 94%, 80%)",
  300: "hsl(45, 90%, 65%)",
  400: "hsl(45, 90%, 40%)",
  500: "hsl(45, 90%, 35%)",
  600: "hsl(45, 91%, 25%)",
  700: "hsl(45, 94%, 20%)",
  800: "hsl(45, 95%, 16%)",
  900: "hsl(45, 93%, 12%)",
};
export const red = {
  50: "hsl(0, 100%, 97%)",
  100: "hsl(0, 92%, 90%)",
  200: "hsl(0, 94%, 80%)",
  300: "hsl(0, 90%, 65%)",
  400: "hsl(0, 90%, 40%)",
  500: "hsl(0, 90%, 30%)",
  600: "hsl(0, 91%, 25%)",
  700: "hsl(0, 94%, 18%)",
  800: "hsl(0, 95%, 12%)",
  900: "hsl(0, 93%, 6%)",
};

// MUI
export const getPalette = (mode: string): CustomPalette => {
  return {
    primary: {
      light: brand[200],
      main: brand[400],
      dark: brand[700],
      contrastText: brand[50],
      ...(mode === "dark" && {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[700],
      }),
    },
    info: {
      light: brand[100],
      main: brand[300],
      dark: brand[600],
      contrastText: gray[50],
      ...(mode === "dark" && {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      }),
    },
    warning: {
      light: orange[300],
      main: orange[400],
      dark: orange[800],
      ...(mode === "dark" && {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      }),
    },
    error: {
      light: red[300],
      main: red[400],
      dark: red[800],
      ...(mode === "dark" && {
        light: red[400],
        main: red[500],
        dark: red[700],
      }),
    },
    success: {
      light: green[300],
      main: green[400],
      dark: green[800],
      ...(mode === "dark" && {
        light: green[400],
        main: green[500],
        dark: green[700],
      }),
    },
    grey: gray,
    divider: mode === "dark" ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
    background: {
      default: "hsl(240, 27%, 94%)",
      paper: "hsl(0,0%,100%)",
      ...(mode === "dark" && { default: gray[900], paper: "hsl(220, 30%, 7%)" }),
    },
    common: { black: "#1D2028", white: "#fff" },
    text: {
      primary: gray[800],
      secondary: gray[600],
      warning: orange[400],
      ...(mode === "dark" && {
        primary: "hsl(0, 0%, 100%)",
        secondary: gray[400],
      }),
    },
    action: {
      hover: alpha(gray[200], 0.2),
      disabled: alpha(gray[200], 0.2),
      selected: `${alpha(gray[200], 0.3)}`,
      ...(mode === "dark" && {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      }),
    },
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    primaryContainer: "#D8E2FF",
    secondaryContainer: "#DCE2F9",
    onPrimaryContainer: "#001A43",
    tertiary: "#725472",
    tertiaryContainer: "#FDD7FA",
    onBackground: "#1B1B1E",
    errorContainer: "#FFDAD4",
    onError: "#FFFFFF",
    onErrorContainer: "#410001",
    surfaceContainerHigh: "#E9E7EC",
    surfaceContainerLow: "#F5F3F7",
    surfaceContainerHighest: "#E3E2E6",
    surfaceContainerLowest: "#FFFFFF",
    surfaceDim: "#DBD9DD",
    surface: {
      1: "#FDFBFF",
      2: "#F5F4FA",
      3: "#ECECF4",
      4: "#E7E7F0",
      5: "#E1E2EC",
    },
    surfaceVariant: "#E1E2EC",
    onSurface: "#1B1B1E",
    onSurfaceVariant: "#FFC5C9",
    outline: "#757780",
    inverseOnSurface: "#F2F0F4",
    inverseSurface: "#303033",
    surfaceContainer: "#EFEDF1",
  };
};

export default getPalette;
