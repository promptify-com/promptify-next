import { type Dispatch, type SetStateAction } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import ChatBox from "./ChatBox";
import { useAppSelector } from "@/hooks/useStore";
import { Display } from "./Display";
import Header from "@/components/Prompt/Common/Header";
import TopHeaderActions from "@/components/Prompt/Common/Sidebar/TopHeaderActions";
import Sidebar from "@/components/Prompt/Common/Sidebar";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";
import PromptPlaceholder from "@/components/placeholders/PromptPlaceholder";

interface TemplateLayoutProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
  executions: TemplatesExecutions[];
}

export default function TemplateVariantA({
  template,
  executions,
  setErrorMessage,
  questionPrefixContent,
}: TemplateLayoutProps) {
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);

  const { isMobile, clientLoaded } = useBrowser();

  const isExecutionShown = Boolean(selectedExecution ?? generatedExecution);

  if (!clientLoaded) return <PromptPlaceholder />;

  return (
    <Stack
      height={{ md: "calc(100svh - 90px)" }}
      bgcolor={"surface.3"}
      gap={"2px"}
    >
      {!isMobile && <Header template={template} />}

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
        {isMobile && <TopHeaderActions executionsLength={executions?.length} />}

        <Stack
          display={"flex"}
          sx={{
            height: { xs: "calc(100% - 54px)", md: "100%" },
            width: { xs: "100%", md: !isExecutionShown ? "100%" : "38%" },
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
          <ChatBox
            onError={setErrorMessage}
            template={template}
            questionPrefixContent={questionPrefixContent}
          />
        </Stack>

        {isExecutionShown && (
          <Box
            position={{ xs: "absolute", md: "inherit" }}
            width={{ md: "62%" }}
            flex={{ xs: 1, md: "auto" }}
          >
            <Display templateData={template} />
          </Box>
        )}

        <Sidebar
          template={template}
          executions={executions ?? []}
        />
      </Stack>
    </Stack>
  );
}
