import type { AuthCredentials, Creds, INode, NodesFileData } from "@/components/Automation/types";

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

  return filteredTypes.slice(0, slice);
}

const authTypeMapping: { [key: string]: string } = {
  basicAuth: "httpBasicAuth",
  // Add other mappings here if necessary
};

export async function extractAuthData(nodes: INode[] = []): Promise<AuthCredentials[]> {
  const authCredentials: AuthCredentials[] = [];

  //@ts-ignore
  const creds: Creds = (
    await import(
      /* webpackChunkName: "workflow_creds" */
      /* webpackMode: "lazy" */
      "@/components/Automation/creds.json"
    )
  ).default;

  for (const node of nodes) {
    const parameters = node.parameters as any;
    if (parameters && parameters.authentication) {
      let authType = parameters.authentication;
      authType = authTypeMapping[authType] || authType;

      if (creds[authType]) {
        authCredentials.push({
          authType: authType,
          displayName: creds[authType].displayName,
          properties: creds[authType].properties,
        });
      }
    }
  }

  return authCredentials;
}

export const nodes: INode[] = [
  {
    id: "674cdfb9-5058-4bfd-b9e8-71020cab29b2",
    name: "Respond to Webhook",
    type: "n8n-nodes-base.respondToWebhook",
    position: [1240, 280],
    parameters: {
      authentication: "basicAuth",
    },
    typeVersion: 1,
    webhookId: "sss",
  },
];
