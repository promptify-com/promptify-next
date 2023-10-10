import { useEffect, useState, useMemo } from "react";
import { Typography, Button, CircularProgress } from "@mui/material";
import { ResInputs, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";
import { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import useToken from "@/hooks/useToken";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { PlayCircle } from "@mui/icons-material";
import Storage from "@/common/storage";

import { setGeneratingStatus, updateExecutionData } from "@/core/store/templatesSlice";
import router from "next/router";
import useGenerateExecution from "@/hooks/useGenerateExecution";

interface ButtonGenerateExecutionProps {
  templateData: Templates;
  selectedExecution: TemplatesExecutions | null;
  setGeneratedExecution: (data: PromptLiveResponse) => void;
  onError: (errMsg: string) => void;
}
interface Input extends IPromptInput {
  prompt: number;
}

export const ButtonGenerateExecution: React.FC<ButtonGenerateExecutionProps> = ({ templateData, onError }) => {
  const token = useToken();
  const dispatch = useAppDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const { generateExecution } = useGenerateExecution(templateData?.id, onError);

  const [_inputs]: [IPromptInput[]] = useMemo(() => {
    if (!templateData) {
      return [[]];
    }
    const inputs: IPromptInput[] = [];
    templateData.prompts.forEach(prompt => {
      inputs.push(...getInputsFromString(prompt.content).map(obj => ({ ...obj, prompt: prompt.id })));
    });

    return [inputs];
  }, [templateData]);

  const prompts = templateData.prompts;
  const promptHasContent = prompts.some(prompt => prompt.content);
  const nodeInputsRequired = _inputs.some(input => input.required === true);
  const hasContentAndNodeRequired = promptHasContent && !nodeInputsRequired;
  const isButtonDisabled = isGenerating ? true : !hasContentAndNodeRequired;

  const validateAndGenerateExecution = () => {
    if (!token) {
      return router.push("/signin");
    }

    if (hasContentAndNodeRequired) {
      dispatch(setGeneratingStatus(true));
      generateExecution([]);
    }
  };

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
