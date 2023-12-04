import React, { type Dispatch, type SetStateAction, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { Display } from "./Display";
import type { Templates } from "@/core/api/dto/templates";
import ClientOnly from "../base/ClientOnly";
import ChatBox from "./ChatBox";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "@/hooks/useStore";
import { useDispatch } from "react-redux";
import { setSelectedExecution } from "@/core/store/executionsSlice";
import { setChatFullScreenStatus } from "@/core/store/templatesSlice";
import { isValidUserFn } from "@/core/store/userSlice";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { Box } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import SidebarMini from "./Sidebar/Mini";

interface TemplateLayoutProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

export default function TemplateLayout({ template, setErrorMessage, questionPrefixContent }: TemplateLayoutProps) {
  const dispatch = useDispatch();
  const isChatFullScreen = useAppSelector(state => state.template.isChatFullScreen);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const isValidUser = useAppSelector(isValidUserFn);
  const { data: executions } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

  const closeExecutionDisplay = () => {
    dispatch(setChatFullScreenStatus(true));
    dispatch(setSelectedExecution(null));
  };

  useEffect(() => {
    dispatch(setChatFullScreenStatus(!selectedExecution));
  }, [selectedExecution]);

  return (
    <Stack
      height={{ md: "calc(100svh - 90px)" }}
      gap={"1px"}
    >
      <Stack
        direction={{ md: "row" }}
        flexWrap={{ md: "nowrap" }}
        gap={{ md: "1px" }}
        sx={{
          width: { md: "100%" },
          height: { xs: "calc(100svh - 56px)", md: "100%" },
          mt: { xs: "58px", md: 0 },
          mx: "auto",
          bgcolor: { md: "surface.1" },
          position: "relative",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: { xs: "3px", md: "6px" },
            p: 1,
            bgcolor: "surface.1",
          },
          "&::-webkit-scrollbar-track": {
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "surface.1",
            outline: "1px solid surface.1",
            borderRadius: "10px",
          },
        }}
      >
        <Box display={{ xs: "block", md: "none" }}>
          <SidebarMini count={executions?.length || 0} />
        </Box>

        <Stack
          display={{ xs: isChatFullScreen ? "flex" : "none", md: "flex" }}
          sx={{
            height: { xs: "calc(100% - 54px)", md: "100%" },
            width: { xs: "100%", md: isChatFullScreen ? "100%" : "38%" },
            minWidth: { md: 360 },
            position: { md: "sticky" },
            top: { md: 0 },
            zIndex: { md: 100 },
            overflow: { md: "auto" },
            borderRight: { md: "1px solid" },
            borderColor: { md: "surface.3" },
            "&::-webkit-scrollbar": {
              width: { xs: "3px", md: "6px" },
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
          <ClientOnly>
            <ChatBox
              onError={setErrorMessage}
              template={template}
              questionPrefixContent={questionPrefixContent}
            />
          </ClientOnly>
        </Stack>

        {!isChatFullScreen && (
          <Box
            width={{ md: "62%" }}
            flex={{ xs: 1, md: "auto" }}
          >
            <Display
              templateData={template}
              close={closeExecutionDisplay}
            />
          </Box>
        )}

        <Sidebar template={template} />
      </Stack>
    </Stack>
  );
}
