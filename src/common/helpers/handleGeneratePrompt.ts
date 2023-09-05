import { ResInputs, ResOverrides } from "@/core/api/dto/prompts";

export const onInputChange = (
  nodeInputs: ResInputs[],
  setNodeInputs: (obj: any) => void,
  promptId: number,
  value: string,
  name: string,
  type: string,
) => {
  const selectedInput = [...nodeInputs].find(prompt => prompt.inputs[name]);
  const inputs = [...nodeInputs];

  if (!selectedInput) {
    return setNodeInputs([
      ...nodeInputs,
      {
        id: promptId,
        inputs: {
          [name]: {
            value: type === "number" ? +value : value,
          },
        },
      },
    ]);
  }

  inputs.forEach((prompt: any, index: number) => {
    if (prompt.id === promptId) {
      inputs[index] = {
        ...prompt,
        inputs: {
          ...prompt.inputs,
          [name]: {
            value: type === "number" ? +value : value,
            required: selectedInput.inputs[name].required,
          },
        },
      };
    }
  });

  setNodeInputs([...inputs]);
};

export const onScoreChange = (
  nodeParams: ResOverrides[],
  setNodeParams: (obj: any) => void,
  promptId: number,
  score: number,
  parameter: number,
) => {
  const params = JSON.parse(JSON.stringify(nodeParams));
  const matchingParam = params.find((obj: { id: number }) => obj.id === promptId);

  if (matchingParam) {
    const matchingContext = matchingParam.contextual_overrides.find((c: any) => c.parameter === parameter);

    matchingContext ? (matchingContext.score = score) : matchingParam.contextual_overrides.push({ parameter, score });
  } else {
    params.push({ id: promptId, contextual_overrides: [{ parameter, score }] });
  }

  setNodeParams(params);
};
