import { getInputsFromString } from "@/common/helpers/getInputsFromString";
import type { IAnswer } from "@/components/Prompt/Types/chat";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams, Prompts, ResOverrides, ResPrompt } from "@/core/api/dto/prompts";
import type { TemplateQuestions } from "@/core/api/dto/templates";

export default function useChatBox() {
  const prepareAndRemoveDuplicateInputs = (templatePrompts: Prompts[], templateQuestions: TemplateQuestions[]) => {
    const params: PromptParams[] = [];
    let promptHasContent = false;
    const inputsMap = new Map<string, IPromptInput>();
    let normalizeQuestions: Record<string, string> = {};

    if (templateQuestions?.length) {
      normalizeQuestions = templateQuestions.reduce((acc, question) => {
        const key = Object.keys(question)[0];
        acc[key] = question[key].question;

        return acc;
      }, normalizeQuestions);
    }

    templatePrompts?.forEach(prompt => {
      if (prompt.content) {
        promptHasContent = true;
      }

      // remove duplicate inputs
      getInputsFromString(prompt.content).forEach(_input => {
        if (inputsMap.has(_input.name)) {
          return;
        }

        _input["prompt"] = prompt.id;
        _input.question = normalizeQuestions[_input.name] ?? "";

        inputsMap.set(_input.name, _input);
      });

      const _params = prompt.parameters.filter(_param => !params.find(p => p.parameter.id === _param.parameter.id));
      params.push(..._params);
    });

    const inputs = Array.from(inputsMap, ([_, input]) => input);

    inputs.sort((a, b) => +b.required - +a.required);

    const valuesMap = new Map<number, ResOverrides>();
    params
      .filter(param => param.is_visible)
      .forEach(_param => {
        const paramId = _param.parameter.id;
        valuesMap.set(_param.prompt, {
          id: _param.prompt,
          contextual_overrides: (valuesMap.get(_param.prompt)?.contextual_overrides ?? []).concat({
            parameter: paramId,
            score: _param.score,
          }),
        });
      });

    return {
      inputs,
      params,
      promptHasContent,
      paramsValues: Array.from(valuesMap.values()),
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
    templatePrompts?.forEach(prompt => {
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

    promptsData.forEach(promptData => {
      const paramsKeys = Object.keys(promptData.prompt_params);

      const paramIds = promptParameterIds.get(promptData.prompt);

      answers.forEach(answer => {
        if (answer.prompt === promptData.prompt && answer.parameter && paramIds?.includes(answer.parameter.id)) {
          const score = typeof answer.answer === "number" ? answer.answer : undefined;
          if (score !== undefined) {
            promptData.contextual_overrides.push({
              score: score,
              parameter: answer.parameter.id,
            });
          }
        }
      });

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
