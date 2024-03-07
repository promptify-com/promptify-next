import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyChatHistory } from "@/core/store/sidebarSlice";
import Storage from "@/common/storage";
import { useEffect } from "react";
import DrawerContainer from "./DrawerContainer";
import ChatsHistory from "./ChatsHistory";

interface Props {
  expandedOnHover: boolean;
}

export default function ChatsDrawer({ expandedOnHover }: Props) {
  const dispatch = useAppDispatch();
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);

  const toggleSidebar = () => {
    dispatch(setStickyChatHistory(!isChatHistorySticky));
    if (!isChatHistorySticky) {
      Storage.set("isChatHistorySticky", String(!isChatHistorySticky));
    } else {
      Storage.remove("isChatHistorySticky");
    }
  };

  useEffect(() => {
    const isChatHistorySticky = Storage.get("isChatHistorySticky");
    if (isChatHistorySticky) {
      dispatch(setStickyChatHistory(isChatHistorySticky));
    }
  }, []);

  return (
    <DrawerContainer
      title="Chats"
      expanded={isChatHistorySticky || expandedOnHover}
      toggleExpand={toggleSidebar}
      sticky={isChatHistorySticky}
    >
      <ChatsHistory />
    </DrawerContainer>
  );
}
