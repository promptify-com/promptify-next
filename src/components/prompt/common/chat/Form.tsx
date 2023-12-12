import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import FormParam from "@/components/Prompt/Common/Chat/FormParams";
import FormInput from "@/components/Prompt/Common/Chat/FormInput";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams } from "@/core/api/dto/prompts";

interface Props {
  onChangeInput: (value: string | File, input: IPromptInput) => void;
  onChangeParam: (value: number, param: PromptParams) => void;
}

function Inputsform({ onChangeInput, onChangeParam }: Props) {
  const answers = useAppSelector(state => state.chat.answers);
  const inputs = useAppSelector(state => state.chat.inputs);
  const paramsValues = useAppSelector(state => state.chat.paramsValues);

  const params = useAppSelector(state => state.chat.params);
  const _params = params.filter(param => param.is_visible);

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
  );
}

export default Inputsform;
