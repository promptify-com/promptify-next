import { useEffect, useMemo, useState } from "react";

import { randomId } from "@/common/helpers";
import { extractTemplateIDs, fetchData, sendMessageAPI } from "@/components/Chat/helper";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useChatBox from "@/hooks/useChatBox";
import { setAnswers, setInputs, setIsSimulationStreaming, setParams, setParamsValues } from "@/core/store/chatSlice";
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

  const { selectedTemplate, isSimulationStreaming, selectedChatOption, inputs, answers } = useAppSelector(
    state => state.chat,
  );
  const currentUser = useAppSelector(state => state.user.currentUser);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [suggestedTemplates, setSuggestedTemplates] = useState<Templates[]>([]);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [chatMode, setChatMode] = useState<"automation" | "messages">("automation");
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

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

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }
    const runMessage = createMessage({ type: "text", fromUser: true });
    runMessage.text = `Run "${selectedTemplate.title}"`;
    setMessages(prevMessages => prevMessages.filter(message => message.type !== "form").concat(runMessage));
  }, [selectedTemplate]);

  const initialMessages = ({ questions }: { questions: IPromptInput[] }) => {
    setChatMode("messages");
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;
    const filteredQuestions = questions.map(_q => _q.question).filter(Boolean);

    const welcomeMessage = createMessage({ type: "text" });
    welcomeMessage.text = `${greeting} ${selectedTemplate?.title}. ${filteredQuestions.slice(0, 3).join(" ?")}`;

    dispatch(setAnswers([]));

    if (selectedChatOption === "FORM") {
      const formMessage = createMessage({ type: "form", noHeader: true });
      formMessage.text = welcomeMessage.text;
      setMessages(prevMessages => prevMessages.concat(formMessage));
    } else {
      const headerWithTextMessage = createMessage({ type: "HeaderWithText" });
      headerWithTextMessage.text = welcomeMessage.text;
      const questionMessage = createMessage({
        type: "question",
        isRequired: questions[0].required,
        questionIndex: 1,
      });
      questionMessage.text = `${filteredQuestions[0] || questions[0].fullName}`;
      setMessages(prevMessages => prevMessages.concat(headerWithTextMessage));
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
  }, [selectedChatOption]);

  const allRequiredInputsAnswered = (): boolean => {
    const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);

    if (!requiredQuestionNames.length) {
      return true;
    }

    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));

    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  };

  const automationSubmitMessage = async (input: string) => {
    if (!input) {
      return;
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
  };

  const questionAnswerSubmitMessage = async (value: string) => {
    const { required, name: inputName, question, prompt } = inputs[answers.length];

    if (!value) {
      return;
    }
    const userMessage = createMessage({
      type: "text",
      fromUser: true,
      isEditable: true,
      questionInputName: inputs[answers.length].name,
    });
    userMessage.text = value;

    setMessages(prevMessages => prevMessages.concat(userMessage));

    const _answers = answers.filter(answer => answer.inputName !== inputs[answers.length].name);

    const newAnswer: IAnswer = {
      question: question!,
      required,
      inputName,
      prompt: prompt!,
      answer: value,
    };
    _answers.push(newAnswer);
    dispatch(setAnswers(_answers));

    const questions = inputs.map(_q => _q.question).filter(Boolean);

    const nextQuestionIndex = _answers.length;
    const nextQuestion = questions[nextQuestionIndex];
    let botMessage: IMessage;
    if (nextQuestion) {
      botMessage = createMessage({
        type: "question",
        isRequired: inputs[nextQuestionIndex].required,
        questionIndex: Math.min(_answers.length + 1, inputs.length),
      });
      botMessage.text = nextQuestion;
      setMessages(prevMessages => prevMessages.concat(botMessage));
    } else {
      botMessage = createMessage({ type: "text" });
      botMessage.text = "Congrats! We are ready to run the prompt";
      setMessages(prevMessages => prevMessages.concat(botMessage));
      setAllQuestionsAnswered(true);
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
    suggestedTemplates,
    createMessage,
    showGenerateButton,
    setChatMode,
    allQuestionsAnswered,
    setAllQuestionsAnswered,
  };
};

export default useMessageManager;
