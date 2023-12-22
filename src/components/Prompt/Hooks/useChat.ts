import { useState, useEffect } from "react";

import { randomId } from "@/common/helpers";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAnswers, setIsSimulationStreaming } from "@/core/store/chatSlice";
import type { IPromptInput } from "@/common/types/prompt";
import type { IMessage, MessageType } from "../Types/chat";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
  questionPrefixContent: string;
}

const createdAt = new Date();

function useChat({ questionPrefixContent, template }: Props) {
  const dispatch = useAppDispatch();

  const { selectedExecution, generatedExecution, repeatedExecution } = useAppSelector(state => state.executions);

  const currentUser = useAppSelector(state => state.user.currentUser);
  const isSimulationStreaming = useAppSelector(state => state.chat.isSimulationStreaming);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);

  const createMessage = (type: MessageType, fromUser = false) => ({
    id: randomId(),
    text: "",
    type,
    createdAt: createdAt,
    fromUser,
  });

  const initialMessages = ({ inputs }: { inputs: IPromptInput[] }) => {
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;
    const allQuestions = inputs.map(input => input.question);

    const welcomeMessage = createMessage("text");
    welcomeMessage.text = `${questionPrefixContent ?? greeting} ${template.title} ? ${allQuestions.join(" ")}`;

    setMessages([welcomeMessage]);
    if (!selectedExecution) {
      addToQueuedMessages([createMessage("form")]);
    }
    dispatch(setAnswers([]));
  };

  const addToQueuedMessages = (messages: IMessage[]) => {
    setTimeout(() => {
      setQueuedMessages(messages);
    }, 10);
  };

  const messageAnswersForm = (message: string) => {
    const botMessage = createMessage("text");
    botMessage.text = message;

    addToQueuedMessages([createMessage("form")]);
    setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(botMessage));
  };

  const proccedQueuedMessages = () => {
    if (!isSimulationStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.shift()!;
      dispatch(setIsSimulationStreaming(true));

      setMessages(currentMessages => currentMessages.concat(nextQueuedMessage));
      addToQueuedMessages(queuedMessages);
    }
  };

  function updateMessagesForGeneratedExecution() {
    if (!generatedExecution) return;

    const filteredMessages = messages.filter(msg => msg.type !== "form");

    const sparkMessageExists = filteredMessages.some(msg => msg.type === "spark");

    if (!sparkMessageExists) {
      filteredMessages.push(createMessage("spark"));
    }

    setMessages(filteredMessages);
  }

  function updateMessagesForSelectedExecution() {
    if (!selectedExecution) return;

    let newMessages = [...messages];

    const sparkMessageExists = newMessages.some(msg => msg.type === "spark");

    const formMessageExists = newMessages.some(msg => msg.type === "form");
    const formMessageExistsInQueue = queuedMessages.some(msg => msg.type === "form");

    if (!sparkMessageExists) {
      newMessages.push(createMessage("spark"));
    }

    if (!formMessageExists && (!generatedExecution || repeatedExecution)) {
      newMessages.push(createMessage("form"));
    }

    newMessages.sort((a, b) => {
      if (a.type === "spark" && b.type === "form") {
        return -1;
      } else if (a.type === "form" && b.type === "spark") {
        return 1;
      }
      return 0;
    });

    setMessages(newMessages);
  }

  useEffect(() => {
    updateMessagesForGeneratedExecution();
  }, [generatedExecution]);

  useEffect(() => {
    updateMessagesForSelectedExecution();
  }, [selectedExecution, repeatedExecution]);

  useEffect(() => {
    proccedQueuedMessages();
  }, [isSimulationStreaming, queuedMessages]);

  return { messages, setMessages, initialMessages, addToQueuedMessages, messageAnswersForm };
}

export default useChat;
