import type {
  ICredential,
  INodeCredentials,
  INode,
  NodesFileData,
  ICredentialJson,
} from "@/components/Automation/types";

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
  const filteredTypes = Array.from(
    new Set(types.map(type => (nodesData as NodesFileData)[type]?.name).filter(name => name)),
  );

  return filteredTypes.slice(0, slice);
}

export const authTypeMapping: { [key: string]: string } = {
  basicAuth: "httpBasicAuth",
  // Add other mappings here if necessary
};

export async function extractCredentialsData(nodes: INode[] = []): Promise<ICredential[]> {
  const credentials: ICredential[] = [];
  const creds = (
    await import(
      /* webpackChunkName: "workflow_creds" */
      /* webpackMode: "lazy" */
      "@/components/Automation/creds.json"
    )
  ).default as unknown as ICredentialJson;

  for (const node of nodes) {
    const parameters = node.parameters;
    if (parameters && parameters.authentication) {
      const authenticationType = parameters.authentication;
      const nodeCredentialType = parameters.nodeCredentialType;
      const authType =
        authTypeMapping[nodeCredentialType!] ||
        nodeCredentialType ||
        authTypeMapping[authenticationType] ||
        authenticationType;

      if (creds[authType]) {
        credentials.push({
          name: authType,
          displayName: creds[authType].displayName,
          properties: creds[authType].properties,
        });
      }
    }
  }

  return credentials;
}

export const attachCredentialsToNode = (node: INode, credentials: INodeCredentials) => {
  const { parameters } = node;

  if (parameters && parameters.authentication) {
    const authenticationType = parameters.authentication;
    const nodeCredentialType = parameters.nodeCredentialType;

    const authType =
      authTypeMapping[nodeCredentialType!] ||
      nodeCredentialType ||
      authTypeMapping[authenticationType] ||
      authenticationType;

    if (credentials[authType]) {
      const { id, name } = credentials[authType];
      node.credentials = { [authType]: { id, name } };
    }
  }
};

export const extractWebhookPath = (nodes: INode[]) => {
  const webhookNode = nodes.find(node => node.type === "n8n-nodes-base.webhook");
  return webhookNode?.parameters?.path;
};
