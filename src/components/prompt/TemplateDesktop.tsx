import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Display } from "./Display";
import type { Templates } from "@/core/api/dto/templates";
import ClientOnly from "../base/ClientOnly";
import ChatMode from "./generate/ChatBox";
import Header from "./Header";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "@/hooks/useStore";
import { useDispatch } from "react-redux";
import { setSelectedExecution } from "@/core/store/executionsSlice";

interface TemplateDesktopProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateDesktop({ template, setErrorMessage }: TemplateDesktopProps) {
  const dispatch = useDispatch();
  const [chatFullScreen, setChatFullScreen] = useState(true);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const closeExecutionDisplay = () => {
    setChatFullScreen(true);
    dispatch(setSelectedExecution(null));
  };

  useEffect(() => {
    setChatFullScreen(!selectedExecution);
  }, [selectedExecution]);

  return (
    <Stack
      height={"calc(100svh - 90px)"}
      gap={"1px"}
    >
      <Header template={template} />
      <Grid
        mt={0}
        gap={"1px"}
        container
        flexWrap={"nowrap"}
        mx={"auto"}
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
          width={chatFullScreen ? "100%" : "38%"}
          position={"sticky"}
          top={0}
          zIndex={100}
          height={"100%"}
          overflow={"auto"}
          borderRight={"1px solid"}
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
          <ClientOnly>
            <ChatMode
              onError={setErrorMessage}
              template={template}
            />
          </ClientOnly>
        </Stack>

        {!chatFullScreen && (
          <Grid
            flex={1}
            width={"62%"}
            display={"block"}
          >
            <Display
              templateData={template}
              onError={setErrorMessage}
              close={closeExecutionDisplay}
            />
          </Grid>
        )}

        <Sidebar template={template} />
      </Grid>
    </Stack>
  );
}
