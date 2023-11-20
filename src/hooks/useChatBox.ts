import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import type { IAnswer } from "@/common/types/chat";
import type { IPromptInput } from "@/common/types/prompt";
import type { Prompts, ResPrompt } from "@/core/api/dto/prompts";

export default function useChatBox() {
  const prepareAndRemoveDuplicateInputs = (templatePrompts: Prompts[]) => {
    const inputs: IPromptInput[] = [];
    let promptHasContent = false;

    templatePrompts.forEach(prompt => {
      if (prompt.content) {
        promptHasContent = true;
      }

      // remove duplicate inputs
      const _inputs = getInputsFromString(prompt.content).filter(
        _input => !inputs.some(__input => __input.name === _input.name),
      );

      if (!_inputs.length) {
        return;
      }

      inputs.push(
        ..._inputs.map(_input => {
          _input["prompt"] = prompt.id;

          return _input;
        }),
      );
    });

    return {
      inputs,
      promptHasContent,
    };
  };
  const preparePromptsData = (uploadedFiles: Map<string, string>, answers: IAnswer[], templatePrompts: Prompts[]) => {
    const promptsData: ResPrompt[] = [];

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

      if (!Object.keys(prompt_params)) {
        return;
      }

      promptsData.push({
        contextual_overrides: [],
        prompt: prompt.id,
        prompt_params,
      });
    });

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
