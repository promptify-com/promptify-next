import type { EngineOutput, Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { setRepeatedExecution } from "@/core/store/executionsSlice";
import { setAnswers, setSelectedTemplate } from "@/core/store/chatSlice";
import { AppDispatcher } from "@/hooks/useStore";

export const isImageOutput = (output: string, engineType?: EngineOutput): boolean => {
  try {
    const imgURL = new URL(output);
    const IsImage = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"].some(extension =>
      imgURL.pathname.endsWith(extension),
    );

    return IsImage || engineType === "IMAGE";
  } catch {
    return false;
  }
};

export const repeatExecution = (execution: TemplatesExecutions, selectTemplate: boolean, dispatch: AppDispatcher) => {
  const { parameters } = execution;
  dispatch(setRepeatedExecution(execution));
  if (selectTemplate) {
    dispatch(setSelectedTemplate(execution.template as Templates));
  }

  const newAnswers = parameters
    ? Object.keys(parameters)
        .map(promptId => {
          const param = parameters[promptId];
          return Object.keys(param).map(inputName => ({
            inputName: inputName,
            required: true,
            question: "",
            answer: param[inputName],
            prompt: parseInt(promptId),
            error: false,
          }));
        })
        .flat()
    : [];
  dispatch(setAnswers(newAnswers));
};
