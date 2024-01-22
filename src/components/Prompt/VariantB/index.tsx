import { type Dispatch, type SetStateAction } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import Chat from "@/components/Prompt/Common/Chat";
import Header from "@/components/Prompt/Common/Header";
import Sidebar from "@/components/Prompt/Common/Sidebar";
import TopHeaderActions from "@/components/Prompt/Common/Sidebar/TopHeaderActions";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";
import PromptPlaceholder from "@/components/placeholders/PromptPlaceholder";

interface TemplateVariantBProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
  executions: TemplatesExecutions[];
}

export default function TemplateVariantB({
  template,
  executions,
  setErrorMessage,
  questionPrefixContent,
}: TemplateVariantBProps) {
  const { isMobile, clientLoaded } = useBrowser();

  if (!clientLoaded) return <PromptPlaceholder />;

  return (
    <Stack
      mt={{ xs: 8, md: 0 }}
      height={{ xs: "calc(100svh - 65px)", md: "calc(100svh - 90px)" }}
    >
      {isMobile ? <TopHeaderActions executionsLength={executions?.length} /> : <Header template={template} />}

      <Grid
        mt={0}
        gap={"1px"}
        container
        flexWrap={"nowrap"}
        mx={"auto"}
        bgcolor={"surface.1"}
        width={"100%"}
        height={{ xs: "calc(100svh)", md: "calc(100% - 68px)" }}
        position={"relative"}
        overflow={"auto"}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
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
        <Stack
          width={"100%"}
          position={"sticky"}
          bottom={0}
          zIndex={100}
          height={"100%"}
          overflow={"auto"}
          sx={{
            borderColor: "surface.3",
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
          <Chat
            onError={setErrorMessage}
            template={template}
            questionPrefixContent={questionPrefixContent}
          />
        </Stack>
        <Sidebar
          template={template}
          executions={executions ?? []}
        />
      </Grid>
    </Stack>
  );
}
