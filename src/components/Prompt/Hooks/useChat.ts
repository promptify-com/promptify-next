import { useState, useEffect } from "react";

import { randomId } from "@/common/helpers";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAnswers, setIsSimulationStreaming, setparamsValues } from "@/core/store/chatSlice";
import useVariant from "./useVariant";
import useToken from "@/hooks/useToken";
import { vary } from "@/common/helpers/varyValidator";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import type { IPromptInput } from "@/common/types/prompt";
import type { IAnswer, IMessage, MessageType } from "../Types/chat";
import type { PromptInputType } from "@/components/Prompt/Types";
import type { ContextualOverrides, ResOverrides } from "@/core/api/dto/prompts";
import { useRouter } from "next/router";

interface Props {
  initialMessageTitle: string;
  questionPrefixContent?: string;
}

const createdAt = new Date();

function useChat({ questionPrefixContent, initialMessageTitle }: Props) {
  const token = useToken();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isVariantA, isVariantB } = useVariant();

  const currentUser = useAppSelector(state => state.user.currentUser);
  const { isSimulationStreaming, inputs, answers } = useAppSelector(state => state.chat);
  const { selectedExecution, generatedExecution, repeatedExecution, sparkHashQueryParam } = useAppSelector(
    state => state.executions,
  );

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);

  const showGenerate =
    !isSimulationStreaming && (showGenerateButton || Boolean(!inputs.length || !inputs[0]?.required));

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
    welcomeMessage.text = `${questionPrefixContent ?? greeting} ${initialMessageTitle}${
      filteredQuestions.length ? "? " + filteredQuestions.slice(0, 3).join(" ") : ""
    }`;
    const InitialMessages: IMessage[] = [welcomeMessage];
    const initialQueuedMessages: IMessage[] = [];

    if (hasRequiredQuestion && isVariantA) {
      const textMessage = createMessage("text");
      textMessage.text = "This is a list of information we need to execute this template:";
      initialQueuedMessages.push(textMessage);
    }

    setMessages(InitialMessages);

    const formMessage = createMessage("form");

    if (!router.query?.hash && isVariantB) {
      initialQueuedMessages.push(formMessage);
      addToQueuedMessages(initialQueuedMessages);
    } else if (isVariantA) {
      initialQueuedMessages.push(formMessage);
      addToQueuedMessages(initialQueuedMessages);
    }

    dispatch(setAnswers([]));
  };

  const validateVary = async (variation: string) => {
    dispatch(setSelectedExecution(null));
    dispatch(setGeneratedExecution(null));
    if (variation) {
      const userMessage: IMessage = {
        id: randomId(),
        text: variation,
        type: "text",
        createdAt: new Date(new Date().getTime() - 1000),
        fromUser: true,
      };

      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.type !== "form" && msg.type !== "spark").concat(userMessage),
      );

      setIsValidatingAnswer(true);

      const questionAnswerMap: Record<string, PromptInputType> = {};
      inputs.forEach(input => {
        const matchingAnswer = answers.find(answer => answer.inputName === input.name);
        questionAnswerMap[input.name] = matchingAnswer?.answer ?? "";
      });

      const payload = {
        prompt: variation,
        variables: questionAnswerMap,
      };

      const varyResponse = await vary({ token, payload });

      if (typeof varyResponse === "string") {
        setIsValidatingAnswer(false);
        messageAnswersForm("Oops! I couldn't get your reponse, Please try again.");
        return;
      }

      const newAnswers: IAnswer[] = inputs
        .map(input => {
          const { name: inputName, required, question, prompt } = input;
          const answer = varyResponse[input.name];
          const promptId = prompt!;

          return {
            inputName,
            required,
            question: question ?? "",
            prompt: promptId,
            answer,
          };
        })
        .filter(answer => answer.answer);
      dispatch(setAnswers(newAnswers));
      setIsValidatingAnswer(false);

      const isReady = allRequiredInputsAnswered() ? " Let’s imagine something like this! Prepared request for you" : "";
      messageAnswersForm(`Ok!${isReady}, please check input information and we are ready to start!`);
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
    if (router.query?.hash && !sparkHashQueryParam) {
      return;
    }

    if (sparkHashQueryParam) {
      const parameters = selectedExecution?.parameters;
      const contextualOverrides = selectedExecution?.contextual_overrides;

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

        dispatch(setAnswers(newAnswers));
      }

      if (!!Object.keys(contextualOverrides ?? {}).length) {
        const newContextualOverrides = Object.keys(contextualOverrides!)
          .map(promptId => {
            const param = contextualOverrides![promptId];

            if (!param?.length) {
              return;
            }

            const newParam = param.map((parameter: ContextualOverrides) => ({
              parameter: parameter.parameter,
              score: parameter.score,
            }));

            return {
              contextual_overrides: newParam,
              id: parseInt(promptId),
            };
          })
          .filter(item => item !== undefined) as ResOverrides[];

        dispatch(setparamsValues(newContextualOverrides));
      }
    }
  }, [sparkHashQueryParam]);

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
    messageAnswersForm,
    showGenerateButton,
    showGenerate,
    isValidatingAnswer,
    setIsValidatingAnswer,
    validateVary,
  };
}

export default useChat;
