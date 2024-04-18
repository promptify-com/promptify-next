import { useEffect, useMemo, useState } from "react";

import {
  createMessage,
  extractTemplateIDs,
  extractWorkflowIDs,
  fetchData,
  prepareQuestions,
  sendMessageAPI,
  suggestionsMessageText,
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
  setSelectedTemplate,
  setChats,
} from "@/core/store/chatSlice";
import useChatBox from "@/components/Prompt/Hooks/useChatBox";
import { useCreateChatMutation } from "@/core/api/chats";
import useSaveChatInteractions from "@/components/Chat/Hooks/useSaveChatInteractions";
import { setRepeatedExecution } from "@/core/store/executionsSlice";
import type { IPromptInput } from "@/common/types/prompt";
import type { IAnswer, IMessage, IQuestion } from "@/components/Prompt/Types/chat";
import type { PromptParams } from "@/core/api/dto/prompts";
import type { Templates } from "@/core/api/dto/templates";
import type { IWorkflow } from "@/components/Automation/types";
import useChatWorkflow from "@/components/Chat/Hooks/useChatWorkflow";

const useMessageManager = () => {
  const dispatch = useAppDispatch();

  const { prepareAndRemoveDuplicateInputs } = useChatBox();
  const { saveTextMessage, saveChatSuggestions } = useSaveChatInteractions();
  const [createChat] = useCreateChatMutation();

  const {
    chats,
    selectedTemplate,
    selectedWorkflow,
    isSimulationStreaming,
    selectedChat,
    inputs,
    params,
    answers,
    chatMode,
    initialChat,
    parameterSelected,
    currentExecutionDetails,
    selectedChatOption,
  } = useAppSelector(state => state.chat);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const repeatedExecution = useAppSelector(state => state.executions.repeatedExecution);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [queueSavedMessages, setQueueSavedMessages] = useState<IMessage[]>([]);

  const { processWorflowData, executeWorkflow } = useChatWorkflow({
    setMessages,
    setIsValidatingAnswer,
    queueSavedMessages,
    setQueueSavedMessages,
  });
  const inputStyle = currentUser?.preferences?.input_style ?? selectedChatOption;

  useEffect(() => {
    if (!parameterSelected) {
      return;
    }
    questionAnswerSubmitMessage(parameterSelected, true);
    dispatch(clearParameterSelection());
  }, [parameterSelected]);

  useEffect(() => {
    if (!currentExecutionDetails.id) {
      return;
    }
    const updatedMessages = messages.map(message => {
      if (message.type === "spark" && message.spark?.id === currentExecutionDetails.id) {
        const updatedSpark = {
          ...message.spark,
          is_favorite: currentExecutionDetails.isFavorite,
        };
        return { ...message, spark: updatedSpark };
      }
      return message;
    });
    setMessages(updatedMessages);
  }, [currentExecutionDetails]);

  const initialMessages = ({ questions }: { questions: IPromptInput[] }) => {
    dispatch(setChatMode("messages"));
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;
    const filteredQuestions = questions.map(_q => _q.question).filter(Boolean);

    const welcomeMessage = createMessage({
      type: "text",
      text: `${greeting} ${selectedTemplate?.title}. ${filteredQuestions.slice(0, 3).join(" ")}`,
    });
    const runMessage = createMessage({ type: "text", fromUser: true, text: `Run "${selectedTemplate?.title}"` });
    setQueueSavedMessages(newMessages => newMessages.concat(runMessage));

    if (currentUser?.preferences?.input_style === "form" || selectedChatOption === "form") {
      const formMessage = createMessage({
        type: "form",
        noHeader: true,
        text: welcomeMessage.text,
        template: selectedTemplate,
      });
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.type !== "form" && msg.type !== "credsForm").concat([runMessage, formMessage]),
      );
    } else {
      dispatch(setAnswers([])); // clear answers when user repeating execution on QA mode
      const headerWithTextMessage = createMessage({
        type: "template",
        text: welcomeMessage.text,
        template: selectedTemplate,
      });
      setQueueSavedMessages(newMessages => newMessages.concat(headerWithTextMessage));

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
      const totalQuestions = inputs.length + params.length;
      formattedQuestionMessage.text = `Question 1 of ${totalQuestions}##/${questionMessage.text}##/${
        questionMessage.type === "questionInput"
          ? `This question is ${questionMessage.isRequired ? "Required" : "Optional"}`
          : "Choose option"
      }`;
      setQueueSavedMessages(newMessages => newMessages.concat(formattedQuestionMessage));
    }
  };

  const [_inputs, _params]: [IPromptInput[], PromptParams[], boolean] = useMemo(() => {
    if (!selectedTemplate || !inputStyle) {
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

    if (!repeatedExecution) {
      dispatch(setRepeatedExecution(null));
    }

    return [inputs, params, promptHasContent];
  }, [selectedTemplate, selectedChatOption, repeatedExecution]);

  useEffect(() => {
    if (!selectedWorkflow) {
      return;
    }
    processWorflowData();
  }, [selectedWorkflow]);

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
      dispatch(setChats([newChat, ...chats]));
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
      saveTextMessage(userMessage, chatId);

      setMessages(prevMessages => prevMessages.concat(userMessage));
      setIsValidatingAnswer(true);

      const botMessage: IMessage = createMessage({ type: "html", text: "" });

      try {
        const sendMessageResponse = await sendMessageAPI(input);
        if (sendMessageResponse.message) {
          botMessage.text = sendMessageResponse.message;
        } else {
          const templateIDs = extractTemplateIDs(sendMessageResponse.output!);
          const workflowIDs = extractWorkflowIDs(sendMessageResponse.output!);
          if (!templateIDs.length && !workflowIDs.length) {
            botMessage.text = sendMessageResponse.output!;
          } else {
            if (templateIDs.length) {
              const templates = (await fetchData(templateIDs, true)) as Templates[];
              const suggestionsMessage = createMessage({
                type: "suggestion-templates",
                data: templates,
                text: suggestionsMessageText(sendMessageResponse.output)!,
              });
              saveChatSuggestions(templateIDs, suggestionsMessage.text, chatId);
              setMessages(prevMessages => prevMessages.concat(suggestionsMessage));
            }
            if (workflowIDs.length) {
              const workflows = (await fetchData(workflowIDs, false)) as IWorkflow[];
              const suggestionsMessage = createMessage({
                type: "suggestion-workflows",
                data: workflows,
                text: suggestionsMessageText(sendMessageResponse.output)!,
              });
              setMessages(prevMessages => prevMessages.concat(suggestionsMessage));
            }
          }
        }
      } catch (err) {
        botMessage.text = "Oops! I couldn't get your request, Please try again.";
      } finally {
        setIsValidatingAnswer(false);
      }
      if (botMessage.text !== "") {
        saveTextMessage(botMessage, chatId);
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

  const resetStates = () => {
    setMessages([]);
    dispatch(setAnswers([]));
    dispatch(setInputs([]));
    dispatch(setSelectedTemplate(undefined));
    setIsValidatingAnswer(false);
    dispatch(setChatMode("automation"));
  };

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
    resetStates,
    executeWorkflow,
  };
};

export default useMessageManager;
