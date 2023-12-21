import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { ResPrompt } from "@/core/api/dto/prompts";
import { updateExecutionData } from "@/core/store/templatesSlice";

const useApiAccess = () => {
  const dispatch = useAppDispatch();
  const inputs = useAppSelector(state => state.chat.inputs);
  const answers = useAppSelector(state => state.chat.answers);

  const dispatchNewExecutionData = () => {
    const promptsData: Record<number, ResPrompt> = {};

    const _answers = [...answers];
    const _inputs = [...inputs];

    _inputs.forEach(_input => {
      const _promptId = _input.prompt!;

      if (promptsData[_promptId]) {
        promptsData[_promptId].prompt_params = { ...promptsData[_promptId].prompt_params, [_input.name]: "" };
      } else {
        promptsData[_promptId] = {
          prompt: _promptId,
          contextual_overrides: [],
          prompt_params: { [_input.name]: "" },
        };
      }
    });

    _answers.forEach(_answer => {
      promptsData[_answer.prompt].prompt_params = {
        ...promptsData[_answer.prompt].prompt_params,
        [_answer.inputName]: _answer.answer,
      };
    });

    dispatch(updateExecutionData(JSON.stringify(Object.values(promptsData))));
  };
  return { dispatchNewExecutionData };
};

export default useApiAccess;
