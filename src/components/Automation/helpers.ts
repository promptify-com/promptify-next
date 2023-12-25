import { addSpaceBetweenCapitalized } from "@/common/helpers";
import type { INode } from "./types";

const UNWANTED_TYPES = [
  "n8n-nodes-base.switch",
  "n8n-nodes-base.set",
  "merge",
  "n8n-nodes-base.manualTrigger",
  "n8n-nodes-base.respondToWebhook",
  "n8n-nodes-base.code",
];

export function getNodeNames(nodes: INode[] = [], slice = 3) {
  const types = nodes
    .filter(node => !UNWANTED_TYPES.includes(node.type))
    .map(node => {
      if (!node.type) return undefined;

      return node.type.split(".")[1] ?? "";
    })
    .filter(Boolean) as string[];
  const filteredTypes = Array.from(new Set(types.map(type => addSpaceBetweenCapitalized(type))));

  return filteredTypes.slice(0, slice);
}
