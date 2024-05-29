export const PROVIDERS = {
  "n8n-nodes-base.slack": {
    parameters: {
      select: "channel",
      channelId: {
        __rl: true,
        value: "",
        mode: "name",
      },
      text: "={{ $json.content }}",
      otherOptions: {},
    },
    id: "8bdc522a-39d3-4eed-8d75-282e49ec7498",
    name: "Slack",
    type: "n8n-nodes-base.slack",
    typeVersion: 2.1,
    position: [1020, 160] as [number, number],
  },
  "n8n-nodes-base.gmail": {
    parameters: {
      sendTo: "",
      subject: "",
      message: "={{ $json.content }}",
      options: {},
    },
    id: "a6671b2a-0447-4c27-ad18-a31c146695e9",
    name: "Gmail",
    type: "n8n-nodes-base.gmail",
    typeVersion: 2.1,
    position: [1020, 460] as [number, number],
  },
};
