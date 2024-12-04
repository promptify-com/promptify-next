import Storage from "@/common/storage";
import type { ICredentialJson } from "@/components/Automation/app/credentials/types";
import type {
  ICredential,
  ICredentialInput,
  INode,
  INodeCredentials,
  NodesFileData,
} from "@/components/Automation/types";

export interface IProviderNode {
  nodeParametersCB: (content: string) => Record<string, string | number | INodeCredentials>;
  node: INode;
}

export const cleanCredentialName = (name: string) => name.replace(/Api\s*|Oauth2\s*/gi, "").trim();

export const RESPOND_TO_WEBHOOK_NODE_TYPE = "n8n-nodes-base.respondToWebhook";

export const MARKDOWN_NODE_NAME = "_markdown__$providers$__message_";

export const N8N_RESPONSE_REGEX = /#([^<]+)<PROMPT_EXECUTION_(\d+|\w*)>?/g;

const UNWANTED_TYPES = [
  "n8n-nodes-base.switch",
  "n8n-nodes-base.set",
  "merge",
  "n8n-nodes-base.manualTrigger",
  "n8n-nodes-base.respondToWebhook",
  "n8n-nodes-base.code",
];

export function getCurrentDate() {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);

  return `${day}/${month}/${year}`; // Output: 20/10/24 (for example)
}

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
  ).default as unknown as NodesFileData;
  const filteredTypes = Array.from(new Set(types.map(type => nodesData[type]?.name).filter(name => name)));

  return filteredTypes.slice(0, slice);
}

export const authTypeMapping: { [key: string]: string } = {
  basicAuth: "httpBasicAuth",
  // Add other mappings here if necessary
};
export const oAuthTypeMapping: { [key: string]: string } = {
  "n8n-nodes-base.googleCalendar": "googleCalendarOAuth2Api",
  "n8n-nodes-base.gmail": "gmailOAuth2",
};
export const apiAuthTypeMapping: { [key: string]: string } = {
  "n8n-nodes-base.slack": "slackApi",
  "n8n-nodes-base.whatsApp": "whatsAppApi",
  "n8n-nodes-base.telegram": "telegramApi",
};

export async function extractCredentialsInput(nodes: INode[] = []): Promise<ICredentialInput[]> {
  const filteredNodes = nodes.filter(node => !node.name.toLowerCase().includes("provider"));

  const credentialsInput: ICredentialInput[] = [];
  const creds = (
    await import(
      /* webpackChunkName: "workflow_creds" */
      /* webpackMode: "lazy" */
      "@/components/Automation/creds.json"
    )
  ).default as unknown as ICredentialJson;

  const nodesData = (
    await import(
      /* webpackChunkName: "workflow_nodes" */
      /* webpackMode: "lazy" */
      "@/components/Automation/nodes.json"
    )
  ).default as unknown as NodesFileData;

  for (const node of filteredNodes) {
    const iconUrl = nodesData[node.type]?.iconUrl;

    if (oAuthTypeMapping[node.type]) {
      const authType = oAuthTypeMapping[node.type];

      if (authType && creds[authType]) {
        credentialsInput.push({
          name: authType,
          displayName: creds[authType].displayName,
          properties: [],
          iconUrl,
        });
      }
      continue;
    }
    if (apiAuthTypeMapping[node.type]) {
      const authType = apiAuthTypeMapping[node.type];

      if (authType && creds[authType]) {
        const properties = creds[authType].properties;

        credentialsInput.push({
          name: authType,
          displayName: creds[authType].displayName,
          properties,
          iconUrl,
        });
      }
      continue;
    }

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
          iconUrl,
        });
      }
    }
  }

  const credentialsSet = new Set<string>();
  return credentialsInput.filter(credentials => {
    const seen = credentialsSet.has(credentials.name);
    credentialsSet.add(credentials.name);

    return !seen;
  });
}

export const attachCredentialsToNode = (node: INode) => {
  if (node.type === "n8n-nodes-promptify.promptify") {
    return;
  }
  const { parameters, type } = node;

  if ((parameters && parameters.authentication) || oAuthTypeMapping[type]) {
    const authenticationType = parameters.authentication;
    const nodeCredentialType = parameters.nodeCredentialType;

    const authType =
      authTypeMapping[nodeCredentialType!] ||
      nodeCredentialType ||
      authTypeMapping[authenticationType!] ||
      authenticationType;

    const currentCredentials: ICredential[] = (Storage.get("credentials") as unknown as ICredential[]) || [];

    const credential = oAuthTypeMapping[type]
      ? currentCredentials.find(cred => cred.type === oAuthTypeMapping[type])
      : currentCredentials.find(cred => cred.type === authType);

    if (credential) {
      const { type, id, name } = credential;

      if (!node.credentials) {
        node.credentials = {};
      }
      node.credentials[type] = { id, name };
    }
  }

  return node;
};

export const extractWebhookPath = (nodes: INode[]) => {
  const webhookNode = nodes.find(node => node.type === "n8n-nodes-base.webhook");
  return webhookNode?.parameters?.path;
};
