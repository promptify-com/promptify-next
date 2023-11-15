import { TemplateQuestionGeneratorData, VaryParams } from "@/core/api/dto/prompts";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getExecutionById } from "@/hooks/api/executions";

const answersValidatorTemplateId = 547;

export const vary = ({
  token,
  payload,
}: {
  token: string;
  payload: VaryParams;
}): Promise<{ [question: string]: string | number } | string> => {
  return new Promise(resolve => {
    const data: TemplateQuestionGeneratorData[] = [
      {
        prompt: 2144,
        contextual_overrides: [],
        prompt_params: payload,
      },
    ];
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${answersValidatorTemplateId}/execute/`;
    let templateExecutionId = 0;

    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      openWhenHidden: true,
      onmessage(msg) {
        try {
          if (msg.event === "infer" && msg.data.includes("template_execution_id") && !templateExecutionId) {
            const message: { template_execution_id: number } = JSON.parse(msg.data.trim());
            templateExecutionId = message.template_execution_id;
          }
        } catch (_) {}
      },
      async onclose() {
        try {
          const _execution = await getExecutionById(templateExecutionId);

          if (_execution.errors) {
            resolve("Something wrong happened");
          }

          resolve(
            _execution.prompt_executions
              ? JSON.parse(_execution.prompt_executions[0].output.replace(/\n(\s+)?/g, ""))
              : {},
          );
        } catch (_) {
          resolve("Something wrong happened");
        }
      },
    });
  });
};
