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
import { PROMPTIFY_NODE_TYPE, RESPOND_TO_WEBHOOK_NODE_TYPE } from "@/components/GPT/Constants";
import { N8N_RESPONSE_REGEX } from "@/components/Automation/helpers";
import { IAnswer } from "@/components/Prompt/Types/chat";
import { PromptInputType } from "@/components/Prompt/Types";

export interface IRelation {
  nextNode: string;
  type: string;
  iconUrl: string;
  description: string;
  templateId?: number;
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

    const promptifyNode = workflow.data.nodes.find(node => node.type === PROMPTIFY_NODE_TYPE);

    const relationData: IRelation = {
      nextNode: connections[nodeName].main[0][0].node,
      type: nodeType,
      iconUrl: nodeInfo.iconUrl ? `${process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL}/${nodeInfo.iconUrl}` : "",
      description: nodeInfo.description ?? "",
    };

    if (promptifyNode?.name.includes("Promptify") && nodeType === PROMPTIFY_NODE_TYPE) {
      relationData.templateId = promptifyNode.parameters.template;
    }

    relations.set(nodeName, relationData);

    buildNextConnectedData({
      nodeName: connections[nodeName].main[0][0].node,
      connections,
      workflow,
      relations,
    });
  }
}

const unwantedDataFlowNodes = [
  "n8n-nodes-base.set",
  "n8n-nodes-base.webhook",
  "n8n-nodes-base.code",
  "n8n-nodes-base.filter",
  "n8n-nodes-base.splitOut",
  "n8n-nodes-base.merge",
  "n8n-nodes-base.function",
  "n8n-nodes-base.splitInBatches",
];
export function getWorkflowDataFlow(workflow: ITemplateWorkflow) {
  const webhookNodeName = workflow.data.nodes.find(node => node.type === "n8n-nodes-base.webhook")?.name;

  if (!webhookNodeName) {
    throw new Error("No webhook node found");
  }

  const relations = new Map<string, IRelation>();
  const relationsSet = new Set<string>();

  buildNextConnectedData({
    nodeName: webhookNodeName,
    connections: workflow.data.connections,
    relations,
    workflow,
  });

  return Array.from(relations).filter(([_, { type }]) => {
    if (unwantedDataFlowNodes.includes(type)) {
      return false;
    }

    const seen = relationsSet.has(type);
    relationsSet.add(type);

    return !seen;
  });
}

const MAIN_CONNECTION_KEY = "main";

class NodeNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NodeNotFoundError";
  }
}

export const MARKDOWN_NODE_NAME = "_markdown__$providers$__message_";
export const nameProvider = (name: string) => `_send__provider__$${name}$__message_`;
export const isNodeProvider = (node: INode): boolean => {
  const providerPattern = new RegExp(/^_send__provider__\$.*\$__message_$/);
  return !!providerPattern.exec(node.name);
};

const findAdjacentNode = (nodes: INode[], connections: Record<string, INodeConnection>, targetNodeName: string) => {
  return nodes.find(node =>
    connections[node.name]?.[MAIN_CONNECTION_KEY][0].some(node => node.node === targetNodeName),
  );
};

const findProviderNodes = (workflow: IWorkflowCreateResponse) => {
  const providersNodes = workflow.nodes.filter(node => isNodeProvider(node));

  return providersNodes;
};

// Enable streaming Promptify results in Promptify node
export const enableWorkflowPromptifyStream = (workflow: IWorkflowCreateResponse) => {
  const _workflow = structuredClone(workflow);

  const respondToWebhookNode = _workflow.nodes.find(node => node.type === RESPOND_TO_WEBHOOK_NODE_TYPE);

  if (!respondToWebhookNode) {
    throw new NodeNotFoundError(`Could not find the "${RESPOND_TO_WEBHOOK_NODE_TYPE}" node`);
  }

  const promptifyNode = _workflow.nodes.filter(node => node.type === PROMPTIFY_NODE_TYPE).pop();

  if (!promptifyNode) {
    return _workflow;
  }

  promptifyNode.parameters.save_output = true;
  promptifyNode.parameters.template_streaming = true;

  const hasProviders = findProviderNodes(_workflow).length > 0;
  const responseBody = respondToWebhookNode.parameters.responseBody ?? "";
  const responseBodyStreamMatched = new RegExp(N8N_RESPONSE_REGEX).exec(responseBody);
  if (!hasProviders && responseBodyStreamMatched) {
    promptifyNode.parameters.template_streaming = false;
  }

  return _workflow;
};

export function injectProviderNode(workflow: IWorkflowCreateResponse, { nodeParametersCB, node }: IProviderNode) {
  const clonedWorkflow = structuredClone(workflow);
  const { nodes, connections } = clonedWorkflow;
  const respondToWebhookNode = nodes.find(node => node.type === RESPOND_TO_WEBHOOK_NODE_TYPE);

  if (!respondToWebhookNode) {
    throw new NodeNotFoundError(`Could not find the "${RESPOND_TO_WEBHOOK_NODE_TYPE}" node`);
  }

  const currentProviderNodes = findProviderNodes(clonedWorkflow);
  const connectionProviders = currentProviderNodes
    .filter(provider => !provider.name.toLowerCase().includes("gmail"))
    .map(provider => ({
      node: provider.name,
      type: MAIN_CONNECTION_KEY,
      index: 0,
    }));
  const adjacentNode = findAdjacentNode(nodes, connections, respondToWebhookNode.name);

  if (!adjacentNode) {
    throw new NodeNotFoundError(`Could not find the adjacent node`);
  }

  const responseBody = respondToWebhookNode.parameters.responseBody ?? "";
  const isGmailProvider = node.name.toLowerCase().includes("gmail");
  const providerNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    typeVersion: node.typeVersion,
    onError: "continueRegularOutput",
    ...(node.credentials && { credentials: node.credentials }),
    parameters: isGmailProvider ? nodeParametersCB("={{ $json.data }}") : nodeParametersCB(responseBody),
    position: [respondToWebhookNode.position[0] - 200, respondToWebhookNode.position[1] - 300] as [number, number],
  };

  nodes.push(providerNode);

  if (isGmailProvider) {
    const markdownNode = {
      id: "29d027a9-e0c2-4a60-b23a-a723b8f1f1d2",
      name: MARKDOWN_NODE_NAME,
      type: "n8n-nodes-base.markdown",
      typeVersion: 1,
      position: [620, -60] as [number, number],
      parameters: {
        mode: "markdownToHtml",
        markdown: responseBody,
        options: {},
      },
    };

    nodes.push(markdownNode);

    connections[markdownNode.name] = {
      [MAIN_CONNECTION_KEY]: [
        [
          {
            node: providerNode.name,
            type: MAIN_CONNECTION_KEY,
            index: 0,
          },
        ],
      ],
    };

    connectionProviders.push({
      node: markdownNode.name,
      type: MAIN_CONNECTION_KEY,
      index: 0,
    });
  } else {
    const hasGmailProvider = currentProviderNodes.some(provider => provider.name.toLowerCase().includes("gmail"));

    if (hasGmailProvider) {
      connectionProviders.push({
        node: MARKDOWN_NODE_NAME,
        type: MAIN_CONNECTION_KEY,
        index: 0,
      });
    }

    connectionProviders.push({
      node: providerNode.name,
      type: MAIN_CONNECTION_KEY,
      index: 0,
    });
  }

  connections[adjacentNode.name] = {
    [MAIN_CONNECTION_KEY]: [
      connectionProviders.concat({
        node: respondToWebhookNode.name,
        type: MAIN_CONNECTION_KEY,
        index: 0,
      }),
    ],
  };

  return enableWorkflowPromptifyStream({
    ...clonedWorkflow,
    nodes,
    connections,
  });
}

export const removeProviderNode = (
  workflow: IWorkflowCreateResponse,
  providerName: string,
): IWorkflowCreateResponse => {
  let { nodes, connections } = workflow;

  const providerNode = nodes.find(node => node.name === providerName);

  if (!providerNode) {
    return workflow;
  }

  const adjacentNode = findAdjacentNode(
    nodes,
    connections,
    providerName.toLowerCase().includes("gmail") ? MARKDOWN_NODE_NAME : providerName,
  );

  if (!adjacentNode) {
    return workflow;
  }

  const respondToWebhookNode = nodes.find(node => node.type === RESPOND_TO_WEBHOOK_NODE_TYPE);

  if (!respondToWebhookNode) {
    throw new NodeNotFoundError(`Could not find the "${RESPOND_TO_WEBHOOK_NODE_TYPE}" node`);
  }

  const currentProviders = findProviderNodes(workflow);
  const removedProviderName = providerNode.name;
  const remainingProviders = currentProviders.filter(provider => provider.name !== removedProviderName);
  const connectionProviders = remainingProviders
    .filter(provider => !provider.name.toLowerCase().includes("gmail"))
    .map(provider => ({
      node: provider.name,
      type: MAIN_CONNECTION_KEY,
      index: 0,
    }));
  nodes = nodes.filter(node => node.name !== removedProviderName);

  if (removedProviderName.toLowerCase().includes("gmail")) {
    nodes = nodes.filter(node => node.name !== MARKDOWN_NODE_NAME);
    delete connections[MARKDOWN_NODE_NAME];
  } else {
    const hasGmailProvider = remainingProviders.some(provider => provider.name.toLowerCase().includes("gmail"));

    if (hasGmailProvider) {
      connectionProviders.push({
        node: MARKDOWN_NODE_NAME,
        type: MAIN_CONNECTION_KEY,
        index: 0,
      });
    }
  }

  connections[adjacentNode.name] = {
    [MAIN_CONNECTION_KEY]: [
      connectionProviders.concat({
        node: respondToWebhookNode.name,
        type: MAIN_CONNECTION_KEY,
        index: 0,
      }),
    ],
  };

  return enableWorkflowPromptifyStream({ ...workflow, nodes, connections });
};

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

export const getWorkflowInputsValues = (workflow: IWorkflowCreateResponse) => {
  let values: IAnswer[] = [];

  const kwargs = workflow.periodic_task?.kwargs;
  if (kwargs) {
    const parsedKwargs = JSON.parse(kwargs || "{}");
    const workflowData = parsedKwargs.workflow_data || {};

    values = Object.entries(workflowData).map(([inputName, answer]) => ({
      inputName,
      required: true,
      question: ``,
      answer: answer as PromptInputType,
      prompt: 0,
    }));
  }

  return values;
};
