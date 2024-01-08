import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import type { IPromptInput } from "@/common/types/prompt";
import type { ResOverrides } from "@/core/api/dto/prompts";
import { IExecuteData, IExecuteInput } from "../Types";
import { IEditPrompts, IPromptParams } from "@/common/types/builder";

export default function usePromptExecute(prompt: IEditPrompts) {
  const prepareAndRemoveDuplicateInputs = () => {
    const inputsMap = new Map<string, IPromptInput>();
    let normalizeQuestions: Record<string, string> = {};

    getInputsFromString(prompt.content).forEach(_input => {
      if (inputsMap.has(_input.name)) {
        return;
      }

      _input["prompt"] = prompt.id;
      _input.question = normalizeQuestions[_input.name] ?? "";

      inputsMap.set(_input.name, _input);
    });

    const params: IPromptParams[] = [];
    prompt.parameters.forEach(_param => {
      if (!params.find(p => p.parameter_id === _param.parameter_id)) params.push(_param);
    });

    const inputs = Array.from(inputsMap, ([_, input]) => input);

    inputs.sort((a, b) => +b.required - +a.required);

    return {
      inputs,
      params,
    };
  };

  const preparePromptData = (
    uploadedFiles: Map<string, string>,
    paramsValues: ResOverrides[],
    answers: IExecuteInput,
  ) => {
    const prompt_params = getInputsFromString(prompt.content).reduce(
      (acc, input) => {
        // this is to make it available later on if an answer was set for it, otherwise it'll be removed.
        acc[input.name] = "";

        return acc;
      },
      {} as Record<string, string>,
    );

    const promptData: IExecuteData = {
      contextual_overrides: [],
      prompt_params,
    };

    // setup parameters values
    if (!!paramsValues.length) {
      paramsValues.forEach(({ contextual_overrides: ctx }) => {
        ctx.forEach(({ score, parameter }) => {
          promptData.contextual_overrides.push({ score, parameter });
        });
      });
    }

    const paramsKeys = Object.keys(promptData.prompt_params);

    /**
     * We need to go through each param key already set and check if an answer was chosen for it
     * Otherwise we can remove it from the original prompt params in two cases:
     *   1. an answer for the given key was not found
     *   2. a value for the key is empty and is type of File
     */
    paramsKeys.forEach(inputName => {
      const _answer = answers[inputName];

      if (!_answer) {
        delete promptData.prompt_params[inputName];

        return;
      }

      const isFile = _answer.value instanceof File;
      const value = isFile ? uploadedFiles.get(inputName) : _answer.value;

      if (!value) {
        if (isFile) {
          delete promptData.prompt_params[inputName];
        }

        return;
      }

      promptData.prompt_params[inputName] = value;
    });

    return promptData;
  };

  return {
    prepareAndRemoveDuplicateInputs,
    preparePromptData,
  };
}
