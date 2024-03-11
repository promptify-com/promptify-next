import { useEffect, useMemo, useState } from "react";

import { randomId } from "@/common/helpers";
import { extractTemplateIDs, fetchData, sendMessageAPI } from "@/components/Chat/helper";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  setAnswers,
  setChatMode,
  setInitialChat,
  setSelectedChat,
  setInputs,
  setIsSimulationStreaming,
  setParams,
  setParamsValues,
} from "@/core/store/chatSlice";
import useChatBox from "@/components/Prompt/Hooks/useChatBox";
import { useCreateChatMutation } from "@/core/api/chats";
import type { IPromptInput } from "@/common/types/prompt";
import type { Templates } from "@/core/api/dto/templates";
import type { IAnswer, IMessage, MessageType } from "@/components/Prompt/Types/chat";
import type { PromptParams } from "@/core/api/dto/prompts";

interface CreateMessageProps {
  type: MessageType;
  fromUser?: boolean;
  noHeader?: boolean;
  timestamp?: string;
  isEditable?: boolean;
  isRequired?: boolean;
  questionIndex?: number;
  questionInputName?: string;
}

const useMessageManager = () => {
  const dispatch = useAppDispatch();

  const { prepareAndRemoveDuplicateInputs } = useChatBox();

  const {
    selectedTemplate,
    isSimulationStreaming,
    selectedChatOption,
    selectedChat,
    inputs,
    params,
    answers,
    chatMode,
    initialChat,
  } = useAppSelector(state => state.chat);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const repeatedExecution = useAppSelector(state => state.executions.repeatedExecution);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [suggestedTemplates, setSuggestedTemplates] = useState<Templates[]>([]);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [currentParamIndex, setCurrentParamIndex] = useState(0);

  const [createChat] = useCreateChatMutation();

  const createMessage = ({
    type,
    timestamp = new Date().toISOString(),
    fromUser = false,
    noHeader = false,
    isEditable = false,
    isRequired = false,
    questionIndex,
    questionInputName,
  }: CreateMessageProps) => ({
    id: randomId(),
    text: "",
    type,
    createdAt: timestamp,
    fromUser,
    noHeader,
    isEditable,
    isRequired,
    questionIndex,
    questionInputName,
  });

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
    }
  };

  useEffect(() => {
    proceedQueuedMessages();
  }, [isSimulationStreaming, queuedMessages]);

  const initialMessages = ({ questions }: { questions: IPromptInput[] }) => {
    dispatch(setChatMode("messages"));
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;
    const filteredQuestions = questions.map(_q => _q.question).filter(Boolean);

    const welcomeMessage = createMessage({ type: "text" });
    welcomeMessage.text = `${greeting} ${selectedTemplate?.title}. ${filteredQuestions.slice(0, 3).join(" ")}`;

    const runMessage = createMessage({ type: "text", fromUser: true });
    runMessage.text = `Run "${selectedTemplate?.title}"`;

    if (selectedChatOption === "FORM") {
      const formMessage = createMessage({ type: "form", noHeader: true });
      formMessage.text = welcomeMessage.text;
      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat([runMessage, formMessage]));
    } else {
      dispatch(setAnswers([])); // clear answers when user repeating execution on QA mode
      const headerWithTextMessage = createMessage({ type: "HeaderWithText" });
      headerWithTextMessage.text = welcomeMessage.text;
      const questionMessage = createMessage({
        type: "question",
        isRequired: questions[0].required,
        questionIndex: 1,
      });
      questionMessage.text = `${filteredQuestions[0] || questions[0].fullName}`;
      setMessages(prevMessages => prevMessages.concat([runMessage, headerWithTextMessage]));
      addToQueuedMessages([questionMessage]);
    }
  };

  const [_inputs, _params]: [IPromptInput[], PromptParams[], boolean] = useMemo(() => {
    if (!selectedTemplate || !selectedChatOption) {
      return [[], [], false];
    }

    const { inputs, params, promptHasContent, paramsValues } = prepareAndRemoveDuplicateInputs(
      selectedTemplate.prompts,
      selectedTemplate.questions,
    );

    dispatch(setParamsValues(paramsValues));

    initialMessages({ questions: inputs });

    dispatch(setParams(params));
    dispatch(setInputs(inputs));

    return [inputs, params, promptHasContent];
  }, [selectedTemplate, selectedChatOption, repeatedExecution]);

  const allRequiredInputsAnswered = (): boolean => {
    const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);

    if (!requiredQuestionNames.length) {
      return true;
    }

    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));

    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  };

  const createNewChat = async () => {
    try {
      const newChat = await createChat({
        title: "Welcome",
      }).unwrap();
      dispatch(setSelectedChat(newChat));
      // TODO: this timeout should be removed. just a workaround to handle selectedChat watcher inside <Chats />
      setTimeout(() => dispatch(setInitialChat(false)), 1000);
    } catch (err) {
      console.error("Error creating a new chat: ", err);
    }
  };

  const automationSubmitMessage = async (input: string) => {
    if (!input) return;

    if (!selectedChat) {
      createNewChat();
    }

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
            const pluralTemplates = templates.length > 1;

            suggestionsMessage.text = `I found ${pluralTemplates ? "these" : "this"} prompt${
              pluralTemplates ? "s" : ""
            }, following your request:`;

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
  };

  const questionAnswerSubmitMessage = async (value: string) => {
    const currentIndex = answers.length;
    const currentInput = inputs[currentIndex];
    const { required, name: inputName, question, prompt } = currentInput;

    if (!value) {
      return;
    }

    const userMessage = createMessage({
      type: "text",
      fromUser: true,
      isEditable: true,
      questionInputName: inputName,
    });
    userMessage.text = value;

    setMessages(prevMessages => prevMessages.concat(userMessage));

    const nextInput = inputs[currentIndex + 1];
    if (nextInput) {
      const newAnswer: IAnswer = {
        question: question || inputName,
        required,
        inputName,
        prompt: prompt!,
        answer: value,
      };
      const updatedAnswers = [...answers, newAnswer];
      dispatch(setAnswers(updatedAnswers));
      const nextQuestionText = nextInput.question || ` what is your ${nextInput.fullName}?`;
      const botMessage = createMessage({
        type: "question",
        isRequired: nextInput.required,
        questionIndex: currentIndex + 2,
      });
      botMessage.text = nextQuestionText;
      setMessages(prevMessages => prevMessages.concat(botMessage));
    } else {
      handleNextContextualParam();
    }
  };

  const handleNextContextualParam = () => {
    if (currentParamIndex < params.length) {
      const param = params[currentParamIndex];
      const contextualParamMessage = createMessage({
        type: "contextualParam",
        questionIndex: answers.length + 1,
        questionInputName: param.parameter.name,
      });
      contextualParamMessage.text = `what is your ${param.parameter.name} ?`;
      setMessages(prevMessages => prevMessages.concat(contextualParamMessage));

      setCurrentParamIndex(currentIndex => currentIndex + 1);
      setIsInputDisabled(true);
    } else {
      const completionMessage = createMessage({ type: "readyMessage" });
      completionMessage.text = "Congrats! We are ready to run the prompt";
      setMessages(prevMessages => prevMessages.concat(completionMessage));
      setIsInputDisabled(false);
    }
  };

  const handleSubmitInput = (input: string) => {
    if (chatMode === "automation") {
      automationSubmitMessage(input);
    } else {
      questionAnswerSubmitMessage(input);
    }
  };

  const showGenerateButton =
    chatMode === "messages" &&
    !isSimulationStreaming &&
    (allRequiredInputsAnswered() || Boolean(!inputs.length || !inputs[0]?.required));

  return {
    messages,
    setMessages,
    handleSubmitInput,
    isValidatingAnswer,
    setIsValidatingAnswer,
    suggestedTemplates,
    createMessage,
    showGenerateButton,
    initialChat,
    isInputDisabled,
    setIsInputDisabled,
  };
};

export default useMessageManager;
