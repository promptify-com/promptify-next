import { useState, useEffect } from "react";

import { randomId } from "@/common/helpers";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAnswers, setIsSimulationStreaming } from "@/core/store/chatSlice";
import useVariant from "./useVariant";
import type { IPromptInput } from "@/common/types/prompt";
import type { IAnswer, IMessage, MessageType } from "../Types/chat";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
  questionPrefixContent: string;
}

const createdAt = new Date();

function useChat({ questionPrefixContent, template }: Props) {
  const dispatch = useAppDispatch();
  const { isVariantA, isVariantB } = useVariant();

  const currentUser = useAppSelector(state => state.user.currentUser);
  const { isSimulationStreaming, inputs, answers } = useAppSelector(state => state.chat);
  const { selectedExecution, generatedExecution, repeatedExecution, sparkHashQueryParam } = useAppSelector(
    state => state.executions,
  );

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [showGenerateButton, setShowGenerateButton] = useState(false);

  const createMessage = (type: MessageType, fromUser = false) => ({
    id: randomId(),
    text: "",
    type,
    createdAt: createdAt,
    fromUser,
  });

  const initialMessages = ({ questions }: { questions: IPromptInput[] }) => {
    const hasRequiredQuestion = questions.some(question => question.required);
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;
    const filteredQuestions = questions.map(_q => _q.question).filter(Boolean);

    const welcomeMessage = createMessage("text");
    welcomeMessage.text = `${questionPrefixContent ?? greeting} ${template.title}${
      filteredQuestions.length ? "? " + filteredQuestions.slice(0, 3).join(" ") : ""
    }`;
    const InitialMessages: IMessage[] = [welcomeMessage];

    if (hasRequiredQuestion && isVariantA) {
      const textMessage = createMessage("text");
      textMessage.text = "This is a list of information we need to execute this template:";
      InitialMessages.push(textMessage);
    }

    setMessages(InitialMessages);

    const formMessage = createMessage("form");

    if (!selectedExecution && isVariantB) {
      addToQueuedMessages([formMessage]);
    } else {
      addToQueuedMessages([formMessage]);
    }
    dispatch(setAnswers([]));

    if (sparkHashQueryParam) {
      const parameters = selectedExecution?.parameters;

      if (!!Object.keys(parameters ?? {}).length) {
        const newAnswers = Object.keys(parameters!)
          .map(promptId => {
            const param = parameters![promptId];

            if (!param) {
              return;
            }

            return Object.keys(param).map(inputName => ({
              inputName,
              required: true,
              question: "",
              answer: param[inputName],
              prompt: parseInt(promptId),
              error: false,
            }));
          })
          .filter(data => Array.isArray(data))
          .flat() as IAnswer[];

        setTimeout(() => {
          dispatch(setAnswers(newAnswers));
        }, 50);
      }
    }
  };

  const messageAnswersForm = (message: string) => {
    const botMessage = createMessage("text");
    botMessage.text = message;
    addToQueuedMessages([createMessage("form")]);
    setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(botMessage));
  };

  const addToQueuedMessages = (messages: IMessage[]) => {
    setTimeout(() => {
      setQueuedMessages(messages);
    }, 10);
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

  function updateMessageForRepeatedExecution() {
    if (!repeatedExecution) return;
    const isReady = allRequiredInputsAnswered() ? " We are ready to create a new document." : "";
    messageAnswersForm(`Ok!${isReady} I have prepared the incoming parameters, please check!`);
  }

  const allRequiredInputsAnswered = (): boolean => {
    const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);

    if (!requiredQuestionNames.length) {
      return true;
    }

    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));

    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  };

  useEffect(() => {
    if (isVariantA) return;
    updateMessagesForGeneratedExecution();
  }, [generatedExecution]);

  useEffect(() => {
    if (isVariantA) return;
    updateMessagesForSelectedExecution();
  }, [selectedExecution, repeatedExecution]);

  useEffect(() => {
    if (!isVariantA) return;
    updateMessageForRepeatedExecution();
  }, [repeatedExecution]);

  useEffect(() => {
    proccedQueuedMessages();
  }, [isSimulationStreaming, queuedMessages]);

  useEffect(() => {
    if (allRequiredInputsAnswered()) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [answers, inputs]);

  return {
    messages,
    setMessages,
    initialMessages,
    addToQueuedMessages,
    messageAnswersForm,
    showGenerateButton,
    allRequiredInputsAnswered,
  };
}

export default useChat;
