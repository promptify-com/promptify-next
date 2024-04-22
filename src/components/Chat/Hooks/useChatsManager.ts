import type { IChatPartial } from "@/core/api/dto/chats";
import { setChats } from "@/core/store/chatSlice";
import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  useCreateChatMutation,
  useDeleteChatMutation,
  useDuplicateChatMutation,
  useUpdateChatMutation,
} from "@/core/api/chats";

const useChatsManager = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(state => state.chat.chats);

  const [createChatAction] = useCreateChatMutation();
  const [updateChatAction] = useUpdateChatMutation();
  const [deleteChatAction] = useDeleteChatMutation();
  const [duplicateChatAction] = useDuplicateChatMutation();

  const createChat = async ({ data, toast }: { data?: IChatPartial; toast?: boolean }) => {
    try {
      const newChat = await createChatAction({
        title: data?.title || "Welcome",
        thumbnail: data?.thumbnail || "",
      }).unwrap();
      dispatch(setChats([newChat, ...chats]));
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
      dispatch(
        setChats(
          chats.map(_chat => ({
            ...(_chat.id === updatedChat.id ? updatedChat : _chat),
          })),
        ),
      );
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

  const deleteChat = async (id: number) => {
    try {
      await deleteChatAction(id);
      dispatch(setChats(chats.filter(_chat => _chat.id !== id)));
      dispatch(setToast({ message: "Chat deleted successfully", severity: "success", duration: 6000 }));
      return true;
    } catch (err) {
      console.error("Error deleting chat: ", err);
      dispatch(setToast({ message: "Chat not deleted! Please try again.", severity: "error", duration: 6000 }));
      return false;
    }
  };

  const duplicateChat = async (id: number) => {
    try {
      const newChat = await duplicateChatAction(id).unwrap();
      dispatch(setChats([newChat, ...chats]));
      dispatch(setToast({ message: "Chat added successfully", severity: "success", duration: 6000 }));
      return newChat;
    } catch (err) {
      console.error("Error duplicating chat: ", err);
      dispatch(setToast({ message: "Chat not duplicated! Please try again.", severity: "error", duration: 6000 }));
    }
  };

  return {
    createChat,
    updateChat,
    deleteChat,
    duplicateChat,
  };
};

export default useChatsManager;
