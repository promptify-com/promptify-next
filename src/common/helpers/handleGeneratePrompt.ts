import { SelectedNodeType } from "@/components/prompt/generate/ChatMode";
import { Input, Param, ResInputs, ResOverrides } from "@/core/api/dto/prompts";

export const onInputChange = (
  nodeInputs: ResInputs[],
  setNodeInputs: (obj: any) => void,
  promptId: number,
  value: string,
  name: string,
  type: string,
) => {
  const selectedInput = nodeInputs.find(prompt => prompt.inputs[name]);

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

  nodeInputs.forEach(prompt => {
    if (prompt.id === promptId) {
      prompt.inputs[name] = {
        value: type === "number" ? +value : value,
        required: selectedInput.inputs[name].required,
      };
    }
  });

  setNodeInputs([...nodeInputs]);
};

export const onScoreChange = (
  nodeParams: ResOverrides[],
  setNodeParams: (obj: any) => void,
  promptId: number,
  score: number,
  parameter: number,
) => {
  const params = [...nodeParams];
  const matchingParam = params.find((obj: { id: number }) => obj.id === promptId);

  if (matchingParam) {
    const matchingContext = matchingParam.contextual_overrides.find(contexual => contexual.parameter === parameter);

    matchingContext ? (matchingContext.score = score) : matchingParam.contextual_overrides.push({ parameter, score });
  } else {
    params.push({ id: promptId, contextual_overrides: [{ parameter, score }] });
  }

  setNodeParams(params);
};
export const getInputValue = (
  nodeInputs: ResInputs[],

  item: Input | Param,
) => {
  if (isParam(item)) return "";
  return nodeInputs.find(prompt => prompt.id === item.prompt)?.inputs[item.name]?.value ?? "";
};

export const isParam = (node: Input | Param): node is Param => "param" in node;
export const isParamSelected = (node: SelectedNodeType): node is { questionId: number; item: Param } => {
  return node?.item !== null && node?.item !== undefined && isParam(node.item);
};
