import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { randomId } from "@/common/helpers";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAnswers, setIsSimulationStreaming, setParamsValues } from "@/core/store/chatSlice";
import useVariant from "./useVariant";
import useToken from "@/hooks/useToken";
import { vary } from "@/common/helpers/varyValidator";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { ContextualOverrides, ResOverrides } from "@/core/api/dto/prompts";
import { useStoreAnswersAndParams } from "@/hooks/useStoreAnswersAndParams";
import type { IPromptInput } from "@/common/types/prompt";
import type { IAnswer, IMessage, MessageType } from "@/components/Prompt/Types/chat";
import type { PromptInputType } from "@/components/Prompt/Types";

interface Props {
  initialMessageTitle: string;
  questionPrefixContent?: string;
}

interface CreateMessageProps {
  type: MessageType;
  fromUser?: boolean;
  noHeader?: boolean;
  timestamp?: string;
}

function useChat({ questionPrefixContent, initialMessageTitle }: Props) {
  const token = useToken();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isVariantA, isVariantB, isAutomationPage } = useVariant();

  const currentUser = useAppSelector(state => state.user.currentUser);
  const { isSimulationStreaming, inputs, answers, paramsValues, tmpMessages } = useAppSelector(state => state.chat);
  const { selectedExecution, generatedExecution, repeatedExecution, sparkHashQueryParam } = useAppSelector(
    state => state.executions,
  );

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);

  const { storeAnswers, storeParams } = useStoreAnswersAndParams();

  useEffect(() => {
    if (Array.isArray(tmpMessages)) {
      setMessages(tmpMessages);
    }
  }, [tmpMessages]);

  // TODO: this gets complicated, needs to be simplified
  const showGenerate = isVariantB
    ? !isSimulationStreaming && (showGenerateButton || Boolean(!inputs.length || !inputs[0]?.required))
    : !isSimulationStreaming &&
      ((showGenerateButton && messages[messages.length - 1]?.type !== "spark") ||
        Boolean(!inputs.length || !inputs[0]?.required));

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

  const initialMessages = ({ questions }: { questions: IPromptInput[] }) => {
    const hasRequiredQuestion = questions.some(question => question.required);
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;
    const filteredQuestions = questions.map(_q => _q.question).filter(Boolean);

    const welcomeMessage = createMessage({ type: "text" });
    welcomeMessage.text = `${questionPrefixContent ?? greeting} ${initialMessageTitle}${
      filteredQuestions.length ? "? " + filteredQuestions.slice(0, 3).join(" ") : ""
    }`;
    const InitialMessages: IMessage[] = [welcomeMessage];
    const initialQueuedMessages: IMessage[] = [];

    if (hasRequiredQuestion && isVariantA) {
      const textMessage = createMessage({ type: "text", noHeader: true });
      textMessage.text = "This is a list of information we need to execute this template:";
      textMessage.noHeader = true;
      initialQueuedMessages.push(textMessage);
    }
    setMessages(InitialMessages);
    dispatch(setAnswers([]));

    if (isAutomationPage) {
      return;
    }
    const formMessage = createMessage({ type: "form", noHeader: true });

    if (!router.query.hash && isVariantB) {
      initialQueuedMessages.push(formMessage);
    } else if (isVariantA) {
      initialQueuedMessages.push(formMessage);
    }
    addToQueuedMessages(initialQueuedMessages);
  };

  const validateVary = async (variation: string) => {
    if (isVariantB) {
      dispatch(setSelectedExecution(null));
      dispatch(setGeneratedExecution(null));
    }
    if (variation) {
      const userMessage = createMessage({
        type: "text",
        fromUser: true,
        timestamp: new Date(new Date().getTime() - 1000).toISOString(),
      });
      userMessage.text = variation;

      setMessages(prevMessages =>
        prevMessages
          .filter(msg => (isVariantA ? msg.type !== "form" : msg.type !== "form" && msg.type !== "spark"))
          .concat(userMessage),
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

      const varyResponse = await vary({ token: `${token}`, payload });

      if (typeof varyResponse === "string") {
        setIsValidatingAnswer(false);
        messageAnswersForm("Oops! I couldn't get your response, Please try again.");
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

  const messageAnswersForm = (message: string, type: MessageType = "text") => {
    const botMessage = createMessage({ type });
    botMessage.text = message;
    addToQueuedMessages([createMessage({ type: "form" })]);
    setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat(botMessage));
  };

  const addToQueuedMessages = (messages: IMessage[]) => {
    setTimeout(() => {
      setQueuedMessages(messages);
    }, 10);
  };

  const proceedQueuedMessages = () => {
    if (!isSimulationStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.shift()!;
      dispatch(setIsSimulationStreaming(true));
      setMessages(currentMessages => currentMessages.concat(nextQueuedMessage));
      addToQueuedMessages(queuedMessages);
    } else {
      dispatch(setIsSimulationStreaming(false));
    }
  };

  function updateMessagesForGeneratedExecution() {
    if (!generatedExecution) return;

    const filteredMessages = messages.filter(msg => msg.type !== "form");

    const sparkMessageExists = filteredMessages.some(msg => msg.type === "spark");

    if (!sparkMessageExists) {
      filteredMessages.push(createMessage({ type: "spark" }));
    }

    setMessages(filteredMessages);
  }

  function updateMessagesForSelectedExecution() {
    if (!selectedExecution) return;

    let newMessages = [...messages];

    const sparkMessageExists = newMessages.some(msg => msg.type === "spark");

    const formMessageExists = newMessages.some(msg => msg.type === "form");

    if (!sparkMessageExists) {
      newMessages.push(createMessage({ type: "spark" }));
    }

    if (!formMessageExists && (!generatedExecution || repeatedExecution)) {
      newMessages.push(createMessage({ type: "form" }));
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

  function allRequiredInputsAnswered(): boolean {
    const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);

    if (!requiredQuestionNames.length) {
      return true;
    }

    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));

    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  }

  function handleExecutionHashed() {
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

            const newParam = param.map(parameter => ({
              parameter: parameter.parameter,
              score: parameter.score,
            }));

            return {
              contextual_overrides: newParam,
              id: parseInt(promptId),
            };
          })
          .filter(item => item !== undefined) as ResOverrides[];

        dispatch(setParamsValues(newContextualOverrides));
      }
    }
  }

  useEffect(() => {
    handleExecutionHashed();
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
    proceedQueuedMessages();
  }, [isSimulationStreaming, queuedMessages]);

  useEffect(() => {
    if (allRequiredInputsAnswered()) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [answers, inputs]);

  const handleSignIn = () => {
    storeAnswers(answers);
    storeParams(paramsValues);
    router.push("/signin");
  };

  return {
    messages,
    setMessages,
    initialMessages,
    createMessage,
    addToQueuedMessages,
    messageAnswersForm,
    showGenerateButton,
    showGenerate,
    isValidatingAnswer,
    setIsValidatingAnswer,
    validateVary,
    handleSignIn,
  };
}

export default useChat;
