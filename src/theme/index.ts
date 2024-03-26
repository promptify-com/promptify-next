import { Theme, createTheme } from "@mui/material";

interface SurfaceVariants {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}

interface CustomPalette {
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
  surface: SurfaceVariants;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  inverseOnSurface: string;
  inverseSurface: string;
  surfaceContainerHigh: string;
  surfaceContainerLow: string;
  surfaceContainerHighest: string;
  surfaceContainerLowest: string;
  surfaceContainer: string;
}

interface CustomTheme {
  custom: {
    defaultSidebarWidth: string;
    leftClosedSidebarWidth: string;
    headerHeight: {
      xs: string;
      md: string;
    };
    promptBuilder: {
      headerHeight: string;
      drawerWidth: string;
    };
  };
}

declare module "@mui/material/styles" {
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

export let theme: Theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "Space Mono"].join(","),
  },
  palette: {
    common: { black: "#1D2028", white: "#fff" },
    action: { active: "#1B1B1E", disabled: "grey", focusOpacity: 0 },
    grey: {
      "100": "#F5F5F5",
      "300": "#EFF0F3",
      "400": "#E0E1E7",
      "500": "#A1A6B6",
      "600": "#81889E",
    },
    primary: {
      main: "#375CA9",
    },
    secondary: {
      main: "#1B1B1E",
      light: "#575E71",
    },
    error: {
      main: "#BA1B1B",
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
  },
  custom: {
    defaultSidebarWidth: "230px",
    leftClosedSidebarWidth: "88px",
    headerHeight: {
      xs: "58px",
      md: "72px",
    },
    promptBuilder: {
      headerHeight: "75px",
      drawerWidth: "352px",
    },
  },
});

theme = createTheme(theme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "unset",
          whiteSpace: "nowrap",
          boxShadow: "unset",
          borderRadius: "21px",
          padding: "7px 20px",
          transition: "all .15s",
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "unset",
          },
        },
        contained: {
          backgroundColor: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          color: theme.palette.common.white,
          fontWeight: 600,
          "&:hover": {
            color: theme.palette.primary.main,
          },
        },
        outlined: {
          borderColor: theme.palette.grey[400],
          color: theme.palette.common.black,
          fontWeight: 500,
          "&:hover": {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: theme.palette.common.black,
          fontSize: 14,
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.palette.grey[400]}`,
          color: theme.palette.common.black,
          transition: "all .15s",
          "& svg": {
            width: 19,
            height: 19,
          },
          "&:hover": {
            backgroundColor: "transparent",
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          color: "inherit",
        },
      },
    },
  },
});

// Default breakpoints
// xs, extra-small: 0px.
// sm, small: 600px.
// md, medium: 900px.
// lg, large: 1200px.
// xl, extra-large: 1536px.
