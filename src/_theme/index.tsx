"use client";
import type { ReactNode } from "react";
// Mui
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
//
import { getPalette } from "./palette";
import typography from "./typography";
import componentsOverride from "./overrides";
import custom from "./customTheme";

export default function ThemeConfig({ children }: { children: ReactNode }) {
  const palette = getPalette("light");
  const theme = createTheme({
    palette,
    typography,
    custom,
  });

  theme.components = componentsOverride(theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
