import { Fragment, useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";

import { initialState as initialChatState, setAnswers } from "@/core/store/chatSlice";

import { FrequencyType, ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import useChat from "../Hooks/useChat2";
import { isAdminFn, isValidUserFn } from "@/core/store/userSlice";
import { getWorkflowInputsValues } from "@/components/GPTs/helpers";
import { FREQUENCY_ITEMS } from "../Constants";
import CredentialsContainer from "../CredentialsContainer";
import Choices from "../Choices";
import FrequencyTimeSelector from "../FrequencyTimeSelector";
import ResponseProvidersContainer from "../ResponseProvidersContainer";
import Message from "../Message";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import ChatInput from "@/components/Chat/ChatInput";
import { useRouter } from "next/router";
import SigninButton from "@/components/common/buttons/SigninButton";
import RunWorkflowMessage from "../RunWorkflowMessage";
import SuggestionChoices from "./SuggestionChoices";

interface Props {
  workflow: ITemplateWorkflow;
}

const ChatInterface = ({ workflow }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);
  const isAdmin = useAppSelector(isAdminFn);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const workflowLoaded = useRef(false);
  const [isUserScrollingUp, setIsUserScrollingUp] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyType | undefined>(
    clonedWorkflow?.periodic_task?.frequency,
  );

  const { initializeCredentials } = useCredentials();
  const {
    messages,
    initialMessages,
    setScheduleFrequency,
    setScheduleTime,
    injectProvider,
    removeProvider,
    runWorkflow,
    retryRunWorkflow,
    saveGPTDocument,
    handleSubmit,
    validatingQuery,
  } = useChat({
    workflow,
  });

  useEffect(() => {
    if (clonedWorkflow && !workflowLoaded.current) {
      initialMessages();
      initializeCredentials();
      workflowLoaded.current = true;

      const answers = getWorkflowInputsValues(clonedWorkflow);
      dispatch(setAnswers(answers));
    }
  }, [clonedWorkflow, dispatch]);

  useEffect(() => {
    const chatContainer = messagesContainerRef.current;

    const handleScroll = () => {
      if (chatContainer) {
        if (chatContainer.scrollTop < chatContainer.scrollHeight - chatContainer.clientHeight) {
          setIsUserScrollingUp(true);
        } else {
          setIsUserScrollingUp(false);
        }
      }
    };

    chatContainer?.addEventListener("scroll", handleScroll);

    return () => {
      chatContainer?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const cloneExecutionInputs = (data: IWorkflowCreateResponse) => {
    if (data) {
      dispatch(setAnswers(getWorkflowInputsValues(data)));
    }
    // scrollToInputsForm();
  };

  const FREQUENCIES = isAdmin ? FREQUENCY_ITEMS : FREQUENCY_ITEMS.slice(1);
  const isNone = clonedWorkflow?.schedule?.frequency === "none";

  return (
    <Stack
      sx={{
        px: { xs: "16px", md: "48px" },
        height: {
          xs: `calc(100svh - 200px))`,
          md: `calc(100svh - 280px)`,
        },
      }}
    >
      <Stack
        sx={{
          height: {
            xs: "calc(100% - 90.5px)",
            md: "100%",
          },
          px: { xs: "8px", md: 0 },
        }}
      >
        <Stack
          ref={messagesContainerRef}
          gap={3}
          position={"relative"}
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            pt: "40px",
            overscrollBehavior: "contain",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              width: "0px",
            },
            justifyContent: "space-between",
            height: {
              xs: "calc(100% - 90.5px)",
              md: "100%",
            },
          }}
        >
          <Stack
            direction={"column"}
            gap={8}
            justifyContent={"space-between"}
          >
            {messages.map(message => (
              <Fragment key={message.id}>
                {message.type === "text" && <Message message={message} />}
                {message.type === "workflowExecution" && (
                  <Message
                    message={message}
                    retryExecution={() => retryRunWorkflow(message.data as IWorkflowCreateResponse)}
                    showInputs={() => cloneExecutionInputs(message.data as IWorkflowCreateResponse)}
                    saveAsDocument={() => saveGPTDocument(message.data as IWorkflowCreateResponse, message.text)}
                  />
                )}

                {message.type === "credentials" && (
                  <CredentialsContainer
                    message={message.text}
                    workflow={workflow}
                    isScheduled
                  />
                )}
                {message.type === "schedule_frequency" && (
                  <Choices
                    message={message.text}
                    items={FREQUENCIES}
                    onSelect={frequency => {
                      setScheduleFrequency(frequency as FrequencyType);
                      setSelectedFrequency(frequency as FrequencyType);
                    }}
                    selectedValue={selectedFrequency || clonedWorkflow?.periodic_task?.frequency}
                  />
                )}

                {message.type === "schedule_time" && !isNone && (
                  <FrequencyTimeSelector
                    message={message.text}
                    onSelect={setScheduleTime}
                    selectedFrequency={selectedFrequency || clonedWorkflow?.periodic_task?.frequency}
                  />
                )}
                {message.type === "schedule_providers" && !isNone && (
                  <Stack gap={8}>
                    <ResponseProvidersContainer
                      message={message.text}
                      workflow={workflow}
                      injectProvider={injectProvider}
                      removeProvider={removeProvider}
                    />
                  </Stack>
                )}
                {message.type === "readyMessage" && !isNone && (
                  <Stack gap={8}>
                    <Stack id="run-message">
                      <RunWorkflowMessage
                        estimatedExecutionTime={workflow.estimated_execution_time}
                        runInstantly
                        onRun={() => {
                          runWorkflow();
                          // scrollToBottom();
                        }}
                      />
                    </Stack>
                  </Stack>
                )}
              </Fragment>
            ))}
          </Stack>

          <Stack>
            {currentUser?.id ? (
              <>
                {!validatingQuery && (
                  <SuggestionChoices
                    workflow={workflow}
                    onSubmit={handleSubmit}
                  />
                )}
                <ChatInput
                  onSubmit={handleSubmit}
                  disabled={false}
                  isValidating={validatingQuery}
                />
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
      </Stack>
    </Stack>
  );
};

export default ChatInterface;
