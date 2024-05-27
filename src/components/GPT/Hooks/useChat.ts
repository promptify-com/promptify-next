import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { IWorkflow } from "@/components/Automation/types";
import { createMessage } from "@/components/Chat/helper";
import { IMessage } from "@/components/Prompt/Types/chat";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { setAreCredentialsStored } from "@/core/store/chatSlice";

interface IScheduleData {
  frequency?: string;
  time?: string;
}

interface Props {
  workflow: IWorkflow;
}

const useChat = ({ workflow }: Props) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const schedulingData = useRef<IScheduleData | null>(null);

  const { extractCredentialsInputFromNodes, checkAllCredentialsStored } = useCredentials();

  const initialMessages = async () => {
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on  ${
      workflow.name
    }?`;
    const welcomeMessage = createMessage({ type: "text", text: greeting });

    const credentialsInput = await extractCredentialsInputFromNodes(workflow.data.nodes);
    let areAllCredentialsStored = true;
    areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);
    dispatch(setAreCredentialsStored(areAllCredentialsStored));
    const credentialsMessage = createMessage({
      type: "credentials",
      text: `Connect your ${credentialsInput.map(cred => cred.displayName).join(",")}:`,
    });
    const startScheduleMessage = createMessage({
      type: "text",
      text: "Do you want to schedule this GPT?",
    });
    const choicesMessage = createMessage({
      type: "schedule_start",
      text: "",
      fromUser: true,
    });
    setMessages([welcomeMessage, credentialsMessage, startScheduleMessage, choicesMessage]);
  };

  const startSchedule = () => {
    const frequencyMessage = createMessage({
      type: "schedule_frequency",
      text: "How often do you want to repeat this GPT?",
    });
    setMessages(prev => prev.filter(msg => msg.type !== "schedule_frequency").concat(frequencyMessage));
  };

  const cancelSchedule = () => {
    const cancelMessage = createMessage({
      type: "text",
      text: "Got it, scheduling canceled.",
    });
    setMessages(prev => prev.concat(cancelMessage));
  };

  const setScheduleFrequency = (frequency: string) => {
    schedulingData.current = { ...schedulingData.current, frequency };
    const timeMessage = createMessage({
      type: "schedule_time",
      text: "At what time?",
    });
    setMessages(prev => prev.filter(msg => msg.type !== "schedule_time").concat(timeMessage));
  };

  const setScheduleTime = (time: string) => {
    schedulingData.current = { ...schedulingData.current, time };
    const confirmMessage = createMessage({
      type: "text",
      text: `Awesome, We’ll run this GPT for you here ${schedulingData.current.frequency} at ${schedulingData.current.time}, do you want to receive them in your favorite platforms?`,
      isHighlight: true,
    });
    const providersMessage = createMessage({
      type: "text",
      text: "Where should we send your scheduled GPT?",
      noHeader: true,
    });
    setMessages(prev => prev.concat([confirmMessage, providersMessage]));
  };

  return {
    messages,
    initialMessages,
    startSchedule,
    cancelSchedule,
    setScheduleFrequency,
    setScheduleTime,
  };
};

export default useChat;
