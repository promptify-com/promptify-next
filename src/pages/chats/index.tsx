import { useEffect, useState } from "react";
import { createTheme, ThemeProvider, type Palette } from "@mui/material/styles";
import mix from "polished/lib/color/mix";
import Stack from "@mui/material/Stack";
import materialDynamicColors from "material-dynamic-colors";

import { theme } from "@/theme";
import { Layout } from "@/layout";
import Landing from "@/components/Chat/Landing";
import ChatInterface from "@/components/Chat/ChatInterface";
import useMessageManager from "@/components/Chat/Hooks/useMessageManager";
import ChatInput from "@/components/Chat/ChatInput";
import type { IMUDynamicColorsThemeColor } from "@/core/api/theme";
import { useAppSelector } from "@/hooks/useStore";

function ChatPage() {
  const [palette, setPalette] = useState(theme.palette);

  const selectedTemplate = useAppSelector(state => state.chat.selectedTemplate);
  const { messages, handleSubmitInput, isValidatingAnswer, suggestedTemplates } = useMessageManager();

  useEffect(() => {
    if (selectedTemplate?.thumbnail) {
      fetchDynamicColors();
    }
  }, [selectedTemplate]);

  const fetchDynamicColors = () => {
    //@ts-expect-error unfound-new-type
    materialDynamicColors(selectedTemplate.thumbnail)
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

  const showLanding = !!!messages.length;

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
          {showLanding ? (
            <Landing />
          ) : (
            <ChatInterface
              templates={suggestedTemplates}
              messages={messages}
              isValidating={isValidatingAnswer}
              showGenerate={false}
              onAbort={() => {}}
              onGenerate={() => {}}
            />
          )}

          <ChatInput
            onSubmit={handleSubmitInput}
            disabled={isValidatingAnswer}
            showGenerate={false}
            isValidating={isValidatingAnswer}
            onGenerate={() => {}}
          />
        </Stack>
      </Layout>
    </ThemeProvider>
  );
}

export default ChatPage;
