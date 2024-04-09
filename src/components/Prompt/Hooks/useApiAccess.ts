import type { ResPrompt } from "@/core/api/dto/prompts";
import { Templates } from "@/core/api/dto/templates";
import useChatBox from "./useChatBox";

const useApiAccess = (template: Templates) => {
  const { prepareAndRemoveDuplicateInputs } = useChatBox();
  const { inputs, params } = prepareAndRemoveDuplicateInputs(template.prompts, template.questions);

  const prepareExecutionData = () => {
    const promptsData: Record<number, ResPrompt> = {};

    inputs.forEach(_input => {
      const _promptId = _input.prompt!;
      const promptParams = { ...promptsData[_promptId]?.prompt_params, [_input.name]: "" };
      promptsData[_promptId] = {
        prompt: _promptId,
        prompt_params: promptParams,
        contextual_overrides: [],
      };
    });

    params.forEach(_param => {
      const _promptId = _param.prompt;
      const promptParams = { ...promptsData[_promptId]?.prompt_params };

      promptsData[_promptId] = {
        prompt: _promptId,
        prompt_params: promptParams,
        contextual_overrides: [
          ...promptsData[_promptId]?.contextual_overrides,
          { parameter: _param.parameter.id, score: _param.score },
        ],
      };
    });

    return JSON.stringify(Object.values(promptsData));
  };

  return { prepareExecutionData };
};

export default useApiAccess;
