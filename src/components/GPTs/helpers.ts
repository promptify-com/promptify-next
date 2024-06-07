import { isSameDay } from "date-fns/isSameDay";
import { setHours } from "date-fns/setHours";
import { setMinutes } from "date-fns/setMinutes";
import { setSeconds } from "date-fns/setSeconds";
import { startOfWeek } from "date-fns/startOfWeek";
import { isSameMonth } from "date-fns/isSameMonth";
import { addDays } from "date-fns/addDays";
import { addWeeks } from "date-fns/addWeeks";
import { setDate } from "date-fns/setDate";
import { startOfMonth } from "date-fns/startOfMonth";
import nodesData from "@/components/Automation/nodes.json";
import type {
  INode,
  INodeConnection,
  IProviderNode,
  ITemplateWorkflow,
  IWorkflowCreateResponse,
  IWorkflowSchedule,
  NodesFileData,
} from "@/components/Automation/types";
import type { WorkflowExecution } from "@/components/Automation/types";
import type { ProviderType } from "@/components/GPT/Types";
import { PROMPTIFY_NODE_TYPE, PROVIDERS, RESPOND_TO_WEBHOOK_NODE_TYPE } from "@/components/GPT/Constants";
import { N8N_RESPONSE_REGEX } from "@/components/Automation/helpers";

interface IRelation {
  nextNode: string;
  type: string;
  iconUrl: string;
  description: string;
}

export const cleanCredentialName = (name: string) => name.replace(/Api\s*|Oauth2\s*/gi, "").trim();

function getNodeByName(nodes: INode[], name: string): INode {
  const node = nodes.find(node => node.name === name);

  if (!node) {
    throw new Error(`Node ${name} not found`);
  }

  return node;
}

export function getNodeInfoByType(type: string) {
  const node = (nodesData as NodesFileData)[type];

  if (!node) {
    throw new Error(`Node ${type} not found`);
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
  connections: Record<string, INodeConnection>;
  relations: Map<string, IRelation>;
  workflow: ITemplateWorkflow;
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

export function getWorkflowDataFlow(workflow: ITemplateWorkflow) {
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

  return Array.from(relations).filter(
    ([_, { type }]) => !["n8n-nodes-base.set", "n8n-nodes-base.webhook"].includes(type),
  );
}

const MAIN_CONNECTION_KEY = "main";

class NodeNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NodeNotFoundError";
  }
}

const findProviderNodes = (
  workflow: IWorkflowCreateResponse,
  templateWorkflow: ITemplateWorkflow,
  respondToWebhookNodeName: string,
) => {
  const templateWorkflowConnectedNodeNames = findConnectedNodeNames(
    templateWorkflow.data.connections,
    respondToWebhookNodeName,
  );
  const workflowConnectedNodeNames = findConnectedNodeNames(workflow.connections, respondToWebhookNodeName);

  return workflowConnectedNodeNames
    .filter(nodeName => !templateWorkflowConnectedNodeNames.includes(nodeName))
    .map(nodeName => workflow.nodes.find(node => node.name === nodeName)!);
};

const findConnectedNodeNames = (connections: Record<string, INodeConnection>, nodeName: string) => {
  return Object.entries(connections)
    .filter(([, { main }]) => main[0].find(nodeConn => nodeConn.node === nodeName))
    .map(([nodeName]) => nodeName);
};

const findAdjacentNode = (nodes: INode[], connections: Record<string, INodeConnection>, targetNodeName: string) => {
  return nodes.find(
    node => connections[node.name]?.[MAIN_CONNECTION_KEY][0].some(node => node.node === targetNodeName),
  );
};

export const isNodeProvider = (workflow: IWorkflowCreateResponse, nodeId: string) => {
  const nodeData = workflow.nodes.find(_node => _node.id === nodeId);
  if (!nodeData) return false;

  const isProvider = !!PROVIDERS[nodeData.type as ProviderType];
  if (!isProvider) return false;

  const respondToWebhookNode = workflow.nodes.find(node => node.type === RESPOND_TO_WEBHOOK_NODE_TYPE);
  const nodeConnection = workflow.connections[nodeData.name];
  const isResponseConnected = Boolean(
    nodeConnection && nodeConnection[MAIN_CONNECTION_KEY][0].find(conn => conn.node === respondToWebhookNode?.name),
  );
  return isResponseConnected;
};

export const removeProviderNode = (
  workflow: IWorkflowCreateResponse,
  providerName: string,
): IWorkflowCreateResponse => {
  const provider = workflow.nodes.find(node => node.name === providerName);

  if (!provider) {
    return workflow;
  }

  const respondToWebhookNode = workflow.nodes.find(node => node.type === RESPOND_TO_WEBHOOK_NODE_TYPE);

  if (!respondToWebhookNode) {
    throw new NodeNotFoundError(`Could not find the "${RESPOND_TO_WEBHOOK_NODE_TYPE}" node`);
  }

  const removedProviderName = provider.name;
  const adjacentNode = findAdjacentNode(workflow.nodes, workflow.connections, removedProviderName);

  if (!adjacentNode) {
    throw new Error('Could not find the adjacent node to "Respond to Webhook" node');
  }

  const cleanConnections = workflow.connections[adjacentNode.name][MAIN_CONNECTION_KEY][0].filter(
    connection => connection.node !== removedProviderName,
  );

  if (!cleanConnections.length) {
    cleanConnections.push({
      node: respondToWebhookNode.name,
      type: MAIN_CONNECTION_KEY,
      index: 0,
    });
  }

  workflow.nodes = workflow.nodes.filter(node => node.name !== removedProviderName);
  workflow.connections[adjacentNode.name] = {
    [MAIN_CONNECTION_KEY]: [cleanConnections],
  };
  delete workflow.connections[removedProviderName];

  return workflow;
};

export function injectProviderNode(
  workflow: IWorkflowCreateResponse,
  templateWorkflow: ITemplateWorkflow,
  { nodeParametersCB, node }: IProviderNode,
) {
  const clonedWorkflow = structuredClone(workflow);
  const respondToWebhookNode = clonedWorkflow.nodes.find(node => node.type === RESPOND_TO_WEBHOOK_NODE_TYPE);

  if (!respondToWebhookNode) {
    throw new NodeNotFoundError(`Could not find the "${RESPOND_TO_WEBHOOK_NODE_TYPE}" node`);
  }

  const { nodes, connections } = clonedWorkflow;

  const currentProviders = findProviderNodes(workflow, templateWorkflow, respondToWebhookNode.name);

  const adjacentConnector = currentProviders[0] ? currentProviders[0].name : respondToWebhookNode.name;
  const adjacentNode = findAdjacentNode(nodes, connections, adjacentConnector);

  if (!adjacentNode) {
    throw new NodeNotFoundError(`Could not find the adjacent node to "${adjacentConnector}" node`);
  }

  const responseBody = respondToWebhookNode.parameters.responseBody ?? "";

  const providerNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    typeVersion: node.typeVersion,
    credentials: node.credentials,
    parameters: nodeParametersCB(responseBody),
    position: [respondToWebhookNode.position[0] - 200, respondToWebhookNode.position[1] - 300] as [number, number],
  };

  nodes.push(providerNode);

  currentProviders.push(providerNode);

  const promptifyNode = nodes.filter(node => node.type === PROMPTIFY_NODE_TYPE).pop();

  if (promptifyNode) {
    promptifyNode.parameters.save_output = true;
    promptifyNode.parameters.template_streaming = true;

    // Allow streaming Promptify results for promptify provider & response pattern expect streaming
    const promptifyProvider = [...nodes].reverse().find(node => node.type === PROMPTIFY_NODE_TYPE);
    const allowStream =
      promptifyProvider &&
      isNodeProvider(clonedWorkflow, promptifyProvider.id) &&
      N8N_RESPONSE_REGEX.test(responseBody);

    if (allowStream) {
      promptifyNode.parameters.template_streaming = false;
    }
  }

  connections[adjacentNode.name] = {
    [MAIN_CONNECTION_KEY]: [
      [
        ...currentProviders.map(provider => ({
          node: provider.name,
          type: MAIN_CONNECTION_KEY,
          index: 0,
        })),
      ],
    ],
  };
  connections[providerNode.name] = {
    [MAIN_CONNECTION_KEY]: [
      [
        {
          node: respondToWebhookNode.name,
          type: MAIN_CONNECTION_KEY,
          index: 0,
        },
      ],
    ],
  };

  return {
    ...clonedWorkflow,
    nodes,
    connections,
  };
}

export function getProviderParams(providerType: ProviderType) {
  switch (providerType) {
    case "n8n-nodes-base.slack":
      return [
        {
          name: "channelId",
          displayName: "Channel name:",
          type: "text",
          required: true,
        },
      ];
    case "n8n-nodes-base.gmail":
      return [
        {
          name: "sendTo",
          displayName: "Send to:",
          type: "email",
          required: true,
        },
        {
          name: "subject",
          displayName: "Subject:",
          type: "text",
          required: true,
        },
      ];
    case "n8n-nodes-base.whatsApp":
      return [
        {
          name: "phoneNumberId",
          displayName: "Phone Number:",
          type: "text",
          required: true,
        },
      ];
    case "n8n-nodes-base.telegram":
      return [
        {
          name: "chatId",
          displayName: "Chat ID:",
          type: "text",
          required: true,
        },
      ];
    case "n8n-nodes-promptify.promptify":
      return [];
    default:
      throw new Error(`Provider "${providerType}" is not recognized!`);
  }
}

export function replaceProviderParamValue(providerType: ProviderType, values: Record<string, string>): {} {
  switch (providerType) {
    case "n8n-nodes-base.slack":
      return {
        select: "channel",
        channelId: {
          __rl: true,
          value: values.channelId.startsWith("@") ? values.channelId : `@${values.channelId}`,
          mode: "name",
        },
        text: values.content,
        otherOptions: {},
      };
    case "n8n-nodes-base.gmail":
      return {
        sendTo: values.sendTo,
        subject: values.subject,
        message: values.content,
        options: {},
      };
    case "n8n-nodes-base.whatsApp":
      return {
        operation: "send",
        phoneNumberId: values.phoneNumberId,
        recipientPhoneNumber: values.phoneNumberId,
        textBody: values.content,
        additionalFields: {},
      };
    case "n8n-nodes-base.telegram":
      return {
        chatId: values.chatId.startsWith("@") ? values.chatId : `@${values.chatId}`,
        text: values.content,
        additionalFields: {},
      };
    case "n8n-nodes-promptify.promptify":
      return {};
    default:
      throw new Error(`Provider "${providerType}" is not recognized!`);
  }
}

const statusPriority = ["failed", "success"];

export function getHighestPriorityStatus(executions: WorkflowExecution[]) {
  for (const status of statusPriority) {
    if (executions?.some(execution => execution.status === status)) {
      return status;
    }
  }
  return null;
}

export const getStylesForSchedule = (isScheduled: boolean, date: Date) => {
  if (isScheduled) {
    if (isSameDay(date, new Date())) {
      return { backgroundColor: "#6E45E9", color: "white" };
    }
    return { backgroundColor: "#F4F1FF", color: "#6E45E9" };
  }
  return { backgroundColor: "transparent", color: "text.primary" };
};

export const getStylesForStatus = (status: string) => {
  switch (status) {
    case "success":
      return { backgroundColor: "#E4FEE7", color: "#228B22" };
    case "failed":
      return { backgroundColor: "#E94545", color: "white" };
    default:
      return { backgroundColor: "transparent", color: "text.primary" };
  }
};

export const calculateScheduledDates = (schedule: IWorkflowSchedule, monthStart: Date): Date[] => {
  let dates: Date[] = [];
  const { frequency, hour, minute, day_of_week, day_of_month } = schedule;
  const currentMonth = monthStart.getMonth();

  const parsedHour = parseInt(hour as unknown as string, 10);
  const parsedMinute = parseInt(minute as unknown as string, 10);
  const parsedDayOfWeek = parseInt(day_of_week as unknown as string, 10);

  const addDate = (date: Date) => {
    date = setHours(date, parsedHour);
    date = setMinutes(date, parsedMinute);
    date = setSeconds(date, 0);
    dates.push(new Date(date));
  };

  if (frequency === "daily") {
    let date = startOfMonth(monthStart);
    while (date.getMonth() === currentMonth) {
      addDate(new Date(date));
      date = addDays(date, 1);
    }
  } else if (frequency === "weekly") {
    let date = startOfWeek(startOfMonth(monthStart), { weekStartsOn: 1 });
    date = addDays(date, parsedDayOfWeek);

    while (date < startOfMonth(monthStart)) {
      date = addWeeks(date, 1);
    }

    while (isSameMonth(date, monthStart)) {
      addDate(new Date(date));
      date = addWeeks(date, 1);
    }
  } else if (frequency === "bi-weekly") {
    const firstDate = setDate(startOfMonth(monthStart), 1);
    const secondDate = setDate(startOfMonth(monthStart), 15);
    if (firstDate.getMonth() === currentMonth) addDate(new Date(firstDate));
    if (secondDate.getMonth() === currentMonth) addDate(new Date(secondDate));
  } else if (frequency === "monthly") {
    const parsedDayOfMonth = parseInt(String(day_of_month), 10);
    if (parsedDayOfMonth > 0 && parsedDayOfMonth <= 27) {
      let date = setDate(startOfMonth(monthStart), parsedDayOfMonth);
      if (date.getMonth() === currentMonth) {
        addDate(new Date(date));
      }
    }
  }

  return dates;
};
