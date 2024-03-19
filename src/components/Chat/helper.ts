import { n8nClient as ApiClient } from "@/common/axios";
import { getTemplateById } from "@/hooks/api/templates";
import { randomId } from "@/common/helpers";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams } from "@/core/api/dto/prompts";
import type { Templates } from "@/core/api/dto/templates";
import type { CreateMessageProps, IQuestion } from "../Prompt/Types/chat";

interface SendMessageResponse {
  output?: string;
  message?: string;
}

export async function sendMessageAPI(message: string): Promise<SendMessageResponse> {
  const response = await ApiClient.post(`/webhook/${process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_PATH}`, {
    action: "sendMessage",
    message: `${message}`,
  });

  return response.data;
}

export function extractTemplateIDs(message: string) {
  const tplIds =
    message
      .match(/(template([\_\s*]?id)?|promptify_tpl_id)(\W+)?:?(\s*[^\d]\s*(\d+)|\d+)/gi)
      ?.map(tpl => +tpl.replace(/[^\d]+/, ""))
      .filter(Boolean) ?? [];
  const tplIds2 =
    message.match(/ids[\s*\w]+are[\s*\d\,]+/gi)?.flatMap(s => {
      const repl = s.replace(/[^\d]/g, "#");
      return repl.split("#").filter(Boolean);
    }) ?? [];
  const mergedIds = new Set([...tplIds, ...tplIds2]);

  return Array.from(mergedIds)?.map(n => +n) ?? [450, 451, 127, 137, 138];
  // return [450, 451, 127, 137, 138, 119];
}

export async function fetchData(ids: number[]) {
  if (!ids.length) {
    return [];
  }

  const data = await Promise.allSettled(ids.map(id => getTemplateById(id)));

  const filteredData = data
    .map(_data => {
      if (_data.status === "fulfilled") {
        return _data.value;
      }
    })
    .filter(_data => _data?.id) as Templates[];

  return filteredData;
}

export function prepareQuestions(inputs: IPromptInput[], params: PromptParams[]): IQuestion[] {
  const inputQuestions: IQuestion[] = inputs.map(input => ({
    inputName: input.name,
    question: input.question || ` what is your ${input.fullName}?`,
    required: input.required,
    type: "input",
    prompt: input.prompt,
  }));

  const paramQuestions: IQuestion[] = params.map(param => ({
    inputName: param.parameter.name,
    prompt: param.prompt,
    question: `What is your ${param.parameter.name}?`,
    required: false,
    type: "param",
  }));

  return [...inputQuestions, ...paramQuestions];
}

export const createMessage = ({
  type,
  timestamp = new Date().toISOString(),
  fromUser = false,
  noHeader = false,
  isEditable = false,
  isRequired = false,
  questionIndex,
  questionInputName,
  text,
  executionId,
  templates = [],
  template,
  isLatestExecution,
}: CreateMessageProps) => ({
  id: randomId(),
  text,
  type,
  createdAt: timestamp,
  fromUser,
  noHeader,
  isEditable,
  isRequired,
  questionIndex,
  questionInputName,
  executionId,
  templates,
  template,
  isLatestExecution,
});
