import { type Dispatch, type SetStateAction } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import type { Templates } from "@/core/api/dto/templates";
import ClientOnly from "../base/ClientOnly";
import ChatMode from "./generate/ChatBox";
import Header from "./Header";
import TemplateToolbar from "./Toolbar";
import ToolbarDrawer from "./Toolbar/ToolbarDrawer";

interface TemplateDesktopProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateDesktop({ template, setErrorMessage }: TemplateDesktopProps) {
  return (
    <Stack
      height={"calc(100svh - 90px)"}
      position={"relative"}
    >
      <Header template={template} />
      <Grid
        display={"flex"}
        flexWrap={"nowrap"}
        bgcolor={"surface.1"}
        width={"100%"}
        height={"calc(100% - 68px)"}
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
          zIndex={100}
          height={"100%"}
        >
          <ClientOnly>
            <ChatMode
              onError={setErrorMessage}
              template={template}
            />
          </ClientOnly>
        </Stack>

        <TemplateToolbar template={template} />
        <ToolbarDrawer template={template} />
      </Grid>
    </Stack>
  );
}
