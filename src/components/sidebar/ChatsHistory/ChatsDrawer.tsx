import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyChatHistory } from "@/core/store/sidebarSlice";
import LocalStorage from "@/common/Storage/LocalStorage";
import { useEffect } from "react";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import ChatsHistory from "./ChatsHistory";
import useBrowser from "@/hooks/useBrowser";
import type { SxProps } from "@mui/material/styles";

interface Props {
  expandedOnHover: boolean;
  style?: SxProps;
}

export default function ChatsDrawer({ expandedOnHover, style = {} }: Props) {
  const dispatch = useAppDispatch();
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);
  const { isMobile } = useBrowser();

  const toggleSidebar = () => {
    if (isMobile) {
      return;
    }

    dispatch(setStickyChatHistory(!isChatHistorySticky));
  };

  useEffect(() => {
    const isChatHistorySticky = Boolean(LocalStorage.get("isChatHistorySticky"));
    if (isChatHistorySticky === null) {
      dispatch(setStickyChatHistory(true));
    } else {
      dispatch(setStickyChatHistory(isChatHistorySticky));
    }
  }, []);

  return (
    <DrawerContainer
      title="Chats"
      expanded={isMobile ? expandedOnHover : isChatHistorySticky || expandedOnHover}
      toggleExpand={toggleSidebar}
      sticky={isMobile ? false : isChatHistorySticky}
      style={style}
    >
      <ChatsHistory />
    </DrawerContainer>
  );
}
