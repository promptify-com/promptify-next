import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Fade, Stack } from "@mui/material";
import { IAnswer } from "@/common/types/chat";
import { IPromptInput } from "@/common/types/prompt";
import { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import { FormInput } from "./FormInput";
import { FormParam } from "./FormParam";

interface Props {
  inputs: IPromptInput[];
  params: PromptParams[];
  answers: IAnswer[];
  paramsValues: ResOverrides[];
  onChangeInput: (value: string | File, question: IPromptInput) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
  onScrollToBottom: () => void;
}

const fadeTimeout = 800;

export const InputsForm = ({
  inputs,
  params,
  answers,
  paramsValues,
  onChangeInput,
  onChangeParam,
  setIsSimulationStreaming,
  onScrollToBottom,
}: Props) => {
  const _params = params.filter(param => param.is_visible);

  useEffect(() => {
    setTimeout(() => setIsSimulationStreaming(false), fadeTimeout);
  }, []);
  return (
    <Fade
      in={true}
      unmountOnExit
      timeout={fadeTimeout}
      addEndListener={onScrollToBottom}
    >
      <Stack gap={2}>
        {inputs.map((input, idx) => {
          const answer = answers.find(answer => answer.inputName === input.name);
          return (
            <FormInput
              key={idx}
              input={input}
              answer={answer}
              onChange={onChangeInput}
            />
          );
        })}
        {_params?.map(param => {
          const paramValue = paramsValues.find(paramVal => paramVal.id === param.prompt);
          return (
            <FormParam
              key={param.parameter.id}
              param={param}
              paramValue={paramValue}
              onChange={onChangeParam}
            />
          );
        })}
      </Stack>
    </Fade>
  );
};
