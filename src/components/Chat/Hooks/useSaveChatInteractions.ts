import {
  useSaveChatExecutionsMutation,
  useSaveChatInputMutation,
  useSaveChatSuggestionsMutation,
  useSaveChatTemplateMutation,
} from "@/core/api/chats";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import type { IMessageResult, InputMessage, SuggestionsMessage, TemplateMessage } from "@/core/api/dto/chats";
import type { IMessage } from "@/components/Prompt/Types/chat";
import { useAppSelector } from "@/hooks/useStore";

const useSaveChatInteractions = () => {
  const [saveChatInput] = useSaveChatInputMutation();
  const [saveSuggestions] = useSaveChatSuggestionsMutation();
  const [saveExecutions] = useSaveChatExecutionsMutation();
  const [saveTemplate] = useSaveChatTemplateMutation();
  const chatOption = useAppSelector(state => state.chat.selectedChatOption);

  const saveTextAndQuestionMessage = async (message: IMessage, chatId: number) => {
    const { type, text, fromUser } = message;
    try {
      await saveChatInput({
        chat: chatId,
        text,
        type: type === "text" ? "text" : "question",
        sender: fromUser ? "user" : "system",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const saveChatSuggestions = async (templateIds: number[], chatId: number) => {
    try {
      await saveSuggestions({
        chat: chatId,
        templates: templateIds,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const saveChatExecutions = async (executionId: number, chatId: number) => {
    try {
      await saveExecutions({
        chat: chatId,
        execution: executionId,
        type: chatOption === "QA" ? "qa" : "form",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const saveChatTemplate = async (templateId?: number, text?: string, chatId?: number) => {
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
    templateId: number,
  ) => {
    for (const message of queueSavedMessages) {
      try {
        switch (message.type) {
          case "questionInput":
            await saveTextAndQuestionMessage(message, chatId);
            break;

          case "questionParam":
            await saveTextAndQuestionMessage(message, chatId);
            break;

          case "spark":
            await saveChatExecutions(executionId, chatId);
            break;

          case "template":
            await saveChatTemplate(templateId, message.text, chatId);
            break;

          default: // case "text"
            await saveTextAndQuestionMessage(message, chatId);
        }
      } catch (error) {
        console.error(`Error processing message ${message.text}:`, error);
      }
    }
  };

  function mapApiMessageToIMessage(apiMessage: IMessageResult): IMessage {
    const inputMessage = apiMessage.message_object as InputMessage;
    const suggestionMessage = apiMessage.message_object as SuggestionsMessage;
    const templateMessage = apiMessage.message_object as TemplateMessage;
    const executionMessage = apiMessage.message_object as TemplatesExecutions;
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
              : inputMessage.text.includes("ready to run")
              ? "readyMessage"
              : "questionInput",
        };
      case "suggestion":
        return {
          ...baseMessage,
          templates: suggestionMessage.templates,
          type: "suggestion",
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
          spark: executionMessage,
          template: executionMessage.template as unknown as Templates,
          isLatestExecution: false,
          type: "spark",
        };
      default:
        return baseMessage;
    }
  }

  return { saveTextAndQuestionMessage, saveChatSuggestions, processQueuedMessages, mapApiMessageToIMessage };
};

export default useSaveChatInteractions;
