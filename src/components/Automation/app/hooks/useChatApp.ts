import { useEffect, useMemo, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useSelector, useDispatch } from "react-redux";

import { cleanCredentialName, extractWebhookPath, N8N_RESPONSE_REGEX } from "@/components/Automation/app/helpers";

import { RootState } from "@/core/store";
import { getToken } from "@/common/utils";

import { setToast } from "@/core/store/toastSlice";
import useApp from "@/components/Automation/app/hooks/useApp";
import { INode, IWorkflowCreateResponse } from "@/components/Automation/types";
import { useSaveDocumentMutation, useUpdateWorkflowMutation } from "@/core/api/workflows";
import {
  IGeneratingStatus,
  setExecutionStatus,
  setGeneratedExecution,
  setGeneratingStatus,
  setRunInstantly,
} from "@/core/store/chatSlice";
import { IApp, IGPTDocumentPayload } from "@/components/Automation/app/hooks/types";
import { IMessage } from "@/components/Automation/ChatInterface/types";
import {
  allRequiredInputsAnswered,
  createMessage,
  formatDateWithOrdinal,
} from "@/components/Automation/ChatInterface/helper";
import useChatActions from "@/components/Automation/app/hooks/useChatActions";
import { useAppSelector } from "@/hooks/useStore";

const useChat = ({ appTitle }: { appTitle: string }) => {
  const dispatch = useDispatch();
  const { executeN8nApp } = useApp();
  const [updateApp] = useUpdateWorkflowMutation();
  const [saveDocument] = useSaveDocumentMutation();
  const [validatingQuery, setValidatingQuery] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const currentUser = useAppSelector(state => state.user.currentUser);

  const { selectedApp, inputs, answers, credentialsInput, areCredentialsStored, generatedExecution, runInstantly } =
    useSelector((state: RootState) => state.chat);

  const { handlePause, handleResume } = useChatActions({
    setMessages,
  });

  const initialMessages = () => {
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on ${appTitle}`;

    const initialMessage = createMessage({ text: greeting, type: "text" });
    const initialMessages: IMessage[] = [initialMessage];

    setMessages(initialMessages);
  };

  const showRunButton = useMemo((): boolean => {
    return (
      (!inputs.length && !credentialsInput?.length) ||
      (credentialsInput && credentialsInput.length > 0 && areCredentialsStored) ||
      (inputs.length > 0 && allRequiredInputsAnswered(inputs, answers))
    );
  }, [inputs, answers, areCredentialsStored, credentialsInput]);

  useEffect(() => {
    initialMessages();
  }, []);

  const setGeneratingStatusHandler = (status: IGeneratingStatus) => {
    dispatch(setGeneratingStatus(status));
  };

  const runWorkflow = async () => {
    try {
      if (!selectedApp) {
        throw new Error("Cloned workflow not found");
      }

      setGeneratingStatusHandler("started");

      const webhook = extractWebhookPath(selectedApp.nodes as INode[]);
      const frequency =
        selectedApp.schedule?.frequency !== "none"
          ? selectedApp.schedule?.frequency ?? selectedApp.periodic_task?.frequency
          : undefined;

      const response = await executeN8nApp(webhook, answers, frequency);

      setGeneratingStatusHandler("generated");

      if (response && typeof response === "string") {
        if (response.toLowerCase().includes("[error")) {
          failedExecutionHandler();
        } else {
          const match = new RegExp(N8N_RESPONSE_REGEX).exec(response);

          if (!match) {
            const executionMessage = createMessage({
              type: "workflowExecution",
              text: response,
              data: selectedApp,
            });
            setMessages(prev => prev.filter(msg => msg.type !== "readyMessage").concat(executionMessage));
          } else if (!match[2] || match[2] === "undefined") {
            failedExecutionHandler();
          } else {
            setGeneratingStatusHandler("streaming");
            // await streamExecutionHandler(response);
          }
        }
      }
    } catch (error) {
      console.error(error, "failed to run workflow");
      failedExecutionHandler();
    } finally {
      dispatch(setRunInstantly(false));
      setGeneratingStatusHandler("pending");
    }
  };

  const retryRunWorkflow = async (executionWorkflow: IApp) => {
    if (!selectedApp) {
      throw new Error("Cloned workflow not found");
    }

    const { periodic_task: currentPeriodicTask } = selectedApp;
    const { periodic_task: executionPeriodicTask } = executionWorkflow;
    const noInputsChange = currentPeriodicTask?.kwargs === executionPeriodicTask?.kwargs;

    const updatedWorkflow = noInputsChange
      ? executionWorkflow
      : await updateApp({
          workflowId: selectedApp.id,
          data: executionWorkflow as unknown as IWorkflowCreateResponse,
        }).unwrap();

    if (updatedWorkflow) {
      runWorkflow();
      setMessages(prevMessages =>
        prevMessages
          .filter(msg => msg.type !== "readyMessage")
          .concat(createMessage({ type: "readyMessage", text: "" })),
      );
    }
  };

  const failedExecutionHandler = () => {
    const failMessage = createMessage({
      type: "text",
      text: "Running your AI App failed, please try again.",
    });
    dispatch(setGeneratedExecution(null));
    setGeneratingStatusHandler("pending");
    dispatch(setExecutionStatus(false));
    setMessages(prev => prev.filter(msg => msg.type !== "readyMessage").concat(failMessage));
  };

  const saveGPTDocument = async (executionWorkflow: IApp, content: string) => {
    if (!executionWorkflow) {
      return false;
    }

    const payload: IGPTDocumentPayload = {
      output: content,
      title: executionWorkflow.name + ", " + formatDateWithOrdinal(new Date().toISOString()),
      workflow_id: executionWorkflow.id,
    };

    try {
      await saveDocument({ payload }).unwrap();
      dispatch(
        setToast({
          message: "Document saved",
          severity: "info",
          duration: 6000,
        }),
      );

      return true;
    } catch (error) {
      dispatch(
        setToast({
          message: "Something went wrong, please try again! ",
          severity: "error",
          duration: 6000,
          position: { vertical: "bottom", horizontal: "right" },
        }),
      );
      console.error(error);
    }

    return false;
  };

  const insertScheduleMessages = () => {
    const scheduleMessages: IMessage[] = [];

    if (selectedApp?.template_workflow?.is_schedulable) {
      const frequencyMessage = createMessage({
        type: "text",
        text: "How often do you want to repeat this AI App?",
      });

      scheduleMessages.push(frequencyMessage);

      const isHourly = selectedApp?.schedule?.frequency === "hourly";

      if (!isHourly) {
        const scheduleTimeMessage = createMessage({
          type: "text",
          text: "How often do you want to repeat this AI App?",
        });

        scheduleMessages.push(scheduleTimeMessage);
      }

      if (selectedApp?.template_workflow?.has_output_notification) {
        const scheduleProvidersMessage = createMessage({
          type: "text",
          text: "How often do you want to repeat this AI App?",
        });
        scheduleMessages.push(scheduleProvidersMessage);
      }
    } else {
      scheduleMessages.push(
        createMessage({ type: "text", text: "The AI app you are using is not eligible for scheduling!" }),
      );
    }

    setMessages(prev => prev.concat(scheduleMessages));
  };

  const renderMessage = async (message: string) => {
    switch (message) {
      case "configure_workflow":
        const configMessages: IMessage[] = [];
        if (credentialsInput.length) {
          const credentialsMessage = createMessage({
            type: "credentials",
            text: `Connect your ${credentialsInput.map(cred => cleanCredentialName(cred.displayName)).join(", ")}:`,
          });
          configMessages.push(credentialsMessage);
        } else if (inputs.length > 0) {
          const inputsMessage = createMessage({
            type: "form",
            text: ``,
          });
          configMessages.push(inputsMessage);
        } else {
          setMessages(prevMessages =>
            prevMessages.concat(
              createMessage({ text: "Your AI app does not require any configuration!", type: "text" }),
            ),
          );
          return;
        }

        setMessages(prevMessages => prevMessages.concat(configMessages));

        return;
      case "schedule_workflow":
        insertScheduleMessages();
        return;

      case "run_workflow":
        if (!runInstantly) {
          dispatch(setRunInstantly(true));
        }
        if (
          (!inputs.length && !credentialsInput?.length) ||
          (inputs.length > 0 && allRequiredInputsAnswered(inputs, answers)) ||
          (!!credentialsInput && credentialsInput.length > 0 && areCredentialsStored)
        ) {
          setMessages(prevMessages =>
            prevMessages
              .filter(msg => msg.type !== "readyMessage")
              .concat(createMessage({ type: "readyMessage", text: "" })),
          );
        } else {
          setMessages(prevMessages =>
            prevMessages.concat(createMessage({ type: "text", text: "Please make sure you configure your AI App!" })),
          );
        }
        return;
      case "api_instruction":
        if (
          (!inputs.length && !credentialsInput?.length) ||
          (inputs.length > 0 && allRequiredInputsAnswered(inputs, answers)) ||
          (!!credentialsInput && credentialsInput.length > 0 && areCredentialsStored)
        ) {
          setMessages(prevMessages => prevMessages.concat(createMessage({ type: "API_instructions", text: "" })));
        } else {
          setMessages(prevMessages =>
            prevMessages.concat(createMessage({ type: "text", text: "Please make sure you configure your AI App!" })),
          );
        }
        return;
      case "pause_workflow":
        await handlePause();
        return;

      case "resume_workflow":
        await handleResume();
        return;
      default:
        setMessages(prevMessages => prevMessages.concat(createMessage({ type: "text", text: message })));
        return;
    }
  };

  useEffect(() => {
    if (generatedExecution?.data?.length && generatedExecution?.hasNext === false) {
      dispatch(setRunInstantly(false));
      const title = generatedExecution.temp_title;
      const promptsOutput = generatedExecution.data.map(data => data.message).join(" ");
      const output = title ? `# ${title}\n\n${promptsOutput}` : promptsOutput;
      const executionMessage = createMessage({
        type: "workflowExecution",
        text: output,
        data: selectedApp,
      });
      setMessages(prev => prev.filter(msg => msg.type !== "readyMessage").concat(executionMessage));
      dispatch(setGeneratedExecution(null));
      setGeneratingStatusHandler("pending");
    }
  }, [generatedExecution]);

  const runExecution = (query: string) => {
    setValidatingQuery(true);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/1250/execute/`;
    const payload = JSON.stringify([
      {
        prompt: 6597,
        prompt_params: { query: query },
        contextual_overrides: [],
      },
    ]);

    let output = "";

    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${getToken()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: payload,
      openWhenHidden: true,
      async onopen(res) {
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error("Client side error", res);
        }
      },
      onmessage(msg) {
        try {
          const parseData = JSON.parse(msg.data);
          const message = parseData.message;

          if (message === "[CONNECTED]") {
            return;
          }

          if (msg.event === "infer" && msg.data) {
            if (message) {
              output += message;
            }
          }

          if (message === "[COMPLETED]") {
            renderMessage(output);
          }
        } catch (error) {
          const failMessageText = "Running your AI App failed due to an unexpected error. Please try again later.";
          const failMessage = createMessage({
            type: "text",
            text: failMessageText,
            isHighlight: true,
          });
          console.error(error);
          setMessages(prev => prev.filter(m => m.type !== "readyMessage").concat(failMessage));
        }
      },
      onerror(err) {
        console.error("Error in fetchEventSource:", err);
        setValidatingQuery(false);
        throw err; // rethrow to stop the operation
      },
      onclose() {
        setValidatingQuery(false);
      },
    });
  };
  const handleSubmit = async (query: string) => {
    if (query.trim() === "") {
      return;
    }
    const userMessage = createMessage({
      text: query,
      type: "text",
      fromUser: true,
    });

    setMessages(prevMessages => prevMessages.concat(userMessage));

    try {
      runExecution(query);
    } catch (error) {
      console.error(error);
      const botMessage = createMessage({
        type: "text",
        text: "Something went wrong please try again",
        isHighlight: true,
      });
      setMessages(prevMessages => prevMessages.concat(botMessage));
    }
  };

  return {
    messages,
    runWorkflow,
    retryRunWorkflow,
    handleSubmit,
    validatingQuery,
    saveGPTDocument,
    showRunButton,
  };
};
export default useChat;
