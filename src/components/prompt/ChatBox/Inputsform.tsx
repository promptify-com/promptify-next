import React, { Dispatch, SetStateAction } from "react";
import { Fade, Stack } from "@mui/material";
import { IAnswer } from "@/common/types/chat";
import { IPromptInputQuestion } from "@/common/types/prompt";
import { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import { FormInput } from "./FormInput";
import { FormParam } from "./FormParam";

interface Props {
  inputs: IPromptInputQuestion[];
  params: PromptParams[];
  answers: IAnswer[];
  paramsValues: ResOverrides[];
  onChangeInput: (value: string | File, question: IPromptInputQuestion) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
  onScrollToBottom: () => void;
}

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
  return (
    <Fade
      in={true}
      unmountOnExit
      timeout={800}
      onTransitionEnd={() => setIsSimulationStreaming(false)}
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
        {params?.map(param => {
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
