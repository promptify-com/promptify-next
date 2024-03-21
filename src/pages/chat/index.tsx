import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider, type Palette } from "@mui/material/styles";
import mix from "polished/lib/color/mix";
import Stack from "@mui/material/Stack";
import materialDynamicColors from "material-dynamic-colors";
import CircularProgress from "@mui/material/CircularProgress";

import { setChatMode, setInitialChat, setSelectedChat } from "@/core/store/chatSlice";
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
import { chatsApi, useCreateChatMutation, useUpdateChatMutation } from "@/core/api/chats";
import useSaveChatInteractions from "@/components/Chat/Hooks/useSaveChatInteractions";
import type { IMUDynamicColorsThemeColor } from "@/core/api/theme";

function Chat() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [palette, setPalette] = useState(theme.palette);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [stopScrollingToBottom, setStopScrollingToBottom] = useState<boolean>(false);
  const [loadingInitialMessages, setLoadingInitialMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);

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
    showGenerateButton,
    isInputDisabled,
    setIsInputDisabled,
    queueSavedMessages,
    setQueueSavedMessages,
    resetStates,
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

  const loadInitialMessages = async () => {
    if (!selectedChat?.id) {
      return;
    }

    setLoadingInitialMessages(true);
    try {
      const messagesData = await getMessages({ chat: selectedChat.id }).unwrap();
      const newMappedMessages = messagesData.results.map(mapApiMessageToIMessage);
      const _nextCursor = messagesData.next ? messagesData.next.split("cursor=")[1] : null;

      setNextCursor(_nextCursor);
      setMessages(prevMessages => newMappedMessages.concat(prevMessages));
    } catch (error) {
      console.error("Error loading initial messages:", error);
    } finally {
      setLoadingInitialMessages(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!selectedChat?.id || loadingMoreMessages || !nextCursor) {
      return;
    }

    setLoadingMoreMessages(true);
    try {
      const messagesData = await getMessages({ chat: selectedChat.id, cursor: nextCursor }).unwrap();
      const newMappedMessages = messagesData.results.map(mapApiMessageToIMessage);

      setStopScrollingToBottom(!!messagesData.previous);

      if (!newMappedMessages.length) {
        setNextCursor(null);
        return;
      }

      const _nextCursor = messagesData.next ? messagesData.next.split("cursor=")[1] : null;

      setNextCursor(_nextCursor);
      setMessages(prevMessages => newMappedMessages.concat(prevMessages));
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setLoadingMoreMessages(false);
    }
  };

  useEffect(() => {
    setStopScrollingToBottom(false);

    if (!initialChat) {
      resetStates();
      loadInitialMessages();
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
    if (!selectedTemplate?.thumbnail || !selectedChat?.thumbnail) {
      return;
    }

    materialDynamicColors(selectedTemplate.thumbnail ?? selectedChat.thumbnail)
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

        dispatch(setSelectedExecution(_newExecution));
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
        {loadingInitialMessages ? (
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
                  fetchMoreMessages={loadMoreMessages}
                  loadingMessages={loadingMoreMessages}
                  messages={messages}
                  showGenerateButton={showGenerateButton}
                  onAbort={abortConnection}
                  onGenerate={() => handleGenerateExecution()}
                  stopScrollingToBottom={stopScrollingToBottom}
                />
              </Stack>
            )}
            <Stack px={{ md: isChatHistorySticky ? "80px" : "300px" }}>
              {currentUser?.id ? (
                <>
                  {showChatInput && (
                    <ChatInput
                      onSubmit={(value: string) => {
                        handleSubmitInput(value);
                        setStopScrollingToBottom(false);
                      }}
                      disabled={isValidatingAnswer || disableChatInput || isInputDisabled || isGenerating}
                      isValidating={isValidatingAnswer}
                      isFadeIn={showLanding}
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
