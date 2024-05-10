import { n8nClient as ApiClient } from "@/common/axios";
import { getTemplateById, getWorkflowById } from "@/hooks/api/templates";
import { randomId } from "@/common/helpers";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptParams } from "@/core/api/dto/prompts";
import type { Templates } from "@/core/api/dto/templates";
import type { CreateMessageProps, IQuestion } from "../Prompt/Types/chat";
import { chatsApi } from "@/core/api/chats";
import { CHATS_LIST_PAGINATION_LIMIT } from "./Constants";
import type { NextRouter } from "next/router";
import type { IChat } from "@/core/api/dto/chats";
import type { AppDispatcher } from "@/hooks/useStore";
import type { IWorkflow } from "@/components/Automation/types";
import type { ToastState } from "@/core/store/toastSlice";

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
}

export function extractWorkflowIDs(message: string) {
  return (
    message
      .match(/(workflow([\_\s*]*?id)?)(\W+)?:?(\s*[^\d]\s*(\d+)|\d+)/gi)
      ?.map(wkf => +wkf.replace(/[^\d]+/, ""))
      .filter(Boolean) ?? []
  );
}

export function isTemplates(data: Templates[] | IWorkflow[]): data is Templates[] {
  if (!data.length) return false;

  return "favorites_count" in data[0];
}

export async function fetchData(ids: number[], isTemplate: boolean) {
  if (!ids.length) {
    return [];
  }

  const data = await Promise.allSettled(ids.map(id => (isTemplate ? getTemplateById(id) : getWorkflowById(id))));

  const filteredData = data
    .map(_data => {
      if (_data.status === "fulfilled") {
        return _data.value;
      }
    })
    .filter(_data => _data?.id) as IWorkflow[] | Templates[];

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
  template,
  isLatestExecution,
  data,
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
  template,
  isLatestExecution,
  data,
});

export const suggestionsMessageText = (content?: string) => {
  if (!content) {
    return;
  }
  return content
    .replace(
      /[\(]?(promptify_tpl_id|template([\_\s*]?id)?|with id|workflow([\_\s*]?id)?)(\W+)?:?(\s*[^\d]\s*(\d+)|\d+)[ \)]?/gi,
      "",
    )
    .replace(/((\,\d+)|#\d+|([\(]?id:\s*\d+[\)]?))/gi, "")
    .trim();
};

export function updateChatsList(
  dispatch: AppDispatcher,
  router: NextRouter,
  chat: IChat,
  op: "ADD" | "UPDATE" | "DELETE",
) {
  dispatch(
    chatsApi.util.updateQueryData(
      "getChats",
      { limit: CHATS_LIST_PAGINATION_LIMIT, offset: Number(router.query.ch_o || 0) },
      chats => {
        return {
          count: chats.count,
          next: chats.next,
          previous: chats.previous,
          results:
            op === "ADD"
              ? [chat, ...chats.results]
              : op === "DELETE"
              ? chats.results.filter(_chat => _chat.id !== chat.id)
              : op === "UPDATE"
              ? chats.results.map(_chat => ({ ...(_chat.id === chat.id ? chat : _chat) }))
              : chats.results,
        };
      },
    ),
  );
}

export function createExecuteErrorToast(
  promptTitle: string = "",
  current: number = 0,
  total: number = 0,
): Omit<ToastState, "open"> {
  const message = `Failed to execute the prompt « ${promptTitle} » ${current}/${total}`;
  const severity = "error";
  const duration = 6000;

  const toast: Omit<ToastState, "open"> = {
    message,
    severity,
    duration,
    position: {
      vertical: "bottom",
      horizontal: "right",
    },
  };

  return toast;
}
