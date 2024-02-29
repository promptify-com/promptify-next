import { n8nClient as ApiClient } from "@/common/axios";
import Storage from "@/common/storage";
import { Templates } from "@/core/api/dto/templates";
import { getTemplateById } from "@/hooks/api/templates";

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

  return Array.from(mergedIds)?.map(n => +n) ?? [];
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
        const __data = _data as Templates;
        savedData[_data.id] = {
          id: __data.id,
          slug: __data.slug,
          thumbnail: __data.thumbnail,
          title: __data.title,
          tags: __data.tags,
          favorites_count: __data.favorites_count,
        } as Templates;
        filteredData[idx] = savedData[_data.id] as Templates;
      }
    });

    savedDataRefs[idsKey] = collectedIds;

    Storage.set(dataRefKey, JSON.stringify(savedDataRefs));
    Storage.set(dataKey, JSON.stringify(savedData));
  }

  return filteredData;
}
