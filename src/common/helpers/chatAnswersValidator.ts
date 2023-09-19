import { QuestionAnswerParams, TemplateQuestionGeneratorData } from "@/core/api/dto/prompts";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getExecutionById } from "@/hooks/api/executions";
import { AnswerValidatorResponse } from "../types/chat";

const answersValidatorTemplateId = 516;

export const generate = ({
  token,
  payload,
}: {
  token: string;
  payload: QuestionAnswerParams;
}): Promise<AnswerValidatorResponse> => {
  return new Promise(resolve => {
    const data: TemplateQuestionGeneratorData[] = [
      {
        prompt: 1796,
        contextual_overrides: [],
        prompt_params: payload,
      },
    ];
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/templates/${answersValidatorTemplateId}/execute/?streaming=true`;
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
        const _execution = await getExecutionById(templateExecutionId);

        resolve(JSON.parse(_execution.prompt_executions[0].output.replace(/\n(\s+)?/g, "")));
      },
    });
  });
};
