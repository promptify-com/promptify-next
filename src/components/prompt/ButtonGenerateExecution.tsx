import { useEffect, useMemo } from "react";
import { Typography, Button, CircularProgress } from "@mui/material";
import { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";

import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import { Templates } from "@/core/api/dto/templates";
import { PlayCircle } from "@mui/icons-material";

import { setGeneratingStatus } from "@/core/store/templatesSlice";
import router from "next/router";
import useGenerateExecution from "@/hooks/useGenerateExecution";

interface ButtonGenerateExecutionProps {
  templateData: Templates;
  setGeneratedExecution: (data: PromptLiveResponse) => void;
  onError: (errMsg: string) => void;
}

export const ButtonGenerateExecution: React.FC<ButtonGenerateExecutionProps> = ({
  templateData,
  setGeneratedExecution,
  onError,
}) => {
  const token = useToken();
  const dispatch = useAppDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const { generateExecution, generatingResponse } = useGenerateExecution(templateData?.id, onError);

  const _inputs: IPromptInput[] = useMemo(() => {
    if (!templateData) {
      return [];
    }
    const inputs: IPromptInput[] = [];
    templateData.prompts.forEach(prompt => {
      inputs.push(...getInputsFromString(prompt.content).map(obj => ({ ...obj, prompt: prompt.id })));
    });

    return inputs;
  }, [templateData]);

  const prompts = templateData.prompts;
  const promptHasContent = prompts.some(prompt => prompt.content);
  const nodeInputsRequired = _inputs.some(input => input.required === true);
  const hasContentAndNodeNotRequired = promptHasContent && !nodeInputsRequired;
  const isButtonDisabled = isGenerating ? true : !hasContentAndNodeNotRequired;

  const validateAndGenerateExecution = () => {
    if (!token) {
      return router.push("/signin");
    }

    dispatch(setGeneratingStatus(true));
    generateExecution([]);
  };

  useEffect(() => {
    if (generatingResponse) setGeneratedExecution(generatingResponse);
  }, [generatingResponse]);

  return (
    <Button
      onClick={validateAndGenerateExecution}
      startIcon={
        isGenerating ? (
          <CircularProgress size={16} />
        ) : (
          <PlayCircle
            sx={{ color: "onPrimary" }}
            fontSize={"small"}
          />
        )
      }
      sx={{
        bgcolor: "primary.main",
        borderColor: "primary.main",
        borderRadius: "999px",
        height: "2px",
        p: "15px",
        ml: "0px",
        color: "15px",
        fontWeight: 500,
        ":hover": {
          opacity: 0.9,
          bgcolor: "primary.main",
          color: "onPrimary",
        },
      }}
      variant="contained"
      disabled={isButtonDisabled}
    >
      {isGenerating ? (
        <Typography> Generation in progress...</Typography>
      ) : (
        <>
          <Typography sx={{ color: "inherit", fontSize: 15, lineHeight: "22px" }}>Generate</Typography>
          <Typography sx={{ ml: 1.5, color: "inherit", fontSize: 12 }}>~360s</Typography>
        </>
      )}
    </Button>
  );
};
