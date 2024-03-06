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
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { IMUDynamicColorsThemeColor } from "@/core/api/theme";
import SigninButton from "@/components/common/buttons/SigninButton";
import { useRouter } from "next/router";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import { executionsApi } from "@/core/api/executions";
import { getExecutionById } from "@/hooks/api/executions";
import { setSelectedExecution } from "@/core/store/executionsSlice";

function ChatPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [palette, setPalette] = useState(theme.palette);

  const { selectedTemplate, selectedChatOption } = useAppSelector(state => state.chat);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const { generatedExecution, selectedExecution } = useAppSelector(state => state.executions);

  const {
    messages,
    setMessages,
    createMessage,
    handleSubmitInput,
    isValidatingAnswer,
    suggestedTemplates,
    showGenerateButton,
    setChatMode,
    allQuestionsAnswered,
    setAllQuestionsAnswered,
  } = useMessageManager();

  const { generateExecutionHandler, abortConnection, disableChatInput } = useGenerateExecution({
    template: selectedTemplate,
  });

  const handleGenerateExecution = () => {
    const executionMessage = createMessage({ type: "spark" });
    setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(executionMessage));
    generateExecutionHandler();
  };

  useEffect(() => {
    if (!selectedTemplate?.thumbnail) {
      return;
    }
    fetchDynamicColors();
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

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const allPromptsCompleted = generatedExecution.data.every(execData => execData.isCompleted);

      if (allPromptsCompleted) {
        selectGeneratedExecution();
        dispatch(executionsApi.util.invalidateTags(["Executions"]));
      }
    }
  }, [isGenerating, generatedExecution]);

  const selectGeneratedExecution = async () => {
    if (generatedExecution?.id) {
      try {
        const _newExecution = await getExecutionById(generatedExecution.id);
        dispatch(setSelectedExecution(_newExecution));
      } catch {
        window.location.reload();
      }
    }
  };

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
              showGenerateButton={showGenerateButton}
              onAbort={abortConnection}
              onGenerate={() => {
                setChatMode("automation");
                handleGenerateExecution();
                if (selectedChatOption === "QA") {
                  setAllQuestionsAnswered(false);
                }
              }}
            />
          )}

          {currentUser?.id ? (
            <>
              {(selectedChatOption !== "FORM" || !!selectedExecution) && (
                <ChatInput
                  onSubmit={handleSubmitInput}
                  disabled={isValidatingAnswer || disableChatInput || allQuestionsAnswered}
                  showGenerate={false}
                  isValidating={isValidatingAnswer}
                  onGenerate={() => {}}
                />
              )}
            </>
          ) : (
            <Stack
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={1}
              width={{ md: "100%" }}
              p={{ md: "16px 8px 16px 16px" }}
            >
              <SigninButton onClick={() => router.push("/signin")} />
            </Stack>
          )}
        </Stack>
      </Layout>
    </ThemeProvider>
  );
}

export default ChatPage;
