import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { createMessage } from "@/components/Chat/helper";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { setAreCredentialsStored, setClonedWorkflow } from "@/core/store/chatSlice";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import { initialState as initialExecutionsState } from "@/core/store/executionsSlice";
import { PROMPTIFY_NODE_TYPE, PROVIDERS, TIMES } from "@/components/GPT/Constants";
import { useUpdateWorkflowMutation } from "@/core/api/workflows";
import { cleanCredentialName, isNodeProvider, removeProviderNode } from "@/components/GPTs/helpers";
import type { ProviderType } from "@/components/GPT/Types";
import type { IMessage, MessageType } from "@/components/Prompt/Types/chat";
import type {
  FrequencyType,
  ITemplateWorkflow,
  IWorkflowCreateResponse,
  IWorkflowSchedule,
} from "@/components/Automation/types";
import { IPromptInput } from "@/common/types/prompt";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import { N8N_RESPONSE_REGEX, extractWebhookPath } from "@/components/Automation/helpers";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";

interface Props {
  workflow: ITemplateWorkflow;
}

type WorkflowData = {
  [key: string]: any;
};

const useChat = ({ workflow }: Props) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { inputs, answers, areCredentialsStored, clonedWorkflow } = useAppSelector(
    state => state.chat ?? initialChatState,
  );
  const { generatedExecution } = useAppSelector(state => state.executions ?? initialExecutionsState);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const updateScheduleMode = useRef<boolean | null>(null);
  const selectedProviderType = useRef<ProviderType | null>(null);
  const [schedulingData, setSchedulingData] = useState<IWorkflowSchedule>({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    workflow_data: {} as WorkflowData,
    frequency: "daily",
    hour: 0,
    minute: 0,
    day_of_week: 0,
    day_of_month: 0,
  });
  const messagesMemo = useRef<IMessage[]>([]);

  const { extractCredentialsInputFromNodes, checkAllCredentialsStored } = useCredentials();
  const { sendMessageAPI } = useWorkflow(workflow);
  const { streamExecutionHandler } = useGenerateExecution({});

  const autoSaveAllowed = updateScheduleMode.current && schedulingData.frequency !== "Test GPT";

  const [updateWorkflow] = useUpdateWorkflowMutation();

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
        text: `Connect your ${credentialsInput.map(cred => cleanCredentialName(cred.displayName)).join(",")}:`,
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
      showAllSteps();
    }
  };

  const loadWorkflowScheduleData = () => {
    setSchedulingData({ ...schedulingData, ...clonedWorkflow?.periodic_task?.crontab });
  };

  const showAllSteps = () => {
    const availableSteps: IMessage[] = [];
    const schedulesMessage = createMessage({
      type: "schedule_time",
      text: "At what time?",
    });
    const providersMessage = createMessage({
      type: "schedule_providers",
      text: "Where should we send your scheduled GPT?",
    });

    availableSteps.push(schedulesMessage, providersMessage);

    const inputs: IPromptInput[] = workflow.data.nodes
      .filter(node => node.type === "n8n-nodes-base.set")
      .flatMap(node => node.parameters.fields?.values ?? node.parameters.assignments?.assignments ?? [])
      .map(value => ({
        name: value.name,
        fullName: value.name,
        type: "text",
        required: true,
      }));

    if (inputs.length > 0) {
      const inputsMessage = createMessage({
        type: "form",
        text: "Please fill out the following details:",
      });
      availableSteps.push(inputsMessage);
    }

    setMessages(prev => prev.concat(availableSteps));
  };

  useEffect(() => {
    if (areCredentialsStored && updateScheduleMode.current === false) {
      insertFrequencyMessage();
    }
  }, [areCredentialsStored]);

  useEffect(() => {
    if (clonedWorkflow) {
      dispatch(setClonedWorkflow({ ...clonedWorkflow, schedule: schedulingData }));

      // Workflow update mode auto updates
      if (autoSaveAllowed) {
        handleUpdateWorkflow({
          ...clonedWorkflow,
          schedule: schedulingData,
        });
      }
    }
  }, [schedulingData]);

  const insertFrequencyMessage = () => {
    const frequencyMessage = createMessage({
      type: "schedule_frequency",
      text: "How often do you want to repeat this GPT?",
    });
    setMessages(prev => prev.filter(msg => msg.type !== "schedule_frequency").concat(frequencyMessage));
  };

  const cleanMessagesAfterType = (messages: IMessage[], type: MessageType) =>
    messages.slice(0, messages.findIndex(msg => msg.type === type) + 1);

  useEffect(() => {
    if (schedulingData.frequency !== "Test GPT") {
      messagesMemo.current = messages;
    }
  }, [messages]);

  const testGPT = () => {
    setMessages(cleanMessagesAfterType(messages, "schedule_frequency"));

    insertProvidersMessages(
      "Great, let's test this GPT for you, do you want to receive them in your favorite platforms?",
    );

    if (selectedProviderType.current) {
      const testWorkflowMessage = createMessage({
        type: "schedule_activation_test",
        text: "",
        noHeader: true,
      });
      setMessages(prev => prev.concat(testWorkflowMessage));
    }
  };

  const setScheduleFrequency = (frequency: FrequencyType) => {
    if (schedulingData.frequency === frequency) return;

    setSchedulingData({ ...schedulingData, frequency });

    if (frequency === "Test GPT") {
      testGPT();
    } else {
      const _messages = messagesMemo.current;
      if (!_messages.find(msg => msg.type === "schedule_time")) {
        const timeMessage = createMessage({
          type: "schedule_time",
          text: "At what time?",
        });
        _messages.push(timeMessage);
      }
      setMessages(_messages);
    }
  };

  const setScheduleTime = (frequencyTime: { day?: number; time: number }) => {
    const isWeekly = schedulingData?.frequency === "weekly";
    const day = frequencyTime.day ?? 0;
    const frequencyDay = isWeekly ? { day_of_week: day } : { day_of_month: day };
    setSchedulingData({
      ...schedulingData,
      ...frequencyDay,
      hour: frequencyTime.time,
    });

    if (!messages.find(msg => msg.type === "schedule_providers")) {
      const hour = schedulingData?.hour ? ` at ${TIMES[schedulingData?.hour]}` : "";
      const message = `Awesome, We’ll run this GPT for you here ${schedulingData?.frequency}${hour}, do you want to receive them in your favorite platforms?`;
      insertProvidersMessages(message);
    }
  };

  const insertProvidersMessages = (message: string) => {
    const confirmMessage = createMessage({
      type: "text",
      text: message,
      isHighlight: true,
    });
    const providersMessage = createMessage({
      type: "schedule_providers",
      text: "Where should we send your scheduled GPT?",
    });
    setMessages(prev =>
      prev.filter(msg => msg.type !== "schedule_providers").concat([confirmMessage, providersMessage]),
    );
  };

  const executeWorkflow = async () => {
    try {
      const webhook = extractWebhookPath(clonedWorkflow?.nodes ?? []);
      const response = await sendMessageAPI(webhook);
      if (response && typeof response === "string") {
        if (response.toLowerCase().includes("[error")) {
          failedExecutionHandler();
        } else {
          const match = new RegExp(N8N_RESPONSE_REGEX).exec(response);

          if (!match) {
            const responseMessage = createMessage({
              type: "html",
              text: response,
            });
            setMessages(prev => prev.concat(responseMessage));
          } else if (!match[2] || match[2] === "undefined") {
            failedExecutionHandler();
          } else {
            await streamExecutionHandler(response);
          }
        }
      }
    } catch (error) {
      failedExecutionHandler();
    }
  };

  const failedExecutionHandler = () => {
    const failMessage = createMessage({
      type: "text",
      text: "Running your GPT failed, please try again.",
    });
    setMessages(prev => prev.concat(failMessage));
  };

  useEffect(() => {
    if (generatedExecution?.data?.length && generatedExecution.hasNext === false) {
      const title = generatedExecution.temp_title;
      const promptsOutput = generatedExecution.data.map(data => data.message).join(" ");
      const output = title ? `# ${title}\n\n${promptsOutput}` : promptsOutput;
      const executionMessage = createMessage({
        type: "html",
        text: output,
      });
      setMessages(prev => prev.concat(executionMessage));
    }
  }, [generatedExecution]);

  const prepareWorkflow = async (providerType: ProviderType, generatedWorkflow: IWorkflowCreateResponse) => {
    let preparedMessages: IMessage[] = [];
    selectedProviderType.current = providerType;

    if (schedulingData.frequency === "Test GPT") {
      const testWorkflowMessage = createMessage({
        type: "schedule_activation_test",
        text: "",
        noHeader: true,
      });

      if (inputs.length > 0) {
        const inputsMessage = createMessage({
          type: "form",
          text: "Please fill out the following details:",
          noHeader: true,
        });
        preparedMessages.push(inputsMessage);
      }

      preparedMessages.push(testWorkflowMessage);
    } else {
      const provider = PROVIDERS[providerType];
      const providerConnectionMessage = createMessage({
        type: "text",
        text: `${provider.name} has been connected successfully, we’ll be sending your results to your ${provider.name}`,
        isHighlight: true,
      });
      preparedMessages.push(providerConnectionMessage);

      if (autoSaveAllowed) {
        handleUpdateWorkflow(generatedWorkflow);
      } else {
        const activationMessage = createMessage({
          type: "schedule_activation",
          text: "",
          noHeader: true,
        });

        if (inputs.length > 0) {
          const inputsMessage = createMessage({
            type: "form",
            text: "Please fill out the following details:",
            noHeader: true,
          });
          preparedMessages.push(inputsMessage);
        }

        preparedMessages.push(activationMessage);
      }
    }

    setMessages(prevMessages =>
      prevMessages
        .filter(msg => !["schedule_activation", "schedule_update", "schedule_activation_test"].includes(msg.type))
        .concat(preparedMessages),
    );
  };

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

  const handleUpdateWorkflow = async (workflow?: IWorkflowCreateResponse) => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    try {
      await updateWorkflow({
        workflowId: workflow?.id ?? clonedWorkflow.id,
        data: workflow ?? clonedWorkflow,
      });
    } catch (error) {
      const errorMessage = createMessage({
        type: "text",
        text: "Activating your GPT failed, please try again.",
      });
      setMessages(prev => prev.concat(errorMessage));
    }
  };

  const removeProvider = (providerName: string, shouldUpdate = true) => {
    let _clonedWorkflow = structuredClone(clonedWorkflow)!;
    _clonedWorkflow = removeProviderNode(_clonedWorkflow, providerName);
    if (shouldUpdate) {
      dispatch(setClonedWorkflow(_clonedWorkflow));
    }

    if (autoSaveAllowed) {
      handleUpdateWorkflow(_clonedWorkflow);
    }

    return _clonedWorkflow;
  };

  const activateWorkflow = async () => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    if (schedulingData.frequency === "Test GPT") {
      let cleanWorkflow = structuredClone(clonedWorkflow);
      if (selectedProviderType.current === PROMPTIFY_NODE_TYPE) {
        const promptifyNode = cleanWorkflow.nodes.reverse().find(node => node.type === PROMPTIFY_NODE_TYPE);
        if (!promptifyNode) {
          throw new Error("Promptify provider node not found");
        }

        const isProvider = isNodeProvider(cleanWorkflow, promptifyNode.id);
        if (!isProvider) {
          throw new Error("Promptify provider node not found");
        }

        cleanWorkflow = removeProvider(promptifyNode.name, false);
      }
      await handleUpdateWorkflow(cleanWorkflow);
      await executeWorkflow();
    } else {
      await handleUpdateWorkflow();

      const finishMessage = createMessage({
        type: "text",
        text: "GPT scheduled successfully.",
        isHighlight: true,
      });
      setMessages(prev => prev.filter(msg => msg.type !== "schedule_activation").concat(finishMessage));

      window.location.reload();
    }
  };

  return {
    messages,
    initialMessages,
    setScheduleFrequency,
    setScheduleTime,
    prepareWorkflow,
    activateWorkflow,
    removeProvider,
  };
};

export default useChat;
