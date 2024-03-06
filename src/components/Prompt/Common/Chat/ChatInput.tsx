import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Add from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";

import MessageSender from "./MessageSender";
import { ProgressLogo } from "@/components/common/ProgressLogo";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { setAnswers } from "@/core/store/chatSlice";
import useVariant from "../../Hooks/useVariant";

interface ChatInputProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  isValidating: boolean;
  onGenerate: () => void;
  showGenerate: boolean;
}

export const ChatInput = ({ onSubmit, disabled, isValidating, onGenerate, showGenerate }: ChatInputProps) => {
  const dispatch = useAppDispatch();
  const { isVariantA } = useVariant();

  const { generatedExecution, selectedExecution } = useAppSelector(state => state.executions);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const isExecutionShown = Boolean(selectedExecution || generatedExecution);

  const addNewPrompt = () => {
    dispatch(setSelectedExecution(null));
    dispatch(setGeneratedExecution(null));
    dispatch(setAnswers([]));
  };

  return (
    <Grid
      position={"relative"}
      display={"flex"}
      width={"100%"}
      px={{ xs: "8px", md: isExecutionShown && isVariantA ? "16px" : "0px" }}
      pb={isVariantA ? "25px" : 0}
      flexDirection={"column"}
      gap={"8px"}
    >
      {isValidating && (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
        >
          <ProgressLogo size="small" />
          <Stack
            direction={"row"}
            gap={1}
          >
            <Typography
              fontSize={12}
              fontWeight={600}
              color={"onSurface"}
            >
              Promptify
            </Typography>
            <Typography
              fontSize={12}
              fontWeight={500}
              color={"text.secondary"}
              sx={{ opacity: 0.45 }}
            >
              Thinking...
            </Typography>
          </Stack>
        </Stack>
      )}

      <Stack
        direction={"row"}
        gap={"8px"}
        alignItems={"center"}
      >
        {!isVariantA && !!generatedExecution && !isGenerating && (
          <Tooltip
            title="Add new Prompt"
            arrow
          >
            <Box
              onClick={addNewPrompt}
              sx={{
                padding: "4px",
                cursor: "pointer",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                bgcolor: "surface.5",
                color: "primary.main",
                transition: "all 0.3s ease-in-out",

                ":hover": {
                  bgcolor: "primary.main",
                  color: "white",
                  borderRadius: "99px",
                },
              }}
            >
              <Add
                sx={{
                  fontSize: 24,
                }}
              />
            </Box>
          </Tooltip>
        )}

        <Box flex={1}>
          <MessageSender
            onSubmit={onSubmit}
            disabled={disabled}
            mode={"chat"}
            onGenerate={onGenerate}
            showGenerate={showGenerate}
          />
        </Box>
      </Stack>
    </Grid>
  );
};
