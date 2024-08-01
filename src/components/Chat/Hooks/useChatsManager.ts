import type { IChat, IChatPartial } from "@/core/api/dto/chats";
import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useCreateChatMutation, useDeleteChatMutation, useUpdateChatMutation } from "@/core/api/chats";
import { initialState as initialChatState, setChats } from "@/core/store/chatSlice";

const useChatsManager = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(state => state.chat?.chats ?? initialChatState.chats);

  const [createChatAction] = useCreateChatMutation();
  const [updateChatAction] = useUpdateChatMutation();
  const [deleteChatAction] = useDeleteChatMutation();

  const createChat = async ({ data, toast }: { data?: IChatPartial; toast?: boolean }) => {
    try {
      const newChat = await createChatAction({
        title: data?.title || "Welcome",
        thumbnail: data?.thumbnail || "",
      }).unwrap();

      updateChatsList(newChat, "ADD");

      if (toast) {
        dispatch(setToast({ message: "Chat added successfully", severity: "success", duration: 6000 }));
      }
      return newChat;
    } catch (err) {
      console.error("Error creating a new chat: ", err);
      if (toast) {
        dispatch(setToast({ message: "Chat not created! Please try again.", severity: "error", duration: 6000 }));
      }
    }
  };

  const updateChat = async (id: number, data: IChatPartial, toast?: boolean) => {
    try {
      const updatedChat = await updateChatAction({
        id,
        data: { title: data.title, thumbnail: data.thumbnail },
      }).unwrap();

      updateChatsList(updatedChat, "UPDATE");

      if (toast) {
        dispatch(setToast({ message: "Chat updated successfully", severity: "success", duration: 6000 }));
      }
    } catch (err) {
      console.error("Error updating chat: ", err);
      if (toast) {
        dispatch(setToast({ message: "Chat not updated! Please try again.", severity: "error", duration: 6000 }));
      }
    }
  };

  const deleteChat = async (chat: IChat) => {
    try {
      await deleteChatAction(chat.id);

      updateChatsList(chat, "DELETE");

      dispatch(setToast({ message: "Chat deleted successfully", severity: "success", duration: 6000 }));
      return true;
    } catch (err) {
      console.error("Error deleting chat: ", err);
      dispatch(setToast({ message: "Chat not deleted! Please try again.", severity: "error", duration: 6000 }));
      return false;
    }
  };

  const updateChatsList = (chat: IChat, op: "ADD" | "UPDATE" | "DELETE") => {
    dispatch(
      setChats(
        op === "ADD"
          ? [chat, ...chats]
          : op === "DELETE"
            ? chats.filter(_chat => _chat.id !== chat.id)
            : op === "UPDATE"
              ? chats.map(_chat => ({ ...(_chat.id === chat.id ? chat : _chat) }))
              : chats,
      ),
    );
  };

  return {
    createChat,
    updateChat,
    deleteChat,
  };
};

export default useChatsManager;
