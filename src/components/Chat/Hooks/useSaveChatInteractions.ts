import {
  useSaveChatExecutionsMutation,
  useSaveChatInputMutation,
  useSaveChatSuggestionsMutation,
  useSaveChatTemplateMutation,
} from "@/core/api/chats";
import type { IMessage } from "@/components/Prompt/Types/chat";

const useSaveChatInteractions = () => {
  const [saveChatInput] = useSaveChatInputMutation();
  const [saveSuggestions] = useSaveChatSuggestionsMutation();
  const [saveExecutions] = useSaveChatExecutionsMutation();
  const [saveTemplate] = useSaveChatTemplateMutation();

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
      });
    } catch (error) {
      console.error(error);
    }
  };

  const saveChatTemplate = async (templateId: number, text: string, chatId: number) => {
    try {
      await saveTemplate({
        chat: chatId,
        template_id: templateId,
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

          case "headerWithText":
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

  return { saveTextAndQuestionMessage, saveChatSuggestions, processQueuedMessages };
};

export default useSaveChatInteractions;
