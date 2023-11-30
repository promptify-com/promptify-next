import Stack from "@mui/material/Stack";

import FormParam from "./FormParams";
import FormInput from "./FormInput";
import type { IAnswer } from "@/common/types/chat";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";

interface Props {
  inputs: IPromptInput[];
  params: PromptParams[];
  paramsValues: ResOverrides[];
  answers: IAnswer[];
  onChangeInput: (value: string | File, input: IPromptInput) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
}

function Inputsform({ inputs, answers, onChangeInput, onChangeParam, params, paramsValues }: Props) {
  return (
    <Stack gap={1}>
      {inputs.map((input, index) => {
        const value = answers.find(answer => answer.inputName === input.name)?.answer ?? "";
        return (
          <FormInput
            key={index}
            input={input}
            value={value}
            onChangeInput={onChangeInput}
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
  );
}

export default Inputsform;
