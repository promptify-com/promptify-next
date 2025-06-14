import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { createMessage } from "@/components/Chat/helper";
import { setClonedWorkflow, setGptGenerationStatus, setRunInstantly } from "@/core/store/chatSlice";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import { initialState as initialExecutionsState, setGeneratedExecution } from "@/core/store/executionsSlice";
import { PROVIDERS, TIMES } from "@/components/GPT/Constants";
import { useSaveGPTDocumentMutation, useUpdateWorkflowMutation } from "@/core/api/workflows";
import { cleanCredentialName, removeProviderNode } from "@/components/GPTs/helpers";
import type { ProviderType } from "@/components/GPT/Types";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type {
  FrequencyTime,
  FrequencyType,
  ITemplateWorkflow,
  IWorkflowCreateResponse,
  IWorkflowSchedule,
} from "@/components/Automation/types";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import { N8N_RESPONSE_REGEX, attachCredentialsToNode, extractWebhookPath } from "@/components/Automation/helpers";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import useDebounce from "@/hooks/useDebounce";
import { formatDateWithOrdinal } from "@/common/helpers/dateWithSuffix";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import useChatActions from "./useChatActions";
import { allRequiredInputsAnswered } from "@/common/helpers";
import { getToken } from "@/common/utils";

interface Props {
  workflow: ITemplateWorkflow;
}

type WorkflowData = {
  [key: string]: any;
};

const useChat = ({ workflow }: Props) => {
  const dispatch = useAppDispatch();

  const { generatedExecution } = useAppSelector(state => state.executions ?? initialExecutionsState);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { clonedWorkflow, inputs, answers, areCredentialsStored, credentialsInput, requireCredentials, runInstantly } =
    useAppSelector(state => state.chat ?? initialChatState);

  const [validatingQuery, setValidatingQuery] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const updateScheduleMode = useRef<boolean | null>(null);
  const selectedProviderType = useRef<ProviderType | null>(null);
  const [schedulingData, setSchedulingData] = useState<IWorkflowSchedule>({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    workflow_data: {} as WorkflowData,
    frequency: "" as FrequencyType,
    hour: 0,
    minute: 0,
    day_of_week: 0,
    day_of_month: 0,
  });

  const debouncedSchedulingData = useDebounce(schedulingData, 1000);

  const { sendMessageAPI } = useWorkflow(workflow);
  const { handlePause, handleResume } = useChatActions({ setMessages });
  const { streamExecutionHandler } = useGenerateExecution({});
  const [updateWorkflowHandler] = useUpdateWorkflowMutation();
  const [saveAsGPTDocument] = useSaveGPTDocumentMutation();

  const updateWorkflow = async (workflowData: IWorkflowCreateResponse) => {
    try {
      return await updateWorkflowHandler({
        workflowId: workflowData.id,
        data: workflowData,
      }).unwrap();
    } catch (error) {
      console.error("Updating workflow failed", error);
    }
  };

  const initialMessages = async () => {
    loadWorkflowScheduleData();

    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on ${
      workflow.name
    }?`;
    const welcomeMessage = createMessage({ type: "text", text: greeting });

    let initMessages = [welcomeMessage];

    setMessages(initMessages);
  };

  const loadWorkflowScheduleData = () => {
    setSchedulingData({
      ...schedulingData,
      ...clonedWorkflow?.periodic_task?.crontab,
      frequency: clonedWorkflow?.periodic_task?.frequency!,
    });
  };

  useEffect(() => {
    if (clonedWorkflow) {
      dispatch(setClonedWorkflow({ ...clonedWorkflow, schedule: schedulingData }));

      if (updateScheduleMode.current) {
        handleUpdateWorkflow({
          ...clonedWorkflow,
          schedule: schedulingData,
        });
      }
    }
  }, [debouncedSchedulingData]);

  useEffect(() => {
    if (generatedExecution?.data?.length && generatedExecution.hasNext === false) {
      const title = generatedExecution.temp_title;
      const promptsOutput = generatedExecution.data.map(data => data.message).join(" ");
      const output = title ? `# ${title}\n\n${promptsOutput}` : promptsOutput;
      const executionMessage = createMessage({
        type: "workflowExecution",
        text: output,
        data: clonedWorkflow,
      });
      setMessages(prev => prev.concat(executionMessage));
      dispatch(setGeneratedExecution(null));
      dispatch(setGptGenerationStatus("pending"));
    }
  }, [generatedExecution]);

  // Keep track of workflow data changes coming from answers state
  useEffect(() => {
    const workflowData: WorkflowData = { ...schedulingData.workflow_data };

    answers.forEach(answer => {
      if (answer.required && answer.answer) {
        workflowData[answer.inputName] = answer.answer;
      }
    });

    setSchedulingData(prev => ({
      ...prev,
      workflow_data: workflowData,
    }));
  }, [answers]);

  const insertScheduleMessages = () => {
    const scheduleMessages: IMessage[] = [];

    if (workflow.is_schedulable) {
      const frequencyMessage = createMessage({
        type: "schedule_frequency",
        text: "How often do you want to repeat this AI App?",
      });

      scheduleMessages.push(frequencyMessage);

      const isHourly = clonedWorkflow?.schedule?.frequency === "hourly";

      if (!isHourly) {
        const scheduleTimeMessage = createMessage({
          type: "schedule_time",
          text: "How often do you want to repeat this AI App?",
        });

        scheduleMessages.push(scheduleTimeMessage);
      }

      if (workflow.has_output_notification) {
        const scheduleProvidersMessage = createMessage({
          type: "schedule_providers",
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

  const insertProvidersMessages = (scheduleData: IWorkflowSchedule) => {
    if (!messages.find(msg => msg.type === "schedule_providers")) {
      const hour = scheduleData.hour ? ` at ${TIMES[scheduleData.hour]}` : "";
      const message = `Awesome, We’ll run this AI App for you here ${scheduleData.frequency}${hour}, do you want to receive them in your favorite platforms?`;
      const confirmMessage = createMessage({
        type: "text",
        text: message,
        isHighlight: true,
      });
      const providersMessage = createMessage({
        type: "schedule_providers",
        text: "Where should we send your scheduled AI App?",
      });
      setMessages(prev => prev.concat([confirmMessage, providersMessage]));
    }
  };

  const handleUpdateWorkflow = async (workflowData?: IWorkflowCreateResponse) => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    let _workflow = structuredClone(workflowData ?? clonedWorkflow);

    _workflow.nodes.forEach(node => attachCredentialsToNode(node));

    const updatedWorkflow = await updateWorkflow(_workflow);

    if (updatedWorkflow) {
      dispatch(
        setClonedWorkflow({
          ...updatedWorkflow,
          schedule: schedulingData,
        }),
      );
    }
  };

  const setScheduleFrequency = (frequency: FrequencyType) => {
    // if (schedulingData.frequency === frequency) return;

    const scheduleData = { ...schedulingData, frequency };

    const isHourly = frequency === "hourly";

    let _messages = messages;
    if (isHourly) {
      updateScheduleMode.current = true;
      _messages = _messages.filter(msg => msg.type !== "schedule_time");
    } else {
      if (!_messages.find(msg => msg.type === "schedule_time")) {
        const timeMessage: IMessage = createMessage({
          type: "schedule_time",
          text: "At what time?",
        });
        _messages = _messages.flatMap(msg => (msg.type === "schedule_frequency" ? [msg, timeMessage] : msg));
      }
    }

    setSchedulingData(scheduleData);
    setMessages(_messages);

    if (workflow.has_output_notification && isHourly) {
      insertProvidersMessages(scheduleData);
    }
  };

  const setScheduleTime = (frequencyTime: FrequencyTime) => {
    updateScheduleMode.current = true;

    const isWeekly = schedulingData?.frequency === "weekly";
    const isMonthly = schedulingData?.frequency === "monthly";
    const day_of_week = frequencyTime.day_of_week ?? 0;
    const day_of_month = frequencyTime.day_of_month ?? 0;
    const frequencyDay = isWeekly ? { day_of_week } : isMonthly ? { day_of_month } : {};

    const scheduleData = {
      ...schedulingData,
      ...frequencyDay,
      hour: frequencyTime.time,
    };
    setSchedulingData(scheduleData);
    if (workflow.has_output_notification) {
      insertProvidersMessages(scheduleData);
    }
  };

  const injectProvider = async (providerType: ProviderType, generatedWorkflow: IWorkflowCreateResponse) => {
    let preparedMessages: IMessage[] = [];
    selectedProviderType.current = providerType;

    const provider = PROVIDERS[providerType];
    const providerConnectionMessage = createMessage({
      type: "text",
      text: `${provider.name} has been connected successfully, we’ll be sending your results to your ${provider.name}`,
      isHighlight: true,
    });
    preparedMessages.push(providerConnectionMessage);

    await handleUpdateWorkflow(generatedWorkflow);

    setMessages(prevMessages => prevMessages.concat(preparedMessages));
  };

  const runWorkflow = async () => {
    try {
      if (!clonedWorkflow) {
        throw new Error("Cloned workflow not found");
      }

      dispatch(setGptGenerationStatus("started"));

      const webhook = extractWebhookPath(clonedWorkflow.nodes);
      const frequency = schedulingData?.frequency !== "none" ? schedulingData?.frequency : undefined;

      const response = await sendMessageAPI(webhook, answers, frequency);

      dispatch(setGptGenerationStatus("generated"));

      if (response && typeof response === "string") {
        if (response.toLowerCase().includes("[error")) {
          failedExecutionHandler();
        } else {
          const match = new RegExp(N8N_RESPONSE_REGEX).exec(response);

          if (!match) {
            const executionMessage = createMessage({
              type: "workflowExecution",
              text: response,
              data: clonedWorkflow,
            });
            setMessages(prev => prev.filter(msg => msg.type !== "readyMessage").concat(executionMessage));
          } else if (!match[2] || match[2] === "undefined") {
            failedExecutionHandler();
          } else {
            dispatch(setGptGenerationStatus("streaming"));
            await streamExecutionHandler(response);
          }
        }
      }
    } catch (error) {
      failedExecutionHandler();
    } finally {
      dispatch(setGptGenerationStatus("generated"));
    }
  };

  const retryRunWorkflow = async (executionWorkflow: IWorkflowCreateResponse) => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    const { periodic_task: currentPeriodicTask } = clonedWorkflow;
    const { periodic_task: executionPeriodicTask } = executionWorkflow;
    const noInputsChange = currentPeriodicTask?.kwargs === executionPeriodicTask?.kwargs;

    const updatedWorkflow = noInputsChange ? executionWorkflow : await updateWorkflow(executionWorkflow);
    dispatch(setRunInstantly(false));
    if (updatedWorkflow) {
      runWorkflow();
      setMessages(prevMessages =>
        prevMessages
          .filter(msg => msg.type !== "readyMessage")
          .concat(createMessage({ type: "readyMessage", text: "" })),
      );
      if (!noInputsChange) {
        updateWorkflow(structuredClone(clonedWorkflow));
      }
    }
  };

  const saveGPTDocument = async (executionWorkflow: IWorkflowCreateResponse, content: string) => {
    if (!executionWorkflow) {
      return false;
    }

    try {
      await saveAsGPTDocument({
        output: content,
        title: executionWorkflow.name + ", " + formatDateWithOrdinal(new Date().toISOString()),
        workflow_id: executionWorkflow.id,
      });

      return true;
    } catch (error) {
      console.error(error);
    }

    return false;
  };

  const failedExecutionHandler = () => {
    const failMessage = createMessage({
      type: "text",
      text: "Running your AI App failed, please try again.",
    });
    setMessages(prev => prev.filter(msg => msg.type !== "readyMessage").concat(failMessage));
  };

  const removeProvider = (providerName: string, shouldUpdate = true) => {
    let _clonedWorkflow = structuredClone(clonedWorkflow)!;
    _clonedWorkflow = removeProviderNode(_clonedWorkflow, providerName);
    if (shouldUpdate) {
      dispatch(setClonedWorkflow(_clonedWorkflow));
    }

    handleUpdateWorkflow(_clonedWorkflow);

    return _clonedWorkflow;
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
          (!inputs.length && !requireCredentials) ||
          (inputs.length > 0 && allRequiredInputsAnswered(inputs, answers)) ||
          (requireCredentials && credentialsInput.length > 0 && areCredentialsStored)
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
          (!inputs.length && !requireCredentials) ||
          (inputs.length > 0 && allRequiredInputsAnswered(inputs, answers)) ||
          (requireCredentials && credentialsInput.length > 0 && areCredentialsStored)
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

  const runExecution = (query: string) => {
    setValidatingQuery(true);

    const url = "https://promptify.adtitan.io/api/meta/templates/1250/execute/";
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
          const parseData = parseMessageData(msg.data);
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
    const userMessage = createMessage({ text: query, type: "text", fromUser: true });

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
  };
};

export default useChat;
