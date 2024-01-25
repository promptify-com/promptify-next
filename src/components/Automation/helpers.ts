import lazy from "next/dynamic";
import type { INode, NodesFileData } from "@/components/Automation/types";

const UNWANTED_TYPES = [
  "n8n-nodes-base.switch",
  "n8n-nodes-base.set",
  "merge",
  "n8n-nodes-base.manualTrigger",
  "n8n-nodes-base.respondToWebhook",
  "n8n-nodes-base.code",
];

export async function getNodeNames(nodes: INode[] = [], slice = 3) {
  const types = nodes
    .filter(node => !UNWANTED_TYPES.includes(node.type))
    .map(node => node.type)
    .filter(Boolean) as string[];

  if (!types.length) {
    return [];
  }

  const nodesData = (
    await import(
      /* webpackChunkName: "workflow_nodes" */
      /* webpackMode: "lazy" */
      "@/components/Automation/nodes.json"
    )
  ).default;
  const filteredTypes = Array.from(new Set(types.map(type => (nodesData as NodesFileData)[type]?.name)));

  console.log("filteredTypes:", filteredTypes);

  return filteredTypes.slice(0, slice);
}
