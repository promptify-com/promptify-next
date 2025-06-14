import { useEffect, useState, useMemo } from "react";
import { type Palette, createTheme, useTheme } from "@mui/material/styles";
import materialDynamicColors from "material-dynamic-colors";
import { mix } from "polished";
import { useAppSelector } from "@/hooks/useStore";

export const useDynamicColors = (image: string | undefined) => {
  const theme = useTheme();
  const [palette, setPalette] = useState(theme.palette);
  const currentUser = useAppSelector(state => state.user.currentUser);

  useEffect(() => {
    if (currentUser?.preferences?.theme === "blue" || !image) {
      return;
    }

    fetchDynamicColors(image);
  }, []);

  const fetchDynamicColors = (thumbnail: string) => {
    materialDynamicColors(thumbnail)
      .then(imgPalette => {
        const newPalette: Palette = {
          ...theme.palette,
          ...imgPalette.light,
          primary: {
            ...theme.palette.primary,
            main: imgPalette.light.primary,
          },
          secondary: {
            ...theme.palette.secondary,
            main: imgPalette.light.secondary,
          },
          error: {
            ...theme.palette.secondary,
            main: imgPalette.light.error,
          },
          background: {
            ...theme.palette.background,
            default: imgPalette.light.background,
          },
          surface: {
            1: imgPalette.light.surface,
            2: mix(0.3, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            3: mix(0.6, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            4: mix(0.8, imgPalette.light.surfaceVariant, imgPalette.light.surface),
            5: imgPalette.light.surfaceVariant,
          },
        };
        setPalette(newPalette);
      })
      .catch(() => {
        console.warn("Error fetching dynamic colors");
      });
  };

  const dynamicTheme = useMemo(() => createTheme({ ...theme, palette }), [theme, palette]);

  return dynamicTheme;
};
