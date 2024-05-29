import type { IConnections, INode, IProvideNode, IWorkflow, NodesFileData } from "@/components/Automation/types";
import nodesData from "@/components/Automation/nodes.json";
import { PROVIDERS } from "@/components/GPT/Constants";

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
      description: nodeInfo.description,
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

export function injectProviderNode(workflow: IWorkflow, { nodeParametersCB, node }: IProvideNode) {
  const clonedWorkflow = structuredClone(workflow);

  const nodes = clonedWorkflow.data.nodes;
  const respondToWebhookNode = nodes.find(node => node.type === "n8n-nodes-base.respondToWebhook");

  // Workflow must implement response to webhook node
  if (!respondToWebhookNode) {
    throw new Error('Could not find the "Respond to Webhook" node');
  }

  // Find the last Promptify node
  const promptifyNode = nodes.filter(node => node.type === "n8n-nodes-promptify.promptify").pop();

  if (promptifyNode) {
    // Update the Promptify node parameters
    promptifyNode.parameters.save_output = true;
    promptifyNode.parameters.template_streaming = true;
  }

  // get the content
  const responseBody = respondToWebhookNode.parameters.responseBody ?? "";
  // Create a new provider node
  const providerNode = {
    ...node,
    parameters: nodeParametersCB(responseBody),
    position: [respondToWebhookNode.position[0] - 200, respondToWebhookNode.position[1] - 300] as [number, number],
  };

  nodes.push(providerNode);

  const connections = clonedWorkflow.data.connections;
  // get the previous node to the respondToWebhookNode
  const adjacentNode = nodes.find(node => connections[node.name]?.main[0][0].node === respondToWebhookNode.name);

  if (!adjacentNode) {
    throw new Error('Could not find the adjacent node to "Respond to Webhook" node');
  }

  // Update the connections
  connections[adjacentNode.name] = {
    main: [
      [
        {
          node: providerNode.name,
          type: "main",
          index: 0,
        },
      ],
    ],
  };
  connections[providerNode.name] = {
    main: [
      [
        {
          node: respondToWebhookNode.name,
          type: "main",
          index: 0,
        },
      ],
    ],
  };

  return clonedWorkflow;
}

export function getProviderParams(providerType: keyof typeof PROVIDERS) {
  let params;
  if (providerType === "n8n-nodes-base.gmail") {
    params = [
      {
        name: "sendTo",
        displayName: "Send to:",
        type: "text",
        required: true,
      },
      {
        name: "subject",
        displayName: "Subject:",
        type: "text",
        required: true,
      },
    ];
  }
  if (providerType === "n8n-nodes-base.slack") {
    params = [
      {
        name: "channelId",
        displayName: "Channel name:",
        type: "text",
        required: true,
      },
    ];
  }

  return params ?? [];
}

export function replaceProviderParamValue(providerType: keyof typeof PROVIDERS, values: Record<string, string>) {
  let params = {};
  if (providerType === "n8n-nodes-base.slack") {
    params = {
      select: "channel",
      channelId: {
        __rl: true,
        value: values.channelId,
        mode: "name",
      },
      text: values.content,
      otherOptions: {},
    };
  }
  if (providerType === "n8n-nodes-base.gmail") {
    params = {
      sendTo: values.sendTo,
      subject: values.subject,
      message: values.content,
      options: {},
    };
  }
  console.log(values);

  return params;
}
