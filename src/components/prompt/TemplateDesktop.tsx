import { type Dispatch, type SetStateAction, useEffect } from "react";
import Grid from "@mui/material/Grid";
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

interface TemplateDesktopProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateDesktop({ template, setErrorMessage }: TemplateDesktopProps) {
  const dispatch = useDispatch();
  const chatFullScreen = useAppSelector(state => state.template.isChatFullScreen);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const closeExecutionDisplay = () => {
    dispatch(setChatFullScreenStatus(true));
    dispatch(setSelectedExecution(null));
  };

  useEffect(() => {
    dispatch(setChatFullScreenStatus(!selectedExecution));
  }, [selectedExecution]);

  return (
    <Stack
      height={"calc(100svh - 90px)"}
      gap={"1px"}
    >
      <Grid
        mt={0}
        gap={"1px"}
        container
        flexWrap={"nowrap"}
        mx={"auto"}
        bgcolor={"surface.1"}
        width={"100%"}
        height={"100%"}
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
          minWidth={360}
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
            <ChatBox
              onError={setErrorMessage}
              template={template}
            />
          </ClientOnly>
        </Stack>

        {!chatFullScreen && (
          <Grid
            width={"62%"}
            display={"block"}
          >
            <Display
              templateData={template}
              close={closeExecutionDisplay}
            />
          </Grid>
        )}

        <Sidebar template={template} />
      </Grid>
    </Stack>
  );
}
