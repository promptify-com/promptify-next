import React, { type Dispatch, type SetStateAction, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ChatBox from "./ChatBox";
import { Display } from "./Display";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { useDispatch } from "react-redux";
import { setActiveSidebarLink, setChatFullScreenStatus } from "@/core/store/templatesSlice";
import { setSelectedExecution } from "@/core/store/executionsSlice";
import ClientOnly from "../base/ClientOnly";
import { SidebarLink } from "@/common/types/template";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import { InfoOutlined } from "@mui/icons-material";
import { Badge, Button, Icon, Stack } from "@mui/material";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { isValidUserFn } from "@/core/store/userSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Sidebar } from "./Sidebar";
import { theme } from "@/theme";

interface TemplateMobileProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateMobile({ template, setErrorMessage }: TemplateMobileProps) {
  const dispatch = useDispatch();
  const isChatFullScreen = useAppSelector(state => state.template.isChatFullScreen);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const isValidUser = useAppSelector(isValidUserFn);
  const { data: executions } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

  useEffect(() => {
    dispatch(setChatFullScreenStatus(!selectedExecution));
  }, [selectedExecution]);

  const closeExecutionDisplay = () => {
    dispatch(setChatFullScreenStatus(true));
    dispatch(setSelectedExecution(null));
  };

  const handleOpenDrawer = (link: SidebarLink) => {
    dispatch(setActiveSidebarLink(link));
  };

  const SidebarItems: SidebarLink[] = [
    {
      name: "executions",
      icon: <NoteStackIcon color={"#375CA9"} />,
      title: "My Works",
    },
    {
      name: "details",
      icon: <InfoOutlined fontSize="small" />,
      title: "Template details",
    },
  ];

  return (
    <Grid
      mt={"58px"}
      container
      mx={"auto"}
      height={"calc(100svh - 56px)"}
      position={"relative"}
      overflow={"auto"}
      sx={{
        "&::-webkit-scrollbar": {
          width: "6px",
          p: 1,
          backgroundColor: "surface.5",
        },
        "&::-webkit-scrollbar-track": {
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "surface.1",
          outline: "1px solid surface.1",
          borderRadius: "10px",
        },
      }}
    >
      <Stack
        p={"12px 10px"}
        direction={"row"}
        alignItems={"center"}
        gap={"20px"}
        display={{ xs: "flex", md: "none" }}
      >
        {SidebarItems.map(link => (
          <React.Fragment key={link.name}>
            {executions?.length && link.name === "executions" ? (
              <Badge
                badgeContent={executions.length}
                sx={{
                  ".MuiBadge-badge.MuiBadge-standard": {
                    bgcolor: "#375CA9",
                    color: theme.palette.onPrimary,
                    fontSize: 10,
                    fontWeight: 500,
                    height: 20,
                    minWidth: 20,
                    p: "0 3px",
                  },
                }}
              >
                <Button
                  onClick={() => handleOpenDrawer(link)}
                  variant="text"
                  sx={{
                    height: 24,
                    p: "15px",
                    bgcolor: theme.palette.primaryContainer,
                    color: "#375CA9",
                    border: "99px",
                    gap: 1,
                  }}
                >
                  {link.icon}
                  {link.title}
                </Button>
              </Badge>
            ) : (
              <Button
                variant="text"
                onClick={() => handleOpenDrawer(link)}
                sx={{
                  height: 24,
                  p: "15px",
                  bgcolor: theme.palette.primaryContainer,
                  color: "#375CA9",
                  border: "99px",
                  gap: 1,
                }}
              >
                {link.icon}
                {link.title}
              </Button>
            )}
          </React.Fragment>
        ))}
      </Stack>
      <Grid
        height={"calc(100% - 54px)"}
        width={"100%"}
        display={isChatFullScreen ? "block" : "none"}
      >
        <ClientOnly>
          <ChatBox
            onError={setErrorMessage}
            key={template?.id}
            template={template}
          />
        </ClientOnly>
      </Grid>

      <Grid
        flex={1}
        borderRadius={"16px"}
        display={!isChatFullScreen ? "block" : "none"}
      >
        <Display
          templateData={template}
          close={closeExecutionDisplay}
        />
      </Grid>

      <Sidebar template={template} />
    </Grid>
  );
}
