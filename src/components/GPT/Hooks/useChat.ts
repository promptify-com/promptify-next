import { useState } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { IWorkflow } from "@/components/Automation/types";
import { createMessage } from "@/components/Chat/helper";
import { IMessage } from "@/components/Prompt/Types/chat";
import useCredentials from "@/components/Automation/Hooks/useCredentials";

interface Props {
  workflow: IWorkflow;
}

const useChat = ({ workflow }: Props) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { extractCredentialsInputFromNodes } = useCredentials();

  const initialMessages = async () => {
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on  ${
      workflow.name
    }?`;
    const welcomeMessage = createMessage({ type: "text", text: greeting });

    // const credentials = workflow.data.nodes.map(node => node.credentials).map(cred => cred?.[1].name);
    const credentials = await extractCredentialsInputFromNodes(workflow.data.nodes);
    console.log(credentials);
    const credentialsMessage = createMessage({
      type: "credentials",
      noHeader: true,
      text: `Connect your ${credentials.map(cred => cred.displayName).join(",")}`,
    });
    setMessages([welcomeMessage, credentialsMessage]);
  };

  return {
    messages,
    initialMessages,
  };
};

export default useChat;
