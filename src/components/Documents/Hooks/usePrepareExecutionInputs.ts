import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import type { PromptParams } from "@/core/api/dto/prompts";
import { addSpaceBetweenCapitalized } from "@/common/helpers";

export const usePrepareExecutionInputs = (execution: ExecutionWithTemplate) => {
  const paramsData = execution.template?.prompts
    .filter(prompt => prompt.parameters.length > 0)
    .reduce<Record<string, PromptParams>>((acc, item) => {
      item.parameters.forEach(param => {
        acc[param.parameter.id] = param;
      });
      return acc;
    }, {});

  const inputs = Object.entries(
    Object.values(execution.parameters ?? {})
      .flatMap(obj => Object.entries(obj))
      .reduce<Record<string, string>>((acc, [key, value]) => {
        const inputName = addSpaceBetweenCapitalized(key);
        acc[inputName] = typeof value === "object" ? JSON.stringify(value) : value.toString();
        return acc;
      }, {}),
  );

  const params = Object.entries(
    Object.values(execution.contextual_overrides ?? {})
      .flatMap(parameters =>
        Array.isArray(parameters)
          ? parameters.map(({ parameter, score }) => {
              const promptData = paramsData?.[parameter];
              if (!promptData) return {};

              const paramName = addSpaceBetweenCapitalized(promptData.parameter.name ?? parameter);
              const paramScore =
                promptData.parameter.score_descriptions.find(desc => desc.score === score)?.description.split(":")[0] ??
                score;
              return { [paramName]: paramScore };
            })
          : [],
      )
      .reduce((acc, pair) => ({ ...acc, ...pair }), {}),
  );

  return {
    inputs,
    params,
  };
};
