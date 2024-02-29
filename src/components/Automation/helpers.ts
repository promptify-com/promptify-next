import Storage from "@/common/storage";
import type {
  INode,
  NodesFileData,
  ICredentialJson,
  ICredentialInput,
  ICredential,
} from "@/components/Automation/types";

export const N8N_RESPONSE_REGEX = /#([^<]+)<PROMPT_EXECUTION_(\d+|\w*)>?/g;

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

export const oAuthTypeMapping: { [key: string]: string } = {
  "n8n-nodes-base.googleCalendar": "googleCalendarOAuth2Api",
  "n8n-nodes-base.gmail": "gmailOAuth2",
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
    if (node.credentials) {
      continue;
    }

    if (oAuthTypeMapping[node.type!]) {
      const authType = oAuthTypeMapping[node.type!];
      if (authType && creds[authType]) {
        const properties = [
          {
            displayName: "Client ID",
            name: "clientId",
            type: "string",
            default: "",
          },
          {
            displayName: "Client Secret",
            name: "clientSecret",
            type: "string",
            typeOptions: {
              password: true,
            },
            default: "",
          },
        ];
        credentialsInput.push({
          name: authType,
          displayName: creds[authType].displayName,
          properties,
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
  const { parameters, type } = node;

  if ((parameters && parameters.authentication) || oAuthTypeMapping[type]) {
    const authenticationType = parameters.authentication;
    const nodeCredentialType = parameters.nodeCredentialType;

    const authType =
      authTypeMapping[nodeCredentialType!] ||
      nodeCredentialType ||
      authTypeMapping[authenticationType!] ||
      authenticationType;

    const currentCredentials: ICredential[] = Storage.get("credentials") || [];

    const credential = oAuthTypeMapping[type]
      ? currentCredentials.find(cred => cred.type.includes("OAuth2"))
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
