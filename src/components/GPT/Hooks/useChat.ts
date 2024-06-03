import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { createMessage } from "@/components/Chat/helper";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { initialState, setAreCredentialsStored, setClonedWorkflow } from "@/core/store/chatSlice";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import { PROMPTIFY_NODE_TYPE, PROVIDERS, RESPOND_TO_WEBHOOK_NODE_TYPE, TIMES } from "@/components/GPT/Constants";
import { useUpdateWorkflowMutation } from "@/core/api/workflows";
import { cleanCredentialName, removeExistingProviderNode } from "@/components/GPTs/helpers";
import type { ProviderType } from "@/components/GPT/Types";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type {
  FrequencyType,
  IWorkflow,
  IWorkflowCreateResponse,
  IWorkflowSchedule,
} from "@/components/Automation/types";
import { IPromptInput } from "@/common/types/prompt";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import { N8N_RESPONSE_REGEX, extractWebhookPath } from "@/components/Automation/helpers";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";

interface Props {
  workflow: IWorkflow;
}

type WorkflowData = {
  [key: string]: any;
};

const useChat = ({ workflow }: Props) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { inputs, answers } = useAppSelector(state => state.chat ?? initialState);

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

  const { areCredentialsStored, clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);
  const { extractCredentialsInputFromNodes, checkAllCredentialsStored } = useCredentials();
  const { sendMessageAPI } = useWorkflow(workflow);
  const { streamExecutionHandler } = useGenerateExecution({});

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

    const updateWorkflowMessage = createMessage({
      type: "schedule_update",
      text: "",
    });
    availableSteps.push(updateWorkflowMessage);

    setMessages(prev => prev.concat(availableSteps));
  };

  useEffect(() => {
    if (areCredentialsStored && updateScheduleMode.current === false) {
      insertFrequencyMessage();
    }
  }, [areCredentialsStored]);

  useEffect(() => {
    if (schedulingData && clonedWorkflow) {
      dispatch(setClonedWorkflow({ ...clonedWorkflow, schedule: schedulingData }));
    }
  }, [schedulingData]);

  const insertFrequencyMessage = () => {
    const frequencyMessage = createMessage({
      type: "schedule_frequency",
      text: "How often do you want to repeat this GPT?",
    });
    setMessages(prev => prev.filter(msg => msg.type !== "schedule_frequency").concat(frequencyMessage));
  };

  const testGPT = () => {
    setSchedulingData({ ...schedulingData, frequency: "Test GPT" });
    setMessages(prev => prev.filter(msg => !["schedule_frequency", "schedule_time"].includes(msg.type)));
    insertProvidersMessages(
      "Great, We'll run this GPT for you, do you want to receive them in your favorite platforms?",
    );
  };

  const setScheduleFrequency = (frequency: FrequencyType) => {
    if (frequency === "Test GPT") {
      testGPT();
    } else {
      setSchedulingData({ ...schedulingData, frequency });
      if (!messages.find(msg => msg.type === "schedule_time")) {
        const timeMessage = createMessage({
          type: "schedule_time",
          text: "At what time?",
        });
        setMessages(prev => prev.filter(msg => msg.type !== "schedule_time").concat(timeMessage));
      }
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

    const hour = schedulingData?.hour ? ` at ${TIMES[schedulingData?.hour]}` : "";
    const message = `Awesome, We’ll run this GPT for you here ${schedulingData?.frequency}${hour}, do you want to receive them in your favorite platforms?`;
    insertProvidersMessages(message);
  };

  const insertProvidersMessages = (message: string) => {
    if (!messages.find(msg => msg.type === "schedule_providers")) {
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
    }
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
            streamExecutionHandler(response);
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

  const prepareWorkflow = async (providerType: ProviderType) => {
    let preparedMessages: IMessage[] = [];
    selectedProviderType.current = providerType;

    if (providerType === PROMPTIFY_NODE_TYPE) {
      const testWorkflowMessage = createMessage({
        type: "schedule_activation_test",
        text: "",
        noHeader: true,
      });
      preparedMessages.push(testWorkflowMessage);
    } else {
      const provider = PROVIDERS[providerType];
      const providerConnectionMessage = createMessage({
        type: "text",
        text: `${provider.name} has been connected successfully, we’ll be sending your results to your ${provider.name}`,
        isHighlight: true,
      });
      preparedMessages.push(providerConnectionMessage);

      if (updateScheduleMode.current) {
        const updateWorkflowMessage = createMessage({
          type: "schedule_update",
          text: "",
          noHeader: true,
        });
        preparedMessages.push(updateWorkflowMessage);
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

  const activateWorkflow = async () => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    if (selectedProviderType.current === PROMPTIFY_NODE_TYPE) {
      const respondToWebhookNode = clonedWorkflow.nodes.find(node => node.type === RESPOND_TO_WEBHOOK_NODE_TYPE);
      const cleanWorkflow = removeExistingProviderNode(
        structuredClone(clonedWorkflow),
        workflow,
        respondToWebhookNode?.name!,
      );
      await handleUpdateWorkflow(cleanWorkflow);
      executeWorkflow();
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
  };
};

export default useChat;
