import { useSaveChatInputMutation, useSaveChatSuggestionsMutation } from "@/core/api/chats";
import type { IMessage } from "@/components/Prompt/Types/chat";

const useSaveChatInteractions = () => {
  const [saveChatInput] = useSaveChatInputMutation();
  const [saveSuggestions] = useSaveChatSuggestionsMutation();

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

  return { saveTextAndQuestionMessage, saveChatSuggestions };
};

export default useSaveChatInteractions;
