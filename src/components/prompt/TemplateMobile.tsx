import { type Dispatch, type SetStateAction, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ChatBox from "./ChatBox";
import { Display } from "./Display";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { useDispatch } from "react-redux";
import { setChatFullScreenStatus } from "@/core/store/templatesSlice";
import { setSelectedExecution } from "@/core/store/executionsSlice";
import ClientOnly from "../base/ClientOnly";

interface TemplateMobileProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateMobile({ template, setErrorMessage }: TemplateMobileProps) {
  const dispatch = useDispatch();
  const isChatFullScreen = useAppSelector(state => state.template.isChatFullScreen);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  useEffect(() => {
    dispatch(setChatFullScreenStatus(!selectedExecution));
  }, [selectedExecution]);

  const closeExecutionDisplay = () => {
    dispatch(setChatFullScreenStatus(true));
    dispatch(setSelectedExecution(null));
  };

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
      <Grid
        height={"100%"}
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
    </Grid>
  );
}
