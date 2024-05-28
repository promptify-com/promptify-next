import type { IConnections, INode, IWorkflow, NodesFileData } from "@/components/Automation/types";
import type { WorkflowExecution } from "@/components/Automation/types";
import nodesData from "@/components/Automation/nodes.json";

interface IRelation {
  nextNode: string;
  type: string;
  iconUrl: string;
  description: string;
}

function getNodeByName(nodes: INode[], name: string): INode {
  const node = nodes.find(node => node.name === name);

  if (!node) {
    throw new Error(`Node ${name} not found`);
  }

  return node;
}

function buildNextConnectedData({
  nodeName,
  connections,
  relations,
  workflow,
}: {
  nodeName: string;
  connections: Record<string, IConnections>;
  relations: Map<string, IRelation>;
  workflow: IWorkflow;
}) {
  if (!connections[nodeName]?.main[0].length) return;

  if (connections[nodeName].main[0][0].node) {
    const nodeType = getNodeByName(workflow.data.nodes, nodeName).type;
    const nodeInfo = (nodesData as NodesFileData)[nodeType];

    relations.set(nodeName, {
      nextNode: connections[nodeName].main[0][0].node,
      type: nodeType,
      iconUrl: nodeInfo.iconUrl ? `${process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL}/${nodeInfo.iconUrl}` : "",
      description: nodeInfo.description ?? "",
    });

    buildNextConnectedData({
      nodeName: connections[nodeName].main[0][0].node,
      connections,
      workflow,
      relations,
    });
  }
}

export function getWorkflowDataFlow(workflow: IWorkflow) {
  const webhookNodeName = workflow.data.nodes.find(node => node.type === "n8n-nodes-base.webhook")?.name;

  if (!webhookNodeName) {
    throw new Error("No webhook node found");
  }

  const relations = new Map<string, IRelation>();

  buildNextConnectedData({
    nodeName: webhookNodeName,
    connections: workflow.data.connections,
    relations,
    workflow,
  });

  // filter out unnecessary nodes
  return Array.from(relations).filter(
    ([_, { type }]) => !["n8n-nodes-base.set", "n8n-nodes-base.webhook"].includes(type),
  );
}

const statusPriority = ["failed", "success", "scheduled"];

export function getHighestPriorityStatus(executions: WorkflowExecution[]) {
  for (const status of statusPriority) {
    if (executions?.some(execution => execution.status === status)) {
      return status;
    }
  }
  return null;
}

export const executionsData: WorkflowExecution[] = [
  // Previous month events
  {
    id: "13654",
    finished: true,
    mode: "webhook",
    retryOf: null,
    retrySuccessId: null,
    status: "success",
    startedAt: "2024-04-10T16:13:13.626Z",
    stoppedAt: "2024-04-10T16:13:17.122Z",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
  },
  {
    id: "13651",
    finished: true,
    mode: "webhook",
    retryOf: null,
    retrySuccessId: null,
    status: "failed",
    startedAt: "2024-04-15T16:12:19.279Z",
    stoppedAt: "2024-04-15T16:12:22.494Z",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
    error: "Network error",
  },
  {
    id: "13655",
    finished: false,
    mode: "scheduled",
    retryOf: null,
    retrySuccessId: null,
    status: "scheduled",
    startedAt: "2024-04-20T10:00:00.000Z",
    stoppedAt: "",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
  },
  // Current month events
  {
    id: "13754",
    finished: true,
    mode: "webhook",
    retryOf: null,
    retrySuccessId: null,
    status: "success",
    startedAt: "2024-05-10T16:13:13.626Z",
    stoppedAt: "2024-05-10T16:13:17.122Z",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
  },
  {
    id: "13751",
    finished: true,
    mode: "webhook",
    retryOf: null,
    retrySuccessId: null,
    status: "failed",
    startedAt: "2024-05-15T16:12:19.279Z",
    stoppedAt: "2024-05-15T16:12:22.494Z",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
    error: "Network error",
  },
  {
    id: "13755",
    finished: false,
    mode: "scheduled",
    retryOf: null,
    retrySuccessId: null,
    status: "scheduled",
    startedAt: "2024-05-20T10:00:00.000Z",
    stoppedAt: "",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
  },
  {
    id: "13755",
    finished: false,
    mode: "scheduled",
    retryOf: null,
    retrySuccessId: null,
    status: "scheduled",
    startedAt: "2024-05-27T10:00:00.000Z",
    stoppedAt: "",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
  },
  // Events on the same day
  {
    id: "13756",
    finished: true,
    mode: "webhook",
    retryOf: null,
    retrySuccessId: null,
    status: "success",
    startedAt: "2024-05-25T10:00:00.000Z",
    stoppedAt: "2024-05-25T10:05:00.000Z",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
  },
  {
    id: "13757",
    finished: true,
    mode: "webhook",
    retryOf: null,
    retrySuccessId: null,
    status: "failed",
    startedAt: "2024-05-25T12:00:00.000Z",
    stoppedAt: "2024-05-25T12:05:00.000Z",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
    error: "Execution failed",
  },
  {
    id: "13758",
    finished: false,
    mode: "scheduled",
    retryOf: null,
    retrySuccessId: null,
    status: "scheduled",
    startedAt: "2024-05-25T14:00:00.000Z",
    stoppedAt: "",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
  },
  // Next month events
  {
    id: "13854",
    finished: true,
    mode: "webhook",
    retryOf: null,
    retrySuccessId: null,
    status: "success",
    startedAt: "2024-06-10T16:13:13.626Z",
    stoppedAt: "2024-06-10T16:13:17.122Z",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
  },
  {
    id: "13851",
    finished: true,
    mode: "webhook",
    retryOf: null,
    retrySuccessId: null,
    status: "failed",
    startedAt: "2024-06-15T16:12:19.279Z",
    stoppedAt: "2024-06-15T16:12:22.494Z",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
    error: "Network error",
  },
  {
    id: "13855",
    finished: false,
    mode: "scheduled",
    retryOf: null,
    retrySuccessId: null,
    status: "scheduled",
    startedAt: "2024-06-20T10:00:00.000Z",
    stoppedAt: "",
    workflowId: "LkQGmazWmp1WMFmg",
    waitTill: null,
  },
];
