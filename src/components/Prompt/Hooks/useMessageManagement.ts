import { useState, useEffect } from "react";

import { randomId } from "@/common/helpers";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAnswers, setIsSimulationStreaming } from "@/core/store/chatSlice";
import type { IPromptInput } from "@/common/types/prompt";
import type { IMessage } from "../Types/chat";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
  questionPrefixContent: string;
}

const createdAt = new Date();

function useMessageManagement({ questionPrefixContent, template }: Props) {
  const dispatch = useAppDispatch();

  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isSimulationStreaming = useAppSelector(state => state.chat.isSimulationStreaming);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);

  const addToQueuedMessages = (messages: IMessage[]) => {
    setQueuedMessages(messages);
    dispatch(setIsSimulationStreaming(true));
  };

  useEffect(() => {
    if (!isSimulationStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.pop()!;

      const updatedMessages = messages.concat(nextQueuedMessage);
      setMessages(updatedMessages);

      addToQueuedMessages(queuedMessages);
    }
  }, [isSimulationStreaming]);

  const initialMessages = ({ inputs, startOver = false }: { inputs: IPromptInput[]; startOver?: boolean }) => {
    const welcomeMessage: IMessage[] = [];
    const prefixedContent =
      questionPrefixContent ?? `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;

    if (!startOver) {
      let allQuestions = inputs.map(input => input.question);

      welcomeMessage.push({
        id: randomId(),
        text: `${prefixedContent} ${template?.title} ? ${allQuestions.join(" ")}`,
        type: "text",
        createdAt: createdAt,
        fromUser: false,
      });
    }

    addToQueuedMessages([
      {
        id: randomId(),
        text: "",
        type: "form",
        createdAt: createdAt,
        fromUser: false,
      },
    ]);

    setMessages(welcomeMessage);
    dispatch(setAnswers([]));
  };

  useEffect(() => {
    const sparkMessage: IMessage = {
      id: randomId(),
      text: "",
      type: "spark",
      createdAt: new Date(),
      fromUser: false,
      noHeader: true,
    };

    if (generatedExecution) {
      const filteredMessages = messages.filter(msg => msg.type !== "form");
      const sparkMessageExists = filteredMessages.some(msg => msg.type === "spark");

      if (!sparkMessageExists) {
        setMessages(filteredMessages.concat(sparkMessage));
      } else {
        setMessages(filteredMessages);
      }
    }
  }, [generatedExecution]);

  useEffect(() => {
    if (selectedExecution) {
      const sparkMessageExists = messages.some(msg => msg.type === "spark");
      const formMessageExists = messages.some(msg => msg.type === "form");

      let newMessages = [...messages];

      if (!sparkMessageExists) {
        const sparkMessage: IMessage = {
          id: randomId(),
          text: "",
          type: "spark",
          createdAt: new Date(),
          fromUser: false,
          noHeader: true,
        };
        newMessages.push(sparkMessage);
      }

      if (!formMessageExists) {
        const formMessage: IMessage = {
          id: randomId(),
          text: "",
          type: "form",
          createdAt: new Date(),
          fromUser: false,
        };
        newMessages.push(formMessage);
      }

      // Sort to ensure spark is always before form
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
  }, [selectedExecution]);

  const messageAnswersForm = (message: string) => {
    const botMessage: IMessage = {
      id: randomId(),
      text: message,
      type: "text",
      createdAt,
      fromUser: false,
    };

    addToQueuedMessages([
      {
        id: randomId(),
        text: "",
        type: "form",
        createdAt,
        fromUser: false,
        noHeader: true,
      },
    ]);

    setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(botMessage));
  };

  return { messages, setMessages, initialMessages, addToQueuedMessages, messageAnswersForm };
}

export default useMessageManagement;
