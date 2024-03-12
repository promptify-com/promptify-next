import { n8nClient as ApiClient } from "@/common/axios";
import Storage from "@/common/storage";
import { getTemplateById } from "@/hooks/api/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams } from "@/core/api/dto/prompts";
import type { Templates } from "@/core/api/dto/templates";
import type { IQuestion } from "../Prompt/Types/chat";

interface SendMessageResponse {
  output?: string;
  message?: string;
}

const N8N_SAVED_TEMPLATES = "n8nSavedTemplates";
const N8N_SAVED_TEMPLATES_REFS = "n8nSavedTemplatesRefs";

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
}

export async function fetchData(ids: number[]) {
  if (!ids.length) {
    return [];
  }

  const dataKey = N8N_SAVED_TEMPLATES;
  const dataRefKey = N8N_SAVED_TEMPLATES_REFS;
  let savedData = Storage.get(dataKey) as Record<number, Templates>;
  let savedDataRefs = Storage.get(dataRefKey) as Record<string, number[]>;
  const idsKey = ids.join("_");

  if (!savedData) {
    savedData = {};
    savedDataRefs = {};
  }

  if (savedDataRefs[idsKey]) {
    return ids.map(id => savedData[id]);
  }

  const data = await Promise.allSettled(
    ids.map(id => {
      // we don't need to trigger a request as we already have this template stored
      if (savedData[id]) {
        return savedData[id];
      }

      return getTemplateById(id);
    }),
  );

  const filteredData = data
    .map(_data => {
      if (_data.status === "fulfilled") {
        return _data.value;
      }
    })
    .filter(_data => _data?.id) as Templates[];

  if (!!filteredData.length) {
    const collectedIds: number[] = [];
    // only save necessary data to be shown
    filteredData.forEach((_data, idx) => {
      collectedIds.push(_data.id);

      if (!savedData[_data.id]) {
        const __data = _data;
        savedData[_data.id] = {
          id: __data.id,
          slug: __data.slug,
          thumbnail: __data.thumbnail,
          title: __data.title,
          tags: __data.tags,
          favorites_count: __data.favorites_count,
          description: __data.description,
          executions_count: __data.executions_count,
          prompts: __data.prompts,
          questions: __data.questions,
        } as Templates;
        filteredData[idx] = savedData[_data.id];
      }
    });

    savedDataRefs[idsKey] = collectedIds;

    Storage.set(dataRefKey, JSON.stringify(savedDataRefs));
    Storage.set(dataKey, JSON.stringify(savedData));
  }

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
