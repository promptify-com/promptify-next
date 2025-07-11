import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import chatSlice, {
  initialState as initialChatState,
  setChatMode,
  setInitialChat,
  setSelectedChat,
} from "@/core/store/chatSlice";
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
import executionsSlice, {
  initialState as initialExecutionsState,
  setSelectedExecution,
} from "@/core/store/executionsSlice";
import { chatsApi } from "@/core/api/chats";
import useSaveChatInteractions from "@/components/Chat/Hooks/useSaveChatInteractions";
import { useDynamicColors } from "@/hooks/useDynamicColors";
import useBrowser from "@/hooks/useBrowser";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import Button from "@mui/material/Button";
import { theme } from "@/theme";
import useChatsManager from "@/components/Chat/Hooks/useChatsManager";
import lazy from "next/dynamic";
import store from "@/core/store";
import templatesSlice, { initialState as initialTemplatesState } from "@/core/store/templatesSlice";

const ChatsHistoryLazy = lazy(() => import("@/components/sidebar/ChatsHistory/ChatsHistory"), {
  ssr: false,
});

function Chat() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [stopScrollingToBottom, setStopScrollingToBottom] = useState<boolean>(false);
  const [loadingInitialMessages, setLoadingInitialMessages] = useState(false);
  const [displayChatHistoryOnMobile, setDisplayChatHistoryOnMobile] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? initialTemplatesState.isGenerating);
  const { generatedExecution = null, selectedExecution = null } = useAppSelector(
    state => state.executions ?? initialExecutionsState,
  );
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);
  const {
    selectedTemplate,
    selectedChatOption = null,
    selectedChat,
    chatMode = "automation",
    initialChat = true,
  } = useAppSelector(state => state.chat ?? initialChatState);
  const { createChat, updateChat } = useChatsManager();
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
    executeWorkflow,
  } = useMessageManager();
  const { generateExecutionHandler, abortConnection, disableChatInput } = useGenerateExecution({
    template: selectedTemplate,
  });
  const dynamicTheme = useDynamicColors(selectedChat?.thumbnail);
  const isInputStyleQA = currentUser?.preferences?.input_style === "qa" || selectedChatOption === "qa";

  const handleCreateChat = async ({ title, thumbnail }: { title: string; thumbnail?: string }) => {
    const newChat = await createChat({
      data: { title, thumbnail },
    });
    dispatch(setSelectedChat(newChat));
  };
  const handleTitleChat = async () => {
    const title = selectedTemplate?.title;

    if (!selectedChat || !title || selectedChat.title === title) return;

    updateChat(selectedChat.id, { title: selectedTemplate.title, thumbnail: selectedTemplate.thumbnail });
  };
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
      setMessages(newMappedMessages);
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
    if (isInputStyleQA) {
      setIsInputDisabled(false);
    }
  };
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

  useEffect(() => {
    if (!store) {
      return;
    }

    store.injectReducers([
      { key: "chat", asyncReducer: chatSlice },
      { key: "templates", asyncReducer: templatesSlice },
      { key: "executions", asyncReducer: executionsSlice },
    ]);
    // TODO: eslint warning blocked a commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  useEffect(() => {
    return () => {
      dispatch(setSelectedChat(undefined));
      dispatch(setInitialChat(true));
    };
    // TODO: eslint warning blocked a commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedChat && selectedTemplate?.title) {
      handleTitleChat();
    } else {
      if (selectedTemplate) {
        handleCreateChat(selectedTemplate);
      }
    }
    // TODO: eslint warning blocked a commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  useEffect(() => {
    setStopScrollingToBottom(false);

    if (!initialChat) {
      resetStates();
      loadInitialMessages();
    }
    // TODO: eslint warning blocked a commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

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
    // TODO: eslint warning blocked a commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueSavedMessages]);

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const allPromptsCompleted = generatedExecution.data.every(execData => execData.isCompleted);

      if (allPromptsCompleted) {
        selectGeneratedExecution();
        dispatch(executionsApi.util.invalidateTags(["Executions"]));
      }
    }
    // TODO: eslint warning blocked a commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating, generatedExecution]);

  const showLanding = !messages.length && !selectedTemplate;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const showChatInput = isInputStyleQA || selectedExecution || chatMode === "automation";

  return (
    <ThemeProvider theme={dynamicTheme}>
      <Layout>
        <Box
          height={{
            xs: `calc(100svh - ${theme.custom.headerHeight.xs})`,
            md: `calc(100svh - ${theme.custom.headerHeight.md})`,
          }}
          mt={{
            xs: theme.custom.headerHeight.xs,
            md: 0,
          }}
        >
          {isMobile && (
            <Box
              bgcolor={"surfaceContainerLow"}
              sx={{
                position: "relative",
                zIndex: 1000,
              }}
            >
              <Button
                onClick={() => {
                  setDisplayChatHistoryOnMobile(true);
                }}
                className="chat-hmg-container"
                startIcon={<Menu />}
                sx={{
                  position: "sticky",
                  top: 0,
                  p: "16px",
                  color: "secondary.light",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Chats
              </Button>
              <DrawerContainer
                title="Chats"
                expanded={displayChatHistoryOnMobile}
                toggleExpand={() => {
                  setDisplayChatHistoryOnMobile(false);
                }}
                onClose={() => {
                  setDisplayChatHistoryOnMobile(false);
                }}
                sticky={false}
                style={{
                  zIndex: 50,
                  "& .MuiDrawer-paper": {
                    my: 0,
                    px: "10px",
                    pb: "60px", // for last chat entry to be displayed properly
                    borderRadius: 0,
                    height: "100svh",
                    boxSizing: "border-box",
                    bgcolor: "surfaceContainerLow",
                    border: "none",
                    width: "90%",
                    left: 0,
                    position: "absolute",
                    top: "6%",
                    transform: displayChatHistoryOnMobile ? "translateX(0)" : "translateX(-90%)",
                    overflow: "auto",
                    overscrollBehavior: "contain",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  },
                }}
              >
                <ChatsHistoryLazy
                  onClose={() => {
                    setDisplayChatHistoryOnMobile(false);
                  }}
                />
              </DrawerContainer>
            </Box>
          )}
          {loadingInitialMessages ? (
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              height={{ xs: `calc(100svh - ${theme.custom.headerHeight.xs})`, md: "calc(100vh - 100px)" }}
              sx={{
                ...(isMobile && { minWidth: `${window.innerWidth}px` }),
              }}
            >
              <CircularProgress />
            </Stack>
          ) : (
            <Stack
              justifyContent={"flex-end"}
              sx={{
                height: {
                  xs: `calc(100svh - (${theme.custom.headerHeight.xs} + ${showChatInput ? 60 : 0}px))`,
                  md: `calc(100svh - ${theme.custom.headerHeight.md})`,
                },
              }}
            >
              {showLanding ? (
                <Landing />
              ) : (
                <Stack
                  justifyContent={"flex-end"}
                  sx={{
                    height: {
                      xs: showChatInput ? "calc(100% - 90.5px)" : "100%",
                      md: showChatInput ? "calc(100% - 128px)" : "100%",
                    },
                    px: { xs: "8px", md: 0 },
                  }}
                >
                  <ChatInterface
                    fetchMoreMessages={loadMoreMessages}
                    loadingMessages={loadingMoreMessages}
                    messages={messages}
                    showGenerateButton={showGenerateButton}
                    onAbort={abortConnection}
                    onGenerate={() => {
                      handleGenerateExecution();
                    }}
                    onExecuteWorkflow={executeWorkflow}
                    stopScrollingToBottom={stopScrollingToBottom}
                  />
                </Stack>
              )}
              <Stack
                sx={{
                  px: { md: isChatHistorySticky ? "80px" : "300px" },
                  pb: { md: showChatInput ? "24px" : 0 },
                }}
              >
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
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

export default Chat;
