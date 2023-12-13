import { useEffect } from "react";
import { Fade, Stack } from "@mui/material";
import { IPromptInput } from "@/common/types/prompt";
import { PromptParams } from "@/core/api/dto/prompts";
import { FormInput } from "./FormInput";
import { FormParam } from "./FormParam";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";

interface Props {
  onChangeInput: (value: string | File, question: IPromptInput) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
  onScrollToBottom: () => void;
}

const fadeTimeout = 800;

export const InputsForm = ({ onChangeInput, onChangeParam, onScrollToBottom }: Props) => {
  const dispatch = useAppDispatch();
  const params = useAppSelector(state => state.chat.params);
  const inputs = useAppSelector(state => state.chat.inputs);
  const answers = useAppSelector(state => state.chat.answers);
  const paramsValues = useAppSelector(state => state.chat.paramsValues);
  const _params = params.filter(param => param.is_visible);

  useEffect(() => {
    setTimeout(() => dispatch(setIsSimulationStreaming(false)), fadeTimeout);
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
