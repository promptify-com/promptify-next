import { IParameters } from "@/common/types";
import { IEditPrompts } from "../types/builder";

interface AddParameterProps {
  prompt: IEditPrompts;
  newParameter: IParameters;
}

export const addParameter = ({ prompt, newParameter }: AddParameterProps): IEditPrompts => {
  if (prompt.parameters.some(p => p.parameter_id === newParameter.id)) {
    return prompt;
  }

  const parameterToAdd = {
    parameter_id: newParameter.id,
    score: 1,
    name: newParameter.name,
    is_visible: true,
    is_editable: true,
    descriptions: newParameter.score_descriptions,
  };

  const updatedPrompt = {
    ...prompt,
    parameters: [...prompt.parameters, parameterToAdd],
  };

  return updatedPrompt;
};
