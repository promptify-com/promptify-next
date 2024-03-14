import { useEffect, useMemo, useState } from "react";

import {
  createMessage,
  extractTemplateIDs,
  fetchData,
  prepareQuestions,
  sendMessageAPI,
} from "@/components/Chat/helper";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  setAnswers,
  setChatMode,
  setInitialChat,
  setSelectedChat,
  setInputs,
  setParams,
  setParamsValues,
  clearParameterSelection,
} from "@/core/store/chatSlice";
import useChatBox from "@/components/Prompt/Hooks/useChatBox";
import { useCreateChatMutation } from "@/core/api/chats";
import type { IPromptInput } from "@/common/types/prompt";
import type { Templates } from "@/core/api/dto/templates";
import type { IAnswer, IMessage, IQuestion } from "@/components/Prompt/Types/chat";
import type { PromptParams } from "@/core/api/dto/prompts";
import useSaveChatInteractions from "./useSaveChatInteractions";

const useMessageManager = () => {
  const dispatch = useAppDispatch();

  const { prepareAndRemoveDuplicateInputs } = useChatBox();

  const { saveTextAndQuestionMessage, saveChatSuggestions } = useSaveChatInteractions();
  const [createChat] = useCreateChatMutation();

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
    parameterSelected,
  } = useAppSelector(state => state.chat);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const repeatedExecution = useAppSelector(state => state.executions.repeatedExecution);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [queueSavedMessages, setQueueSavedMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (!parameterSelected) {
      return;
    }
    questionAnswerSubmitMessage(parameterSelected, true);
    dispatch(clearParameterSelection());
  }, [parameterSelected]);

  const initialMessages = ({ questions }: { questions: IPromptInput[] }) => {
    dispatch(setChatMode("messages"));
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;
    const filteredQuestions = questions.map(_q => _q.question).filter(Boolean);

    const welcomeMessage = createMessage({
      type: "text",
      text: `${greeting} ${selectedTemplate?.title}. ${filteredQuestions.slice(0, 3).join(" ")}`,
    });
    const runMessage = createMessage({ type: "text", fromUser: true, text: `Run "${selectedTemplate?.title}"` });
    if (selectedChatOption === "FORM") {
      const formMessage = createMessage({ type: "form", noHeader: true, text: welcomeMessage.text });
      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "form").concat([runMessage, formMessage]));
    } else {
      dispatch(setAnswers([])); // clear answers when user repeating execution on QA mode
      const headerWithTextMessage = createMessage({ type: "headerWithText", text: welcomeMessage.text });
      const questionMessage = createMessage({
        type: "questionInput",
        text: `${filteredQuestions[0] || `What is your ${questions[0].fullName}?`}`,
        isRequired: questions[0].required,
        questionIndex: 1,
      });

      setMessages(prevMessages =>
        prevMessages
          .filter(msg => !["questionInput", "headerWithText"].includes(msg.type))
          .concat([runMessage, headerWithTextMessage, questionMessage]),
      );
      const formattedQuestionMessage = { ...questionMessage };
      formattedQuestionMessage.text = `Question 1 of ${inputs.length + params.length}##/${questionMessage.text}##/${
        questionMessage.type === "questionInput"
          ? `This question is ${questionMessage.isRequired ? "Required" : "Optional"}`
          : "Choose option"
      }`;
      setQueueSavedMessages(newMessages => newMessages.concat(formattedQuestionMessage));
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

    const questions = prepareQuestions(inputs, params);
    setQuestions(questions);

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
      return newChat;
    } catch (err) {
      console.error("Error creating a new chat: ", err);
    }
  };

  const automationSubmitMessage = async (input: string) => {
    if (!input) return;

    let chatId = selectedChat?.id;

    if (!chatId) {
      const newChat = await createNewChat();
      chatId = newChat?.id;
    }
    const userMessage = createMessage({ type: "text", fromUser: true, text: input });

    if (chatId) {
      saveTextAndQuestionMessage(userMessage, chatId);

      setMessages(prevMessages => prevMessages.concat(userMessage));
      setIsValidatingAnswer(true);

      const botMessage: IMessage = createMessage({ type: "text", text: "" });
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

              const pluralTemplates = templates.length > 1;
              const suggestionsMessage = createMessage({
                type: "suggestedTemplates",
                text: `I found ${pluralTemplates ? "these" : "this"} prompt${
                  pluralTemplates ? "s" : ""
                }, following your request:`,
                templates,
              });
              saveChatSuggestions(templateIDs, chatId);
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

  const questionAnswerSubmitMessage = async (value: string, isParam = false) => {
    if (!value) {
      return;
    }
    const currentIndex = isParam ? answers.length - 1 : answers.length;

    const currentQuestion = questions[currentIndex];

    const { required, inputName, question, prompt, type } = currentQuestion;

    const userMessage = createMessage({
      type: "text",
      text: value,
      fromUser: true,
      isEditable: type === "input",
      questionInputName: inputName,
    });
    setMessages(prevMessages => prevMessages.concat(userMessage));
    setQueueSavedMessages(newMessages => newMessages.concat(userMessage));

    if (type === "input") {
      const newAnswer: IAnswer = {
        question: question || inputName,
        required,
        inputName,
        prompt: prompt!,
        answer: value,
      };
      const _answers = answers.concat(newAnswer);

      dispatch(setAnswers(_answers));
    }
    const nextQuestion = questions[currentIndex + 1];
    if (nextQuestion) {
      const botMessage = createMessage({
        type: nextQuestion.type === "input" ? "questionInput" : "questionParam",
        text: nextQuestion.question,
        isRequired: nextQuestion.required,
        questionIndex: currentIndex + 2,
        questionInputName: nextQuestion.inputName,
      });
      setMessages(prevMessages => prevMessages.concat(botMessage));
      const formattedQuestionMessage = { ...botMessage };
      formattedQuestionMessage.text = `Question ${currentIndex + 2} of ${questions.length}##/${botMessage.text}##/${
        botMessage.type === "questionInput"
          ? `This question is ${botMessage.isRequired ? "Required" : "Optional"}`
          : "Choose option"
      }`;
      setQueueSavedMessages(newMessages => newMessages.concat(formattedQuestionMessage));

      nextQuestion.type === "param" && setIsInputDisabled(true);
    } else {
      const completionMessage = createMessage({
        type: "readyMessage",
        text: "Congrats! We are ready to run the prompt",
      });
      setMessages(prevMessages => prevMessages.concat(completionMessage));
      setQueueSavedMessages(newMessages => newMessages.concat(completionMessage));
      setIsInputDisabled(true);
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
    createMessage,
    showGenerateButton,
    initialChat,
    isInputDisabled,
    setIsInputDisabled,
    queueSavedMessages,
    setQueueSavedMessages,
  };
};

export default useMessageManager;
