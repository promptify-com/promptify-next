import { useRouter } from "next/router";
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
import SigninButton from "@/components/common/buttons/SigninButton";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import { executionsApi } from "@/core/api/executions";
import { getExecutionById } from "@/hooks/api/executions";
import { setSelectedExecution } from "@/core/store/executionsSlice";
import { setChatMode, setInitialChat, setSelectedChatOption } from "@/core/store/chatSlice";
import type { IMUDynamicColorsThemeColor } from "@/core/api/theme";
import { chatsApi, useCreateChatMutation, useUpdateChatMutation } from "@/core/api/chats";
import { setAnswers, setInputs, setSelectedChat, setSelectedTemplate } from "@/core/store/chatSlice";
import useSaveChatInteractions from "@/components/Chat/Hooks/useSaveChatInteractions";
import { IMessage } from "@/components/Prompt/Types/chat";
import { CircularProgress } from "@mui/material";

function Chat() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [palette, setPalette] = useState(theme.palette);
  const [offset, setOffset] = useState(10);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const currentUser = useAppSelector(state => state.user.currentUser);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const { generatedExecution, selectedExecution } = useAppSelector(state => state.executions);
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);
  const { selectedTemplate, selectedChatOption, selectedChat, chatMode, initialChat } = useAppSelector(
    state => state.chat,
  );
  const [createChat] = useCreateChatMutation();
  const [updateChat] = useUpdateChatMutation();
  const [getMessages] = chatsApi.endpoints.getChatMessages.useLazyQuery();

  const { processQueuedMessages, mapApiMessageToIMessage } = useSaveChatInteractions();
  const {
    messages,
    setMessages,
    createMessage,
    handleSubmitInput,
    isValidatingAnswer,
    setIsValidatingAnswer,
    showGenerateButton,
    isInputDisabled,
    setIsInputDisabled,
    queueSavedMessages,
    setQueueSavedMessages,
  } = useMessageManager();

  const { generateExecutionHandler, abortConnection, disableChatInput } = useGenerateExecution({
    template: selectedTemplate,
  });

  const handleDynamicColors = () => {
    if (!selectedTemplate?.thumbnail) {
      return;
    }
    fetchDynamicColors();
  };

  const handleCreateChat = async () => {
    if (!selectedTemplate) return;

    try {
      const newChat = await createChat({
        title: selectedTemplate.title ?? "Welcome",
        thumbnail: selectedTemplate.thumbnail,
      }).unwrap();
      dispatch(setSelectedChat(newChat));
    } catch (err) {
      console.error("Error creating a new chat: ", err);
    }
  };

  const handleTitleChat = async () => {
    if (!selectedChat || !selectedTemplate?.title) return;

    try {
      updateChat({
        id: selectedChat.id,
        data: { title: selectedTemplate.title, thumbnail: selectedTemplate.thumbnail },
      });
    } catch (err) {
      console.error("Error updating chat: ", err);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedChat(undefined));
      dispatch(setInitialChat(true));
    };
  }, []);

  const prepareSavedMessages = async (chatId: number) => {
    setLoadingMessages(true);
    const limit = 10;
    try {
      const messagesData = await getMessages({ chat: chatId, offset: 0, limit }).unwrap();
      setOffset(prevOffset => (!!messagesData.next ? prevOffset + messagesData.results.length : prevOffset));

      const mappedMessages: IMessage[] = messagesData.results.map(mapApiMessageToIMessage);

      // if (mappedMessages.find(msg => msg.type === "questionInput")) {
      //   // questionInput message only exists on QA mode
      //   dispatch(setSelectedChatOption("QA"));
      // } else {
      //   dispatch(setSelectedChatOption("FORM"));
      // }
      setMessages(prevMessages => [...mappedMessages.toReversed(), ...prevMessages]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!initialChat) {
      setMessages([]);
      dispatch(setAnswers([]));
      dispatch(setInputs([]));
      dispatch(setSelectedTemplate(undefined));
      setIsValidatingAnswer(false);
      dispatch(setChatMode("automation"));
      if (selectedChat?.id) {
        prepareSavedMessages(selectedChat.id);
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    handleDynamicColors();

    if (selectedChat && selectedTemplate?.title) {
      handleTitleChat();
    } else {
      handleCreateChat();
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (!queueSavedMessages.length) {
      return;
    }
    const lastMessage = queueSavedMessages[queueSavedMessages.length - 1];
    if (lastMessage.type !== "spark" || !lastMessage.executionId || !selectedChat || !selectedTemplate) {
      return;
    }
    processQueuedMessages(queueSavedMessages, selectedChat?.id, lastMessage?.executionId, selectedTemplate?.id);
    setQueueSavedMessages([]);
  }, [queueSavedMessages]);

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

  const handleGenerateExecution = () => {
    generateExecutionHandler((executionId: number) => {
      const executionMessage = createMessage({
        type: "spark",
        text: "",
        executionId,
        template: selectedTemplate,
        isLatestExecution: true,
      });
      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(executionMessage));
      setQueueSavedMessages(prevMessages => prevMessages.concat(executionMessage));
    });
    dispatch(setChatMode("automation"));
    if (selectedChatOption === "QA") {
      setIsInputDisabled(false);
    }
  };

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

        setMessages(prevMessages => {
          const messagesWithUpdatedFlags = prevMessages.map(message =>
            message.type === "spark" ? { ...message, isLatestExecution: false } : message,
          );

          const updatedMessages = messagesWithUpdatedFlags.map(message => {
            if (message.type === "spark" && message.executionId === generatedExecution.id) {
              return { ...message, spark: _newExecution };
            }
            return message;
          });

          return updatedMessages;
        });

        dispatch(setSelectedExecution(_newExecution)); //
      } catch {
        window.location.reload();
      }
    }
  };

  const showLanding = !!!messages.length && !selectedTemplate;
  const showChatInput = selectedChatOption !== "FORM" || !!selectedExecution || chatMode === "automation";

  return (
    <ThemeProvider theme={dynamicTheme}>
      <Layout>
        {loadingMessages ? (
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            height={{ xs: "100vh", md: "calc(100vh - 100px)" }}
          >
            <CircularProgress />
          </Stack>
        ) : (
          <Stack
            sx={{
              // mx: { md: "auto" },
              height: { xs: "100vh", md: "calc(100vh - 100px)" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            {showLanding ? (
              <Landing />
            ) : (
              <Stack
                sx={{
                  height: {
                    xs: showChatInput ? "calc(100% - 120px)" : "calc(100% - 60px)",
                    md: showChatInput ? "calc(100% - 90px)" : "100%",
                  },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <ChatInterface
                  messages={messages}
                  showGenerateButton={showGenerateButton}
                  onAbort={abortConnection}
                  onGenerate={() => handleGenerateExecution()}
                />
              </Stack>
            )}
            <Stack px={{ md: isChatHistorySticky ? "80px" : "300px" }}>
              {currentUser?.id ? (
                <>
                  {showChatInput && (
                    <ChatInput
                      onSubmit={handleSubmitInput}
                      disabled={isValidatingAnswer || disableChatInput || isInputDisabled || isGenerating}
                      isValidating={isValidatingAnswer}
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
          </Stack>
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default Chat;
