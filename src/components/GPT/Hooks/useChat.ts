import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { createMessage } from "@/components/Chat/helper";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { setAreCredentialsStored, setClonedWorkflow, setGptGenerationStatus } from "@/core/store/chatSlice";
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

interface Props {
  workflow: ITemplateWorkflow;
}

type WorkflowData = {
  [key: string]: any;
};

const useChat = ({ workflow }: Props) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { answers, areCredentialsStored, clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);
  const { generatedExecution } = useAppSelector(state => state.executions ?? initialExecutionsState);

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

  const { extractCredentialsInputFromNodes, checkAllCredentialsStored } = useCredentials();
  const { sendMessageAPI } = useWorkflow(workflow);
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

    const credentialsInput = await extractCredentialsInputFromNodes(workflow.data.nodes);
    let areAllCredentialsStored = true;
    if (credentialsInput.length) {
      areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);

      const credentialsMessage = createMessage({
        type: "credentials",
        text: `Connect your ${credentialsInput.map(cred => cleanCredentialName(cred.displayName)).join(", ")}:`,
      });
      initMessages.push(credentialsMessage);
    }
    dispatch(setAreCredentialsStored(areAllCredentialsStored));
    setMessages(initMessages);

    if (areAllCredentialsStored) {
      insertFrequencyMessage();
    }

    updateScheduleMode.current = !!clonedWorkflow?.periodic_task;

    if (updateScheduleMode.current) {
      insertFrequencyMessage();
      handleShowAllSteps();
    }
  };

  const loadWorkflowScheduleData = () => {
    setSchedulingData({
      ...schedulingData,
      ...clonedWorkflow?.periodic_task?.crontab,
      frequency: clonedWorkflow?.periodic_task?.frequency!,
    });
  };

  const handleShowAllSteps = () => {
    const availableSteps: IMessage[] = [];

    if (clonedWorkflow?.periodic_task?.frequency !== "hourly") {
      const schedulesMessage = createMessage({
        type: "schedule_time",
        text: "At what time?",
      });
      availableSteps.push(schedulesMessage);
    }

    if (workflow.has_output_notification) {
      const providersMessage = createMessage({
        type: "schedule_providers",
        text: "Where should we send your scheduled AI App?",
      });
      availableSteps.push(providersMessage);
    }

    // Update the state with new messages
    setMessages(prev => prev.concat(availableSteps));
  };

  // Handle the case of catching the oauth credential successfully connected
  useEffect(() => {
    if (areCredentialsStored && updateScheduleMode.current === false) {
      insertFrequencyMessage();
    }
  }, [areCredentialsStored]);

  // ClonedWorkflow always in sync with schedulingData
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

  // Pass run workflow generated execution as a new message after all prompts completed
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

  const insertFrequencyMessage = () => {
    const frequencyMessage = createMessage({
      type: "schedule_frequency",
      text: "How often do you want to repeat this AI App?",
    });
    setMessages(prev => prev.filter(msg => msg.type !== "schedule_frequency").concat(frequencyMessage));
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
    if (schedulingData.frequency === frequency) return;

    const scheduleData = { ...schedulingData, frequency };

    const isHourly = frequency === "hourly";
    const isNone = frequency === "none";

    if (isNone) {
      updateScheduleMode.current = true;
      setSchedulingData(scheduleData);
      setMessages(prevMessages =>
        prevMessages
          .filter(msg => msg.type !== "readyMessage" && !msg.isHighlight)
          .concat(createMessage({ type: "readyMessage" })),
      );

      return;
    }

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
      const response = await sendMessageAPI(webhook);

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
            setMessages(prev => prev.concat(executionMessage));
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
      dispatch(setGptGenerationStatus("pending"));
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

    if (updatedWorkflow) {
      runWorkflow();
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
    setMessages(prev => prev.concat(failMessage));
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
  };
};

export default useChat;
