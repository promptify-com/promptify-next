import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import type { IAnswer } from "@/common/types/chat";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams, Prompts, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";

export default function useChatBox() {
  const prepareAndRemoveDuplicateInputs = (templatePrompts: Prompts[]) => {
    const inputs: IPromptInput[] = [];
    const params: PromptParams[] = [];

    templatePrompts.forEach(prompt => {
      // remove duplicate inputs
      const _inputs = getInputsFromString(prompt.content).filter(
        _input => !inputs.some(__input => __input.name === _input.name),
      );

      inputs.push(
        ..._inputs.map(_input => {
          _input["prompt"] = prompt.id;

          return _input;
        }),
      );

      const _params = prompt.parameters.filter(_param => !params.find(p => p.parameter.id === _param.parameter.id));
      params.push(..._params);
    });

    return {
      inputs,
      params,
    };
  };
  const preparePromptsData = (
    uploadedFiles: Map<string, string>,
    answers: IAnswer[],
    paramsValues: ResOverrides[],
    templatePrompts: Prompts[],
  ) => {
    const promptsData: ResPrompt[] = [];
    const promptParameterIds = new Map<number, number[]>();

    // we need to go through all inputs per prompt if exist, then create new entry for them
    templatePrompts.forEach(prompt => {
      if (!prompt.content) {
        return;
      }

      const prompt_params = getInputsFromString(prompt.content).reduce(
        (acc, input) => {
          // this is to make it available later on if an answer was set for it, otherwise it'll be removed.
          acc[input.name] = "";

          return acc;
        },
        {} as Record<string, string>,
      );

      if (!!prompt.parameters.length) {
        const paramIds = prompt.parameters.map(param => param.parameter.id);
        promptParameterIds.set(prompt.id, paramIds);
      }

      if (!Object.keys(prompt_params)) {
        return;
      }

      promptsData.push({
        contextual_overrides: [],
        prompt: prompt.id,
        prompt_params,
      });
    });

    // setup parameters values
    if (!!paramsValues.length) {
      promptsData.forEach(promptData => {
        const paramIds = promptParameterIds.get(promptData.prompt);

        if (!paramIds?.length) {
          return;
        }

        paramsValues.forEach(({ contextual_overrides: ctx }) => {
          ctx.forEach(({ score, parameter }) => {
            if (paramIds.includes(parameter)) {
              promptData.contextual_overrides.push({ score, parameter });
            }
          });
        });
      });
    }

    promptsData.forEach(promptData => {
      const paramsKeys = Object.keys(promptData.prompt_params);

      /**
       * We need to go through each param key already set and check if an answer was chosen for it
       * Otherwise we can remove it from the original prompt params in two cases:
       *   1. an answer for the given key was not found
       *   2. a value for the key is empty and is type of File
       */
      paramsKeys.forEach(inputName => {
        const _answer = answers.find(input => input.inputName === inputName);

        if (!_answer) {
          delete promptData.prompt_params[inputName];

          return;
        }

        const isFile = _answer.answer instanceof File;
        const value = isFile ? uploadedFiles.get(inputName) : _answer.answer;

        if (!value) {
          if (isFile) {
            delete promptData.prompt_params[inputName];
          }

          return;
        }

        promptData.prompt_params[inputName] = value;
      });
    });

    return promptsData;
  };

  return {
    prepareAndRemoveDuplicateInputs,
    preparePromptsData,
  };
}
