import type { Engine, Templates } from "@/core/api/dto/templates";

export const handleInitPrompt = (template: Templates, engines: Engine[]) => {
  if (template?.prompts) {
    const textEngine = engines.find(engine => engine.output_type === "TEXT");
    const _prompts = template.prompts.map((prompt, index) => {
      const initialParams = prompt.parameters.map(param => ({
        parameter_id: param.parameter.id,
        score: param.score,
        name: param.parameter.name,
        is_visible: param.is_visible,
        is_editable: param.is_editable,
        descriptions: param.parameter.score_descriptions,
      }));

      return {
        id: prompt.id,
        title: prompt.title || `Prompt #1`,
        content: prompt.content || "Describe here prompt parameters, for example {{name:text}}",
        engine: prompt.engine?.id || textEngine?.id,
        dependencies: prompt.dependencies || [],
        parameters: initialParams,
        order: index + 1,
        output_format: prompt.output_format,
        model_parameters: prompt.model_parameters,
        is_visible: prompt.is_visible,
        show_output: prompt.show_output,
        prompt_output_variable: prompt.prompt_output_variable,
      };
    });

    return _prompts;
  }
};
