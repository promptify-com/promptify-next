import { useEffect, useState } from "react";
import { randomId } from "@/common/helpers";

import { extractTemplateIDs, fetchData, sendMessageAPI } from "@/components/Chat/helper";
import type { IMessage, MessageType } from "@/components/Prompt/Types/chat";
import type { Templates } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";

interface CreateMessageProps {
  type: MessageType;
  fromUser?: boolean;
  noHeader?: boolean;
  timestamp?: string;
}

const useMessageManager = () => {
  const selectedTemplate = useAppSelector(state => state.chat.selectedTemplate);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [suggestedTemplates, setSuggestedTemplates] = useState<Templates[]>([]);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [chatMode, setChatMode] = useState<"automation" | "messages">("automation");

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }
    const runMessage = createMessage({ type: "text", fromUser: true });
    runMessage.text = `Run "${selectedTemplate.title}"`;
    setMessages(prevMessages => prevMessages.concat(runMessage));
  }, [selectedTemplate]);

  const createMessage = ({
    type,
    timestamp = new Date().toISOString(),
    fromUser = false,
    noHeader = false,
  }: CreateMessageProps) => ({
    id: randomId(),
    text: "",
    type,
    createdAt: timestamp,
    fromUser,
    noHeader,
  });

  const submitMessage = async (input: string) => {
    if (input) {
      const userMessage = createMessage({ type: "text", fromUser: true });
      userMessage.text = input;

      setMessages(prevMessages => prevMessages.concat(userMessage));
      setIsValidatingAnswer(true);

      const botMessage: IMessage = {
        id: randomId(),
        text: "",
        createdAt: new Date().toISOString(),
        fromUser: false,
        type: "text",
      };

      try {
        const sendMessageResponse = await sendMessageAPI(input);

        if (sendMessageResponse.message) {
          botMessage.text = sendMessageResponse.message;
        } else {
          const templateIDs = extractTemplateIDs(sendMessageResponse.output!);

          if (!templateIDs.length) {
            botMessage.text = sendMessageResponse.output!;
          } else {
            if (!!templateIDs.length) {
              const templates = await fetchData(templateIDs);
              setSuggestedTemplates(templates);
              const suggestionsMessage = createMessage({ type: "suggestedTemplates" });
              suggestionsMessage.text = "I found this prompts, following your request:";

              setMessages(prevMessages => prevMessages.concat(suggestionsMessage));
            }
          }
        }
      } catch (err) {
        botMessage.text = "Oops! I couldn't get your request, Please try again. " + err;
      } finally {
        setIsValidatingAnswer(false);
      }

      if (botMessage.text !== "") {
        setMessages(prevMessages => prevMessages.concat(botMessage));
      }
    }
  };

  const handleSubmitInput = (input: string) => (chatMode === "automation" ? submitMessage(input) : () => {});

  return { messages, handleSubmitInput, isValidatingAnswer, suggestedTemplates };
};

export default useMessageManager;
