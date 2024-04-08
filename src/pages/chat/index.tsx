import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { setChatMode, setInitialChat, setSelectedChat } from "@/core/store/chatSlice";
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
import { useDynamicColors } from "@/hooks/useDynamicColors";
import useBrowser from "@/hooks/useBrowser";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import ChatsHistory from "@/components/sidebar/ChatsHistory/ChatsHistory";
import Button from "@mui/material/Button";
import { theme } from "@/theme";
import Box from "@mui/material/Box";
import Menu from "@mui/icons-material/Menu";

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
  const dynamicTheme = useDynamicColors(selectedTemplate, selectedChat?.thumbnail);
  const isInputStyleQA = currentUser?.preferences?.input_style === "qa" || selectedChatOption === "qa";
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
    return () => {
      dispatch(setSelectedChat(undefined));
      dispatch(setInitialChat(true));
    };
  }, []);

  useEffect(() => {
    setStopScrollingToBottom(false);

    if (!initialChat) {
      resetStates();
      loadInitialMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
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

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const allPromptsCompleted = generatedExecution.data.every(execData => execData.isCompleted);

      if (allPromptsCompleted) {
        selectGeneratedExecution();
        dispatch(executionsApi.util.invalidateTags(["Executions"]));
      }
    }
  }, [isGenerating, generatedExecution]);

  const showLanding = !!!messages.length && !selectedTemplate;
  const showChatInput = isInputStyleQA || !!selectedExecution || chatMode === "automation";

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
            <Box bgcolor={"surfaceContainerLow"}>
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
                <ChatsHistory
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
