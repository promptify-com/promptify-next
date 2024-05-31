import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type {
  FrequencyType,
  IWorkflow,
  IWorkflowCreateResponse,
  IWorkflowSchedule,
} from "@/components/Automation/types";
import { createMessage } from "@/components/Chat/helper";
import type { IMessage } from "@/components/Prompt/Types/chat";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { setAreCredentialsStored, setClonedWorkflow } from "@/core/store/chatSlice";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import type { ProviderType } from "@/components/GPT/Types";
import { PROVIDERS, TIMES } from "@/components/GPT/Constants";
import { getTimezone } from "@/common/helpers/timeManipulation";
import { useUpdateWorkflowMutation } from "@/core/api/workflows";

interface Props {
  workflow: IWorkflow;
}

const useChat = ({ workflow }: Props) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const inputs = useAppSelector(state => state.chat?.inputs ?? []);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [schedulingData, setSchedulingData] = useState<IWorkflowSchedule>({
    timezone: getTimezone()!,
    workflow_data: {},
    frequency: "daily",
    hour: 0,
    minute: 0,
    day_of_week: 0,
    day_of_month: 0,
  });

  const { areCredentialsStored, clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);
  const { extractCredentialsInputFromNodes, checkAllCredentialsStored } = useCredentials();
  const [updateWorkflow] = useUpdateWorkflowMutation();

  const initialMessages = async () => {
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
        text: `Connect your ${credentialsInput.map(cred => cred.displayName).join(",")}:`,
      });
      initMessages.push(credentialsMessage);
    }
    dispatch(setAreCredentialsStored(areAllCredentialsStored));
    setMessages(initMessages);
  };

  useEffect(() => {
    if (!areCredentialsStored) return;

    const frequencyMessage = createMessage({
      type: "schedule_frequency",
      text: "How often do you want to repeat this GPT?",
    });
    setMessages(prev => prev.filter(msg => msg.type !== "schedule_frequency").concat(frequencyMessage));
  }, [areCredentialsStored]);

  useEffect(() => {
    if (schedulingData && clonedWorkflow) {
      dispatch(setClonedWorkflow({ ...clonedWorkflow, schedule: schedulingData }));
    }
  }, [schedulingData]);

  const setScheduleFrequency = (frequency: FrequencyType) => {
    setSchedulingData({ ...schedulingData, frequency });
    if (!messages.find(msg => msg.type === "schedule_time")) {
      const timeMessage = createMessage({
        type: "schedule_time",
        text: "At what time?",
      });
      setMessages(prev => prev.filter(msg => msg.type !== "schedule_time").concat(timeMessage));
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
      const confirmMessage = createMessage({
        type: "text",
        text: `Awesome, We’ll run this GPT for you here ${schedulingData?.frequency}${hour}, do you want to receive them in your favorite platforms?`,
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

  const prepareWorkflow = (providerType: ProviderType) => {
    const provider = PROVIDERS[providerType];
    const providerConnectionMessage = createMessage({
      type: "text",
      text: `${provider.name} has been connected successfully, we’ll be sending your results to your ${provider.name}`,
      isHighlight: true,
    });

    const activationMessage = createMessage({
      type: "schedule_activation",
      text: "Ready to turn on this GPT?",
    });

    setMessages(prev => {
      const newMessages = [...prev, providerConnectionMessage];

      if (inputs.length > 0) {
        const inputsMessage = createMessage({
          type: "form",
          text: "Please fill out the following details:",
        });
        newMessages.push(inputsMessage);
      }

      newMessages.push(activationMessage);
      return newMessages;
    });
  };

  const activateWorkflow = () => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    try {
      updateWorkflow({
        workflowId: clonedWorkflow.id,
        data: clonedWorkflow,
      });

      const finishMessage = createMessage({
        type: "text",
        text: "GPT scheduled successfully.",
        isHighlight: true,
      });
      setMessages(prev => prev.filter(msg => msg.type !== "schedule_activation").concat(finishMessage));
    } catch (error) {
      console.error("Error updating workflow:", error);
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
