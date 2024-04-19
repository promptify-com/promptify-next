import {
  useBatchingMessagesMutation,
  useSaveChatExecutionsMutation,
  useSaveChatInputMutation,
  useSaveChatSuggestionsMutation,
  useSaveChatTemplateMutation,
} from "@/core/api/chats";
import type { Templates } from "@/core/api/dto/templates";
import type {
  BatchingMessages,
  ExecutionMessage,
  IMessageResult,
  ISaveChatExecutions,
  ISaveChatInput,
  ISaveChatTemplate,
  InputMessage,
  SuggestionsMessage,
  TemplateMessage,
} from "@/core/api/dto/chats";
import type { IMessage } from "@/components/Prompt/Types/chat";
import { useAppSelector } from "@/hooks/useStore";

const useSaveChatInteractions = () => {
  const [saveChatInput] = useSaveChatInputMutation();
  const [saveSuggestions] = useSaveChatSuggestionsMutation();
  const [saveExecutions] = useSaveChatExecutionsMutation();
  const [saveTemplate] = useSaveChatTemplateMutation();
  const [saveBatchingMessages] = useBatchingMessagesMutation();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const selectedChatOption = useAppSelector(state => state.chat.selectedChatOption);

  const isInputStyleQA = currentUser?.preferences?.input_style === "qa" || selectedChatOption === "qa";

  const saveTextMessage = async (message: IMessage, chatId: number) => {
    const { type, text, fromUser } = message;
    try {
      await saveChatInput({
        chat: chatId,
        text,
        type: type === "text" ? "text" : type === "html" ? "html" : "question",
        sender: fromUser ? "user" : "system",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const saveChatSuggestions = async (templateIds: number[], text: string, chatId: number) => {
    try {
      await saveSuggestions({
        chat: chatId,
        text,
        templates: templateIds,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const _saveChatExecutions = async (executionId: number, chatId: number) => {
    try {
      await saveExecutions({
        chat: chatId,
        execution: executionId,
        type: isInputStyleQA ? "qa" : "form",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const _saveChatTemplate = async (templateId?: number, text?: string, chatId?: number) => {
    if (!templateId || !text || !chatId) {
      return;
    }
    try {
      await saveTemplate({
        chat: chatId,
        template: templateId,
        text,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const processQueuedMessages = async (
    queueSavedMessages: IMessage[],
    chatId: number,
    executionId: number,
    templateId?: number,
  ) => {
    saveBatchingMessages(
      queueSavedMessages.map(message => {
        let _message: BatchingMessages;

        switch (message.type) {
          case "text":
          case "questionInput":
          case "questionParam":
          case "readyMessage":
            _message = {
              chat: chatId,
              text: message.text,
              type: message.type === "text" ? "text" : "question",
              sender: message.fromUser ? "user" : "system",
              message_type: "message",
            } satisfies ISaveChatInput;
            break;
          case "template":
            _message = {
              chat: chatId,
              template: templateId as number,
              text: message.text,
              message_type: "template",
            } satisfies ISaveChatTemplate;
            break;
          case "spark":
            _message = {
              chat: chatId,
              execution: executionId,
              type: isInputStyleQA ? "qa" : "form",
              message_type: "execution",
            } satisfies ISaveChatExecutions;
            break;
          case "html":
            _message = {
              chat: chatId,
              text: message.text,
              type: "html",
              sender: "system",
              message_type: "message",
            } satisfies ISaveChatInput;
            break;
          default:
            throw Error(`Provided type "${message.type}" is not supported!`);
        }

        return _message;
      }),
    );
  };

  function mapApiMessageToIMessage(apiMessage: IMessageResult): IMessage {
    const inputMessage = apiMessage.message_object as InputMessage;
    const suggestionMessage = apiMessage.message_object as SuggestionsMessage;
    const templateMessage = apiMessage.message_object as TemplateMessage;
    const executionMessage = apiMessage.message_object as ExecutionMessage;
    const baseMessage: IMessage = {
      id: apiMessage.id,
      createdAt: apiMessage.created_at,
      //@ts-ignore
      fromUser: apiMessage.message_object.sender === "user",
      text: "",
      type: "text",
    };

    switch (apiMessage.message_type) {
      case "message":
        return {
          ...baseMessage,
          text: inputMessage.text,
          type:
            inputMessage.type === "text"
              ? "text"
              : inputMessage.type === "html"
              ? "html"
              : inputMessage.text.includes("ready to run")
              ? "readyMessage"
              : "questionInput",
        };
      case "suggestion":
        return {
          ...baseMessage,
          data: suggestionMessage.templates,
          text: suggestionMessage.text,
          type: "suggestion-templates",
        };

      case "template":
        return {
          ...baseMessage,
          template: templateMessage.template,
          text: templateMessage.text,
          type: "template",
        };
      case "execution":
        return {
          ...baseMessage,
          spark: executionMessage.execution,
          template: executionMessage.execution.template as unknown as Templates,
          isLatestExecution: false,
          type: "spark",
        };
      default:
        return baseMessage;
    }
  }

  return { saveTextMessage, saveChatSuggestions, processQueuedMessages, mapApiMessageToIMessage };
};

export default useSaveChatInteractions;
