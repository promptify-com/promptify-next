import { useState } from "react";
import { createTheme, ThemeProvider, type Palette } from "@mui/material/styles";
import mix from "polished/lib/color/mix";
import Stack from "@mui/material/Stack";

import { theme } from "@/theme";
import { Layout } from "@/layout";
import type { IMUDynamicColorsThemeColor } from "@/core/api/theme";
import Landing from "@/components/Chat/Landing";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";
import { Typography } from "@mui/material";

function ChatPage() {
  const [palette, setPalette] = useState(theme.palette);

  const fetchDynamicColors = () => {
    //@ts-expect-error unfound-new-type
    materialDynamicColors(fetchedTemplate.thumbnail)
      .then((imgPalette: IMUDynamicColorsThemeColor) => {
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
  const dynamicTheme = createTheme({ ...theme, palette });

  return (
    <ThemeProvider theme={dynamicTheme}>
      <Layout>
        <Stack
          sx={{
            width: { md: "950px" },
            mx: { md: "auto" },
            height: { xs: "100vh", md: "calc(100vh - 120px)" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Landing />

          <Stack gap={2}>
            <ChatInput
              onSubmit={() => {}}
              disabled={false}
              showGenerate={false}
              isValidating={false}
              onGenerate={() => {}}
            />

            <Typography
              fontSize={12}
              fontWeight={400}
              lineHeight={"140%"}
              letterSpacing={0.17}
              textAlign={"center"}
              sx={{
                opacity: 0.45,
              }}
            >
              Promptify uses various LLM models to achieve better results. Promptify may be wrong and can make mistakes,
              just double-check the information received from the chat. Check our Terms of Use and Privacy Policy.
            </Typography>
          </Stack>
        </Stack>
      </Layout>
    </ThemeProvider>
  );
}

export default ChatPage;
