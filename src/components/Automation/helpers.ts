import Storage from "@/common/storage";
import type {
  INode,
  NodesFileData,
  ICredentialJson,
  ICredentialInput,
  ICredential,
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

export async function extractCredentialsInput(nodes: INode[] = []): Promise<ICredentialInput[]> {
  const credentialsInput: ICredentialInput[] = [];
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
        credentialsInput.push({
          name: authType,
          displayName: creds[authType].displayName,
          properties: creds[authType].properties,
        });
      }
    }
  }

  return credentialsInput;
}

export const attachCredentialsToNode = (node: INode) => {
  if (node.type === "n8n-nodes-promptify.promptify") {
    return;
  }
  const { parameters } = node;

  if (parameters && parameters.authentication) {
    const authenticationType = parameters.authentication;
    const nodeCredentialType = parameters.nodeCredentialType;

    const authType =
      authTypeMapping[nodeCredentialType!] ||
      nodeCredentialType ||
      authTypeMapping[authenticationType] ||
      authenticationType;

    const currentCredentials: ICredential[] = Storage.get("credentials") || [];

    const credential = currentCredentials.find(cred => cred.type === authType);

    if (credential) {
      const { type, id, name } = credential;
      const updatedNode = {
        ...node,
        credentials: {
          ...(node.credentials || {}),
          [type]: { id, name },
        },
      };

      return updatedNode;
    }
  }

  return node;
};

export const extractWebhookPath = (nodes: INode[]) => {
  const webhookNode = nodes.find(node => node.type === "n8n-nodes-base.webhook");
  return webhookNode?.parameters?.path;
};
