import React, { type Dispatch, type SetStateAction, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { Display } from "./Display";
import type { Templates } from "@/core/api/dto/templates";

import ChatBox from "./ChatBox";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { Box } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import SidebarMini from "./Sidebar/Mini";
import Header from "./Header";
import ClientOnly from "@/components/base/ClientOnly";

interface TemplateLayoutProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

export default function TemplateVariantA({ template, setErrorMessage, questionPrefixContent }: TemplateLayoutProps) {
  const isChatFullScreen = true;

  const isValidUser = useAppSelector(isValidUserFn);
  const { data: executions } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

  return (
    <Stack
      height={{ md: "calc(100svh - 90px)" }}
      bgcolor={"surface.3"}
      gap={"2px"}
    >
      <Header template={template} />
      <Stack
        direction={{ md: "row" }}
        flexWrap={{ md: "nowrap" }}
        gap={{ md: "1px" }}
        sx={{
          width: "100%",
          height: { xs: "calc(100svh - 56px)", md: "calc(100% - 70.5px)" },
          mt: { xs: "58px", md: 0 },
          mx: "auto",
          bgcolor: "surface.3",
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
            <Display templateData={template} />
          </Box>
        )}

        <Sidebar template={template} />
      </Stack>
    </Stack>
  );
}
