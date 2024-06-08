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
  "n8n-nodes-base.whatsApp": {
    parameters: {
      operation: "send",
      phoneNumberId: "",
      recipientPhoneNumber: "",
      textBody: "={{ $json.content }}",
      additionalFields: {},
    },
    id: "c2c7ccac-1745-4430-b6cc-811e31d5b616",
    name: "WhatsApp",
    type: "n8n-nodes-base.whatsApp",
    typeVersion: 1,
    position: [1140, 460] as [number, number],
  },
  "n8n-nodes-base.telegram": {
    parameters: {
      chatId: "",
      text: "={{ $json.content }}",
      additionalFields: {},
    },
    id: "9bc467d2-7227-41f6-aa0b-917fd5a7aa1d",
    name: "Telegram",
    type: "n8n-nodes-base.telegram",
    typeVersion: 1.1,
    position: [940, 540] as [number, number],
  },
};

export const RESPOND_TO_WEBHOOK_NODE_TYPE = "n8n-nodes-base.respondToWebhook";
export const PROMPTIFY_NODE_TYPE = "n8n-nodes-promptify.promptify";

export const FREQUENCY_ITEMS = ["daily", "weekly", "bi-weekly", "monthly"];
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const datetimeOps = Intl.DateTimeFormat().resolvedOptions();
const utcOffset = new Intl.DateTimeFormat(datetimeOps.locale, {
  hour: "numeric",
  timeZone: datetimeOps.timeZone,
  timeZoneName: "short",
})
  .format(new Date())
  .split(" ")
  .pop();
export const TIMES = [
  `12:00 AM - ${utcOffset}`,
  `1:00 AM - ${utcOffset}`,
  `2:00 AM - ${utcOffset}`,
  `3:00 AM - ${utcOffset}`,
  `4:00 AM - ${utcOffset}`,
  `5:00 AM - ${utcOffset}`,
  `6:00 AM - ${utcOffset}`,
  `7:00 AM - ${utcOffset}`,
  `8:00 AM - ${utcOffset}`,
  `9:00 AM - ${utcOffset}`,
  `10:00 AM - ${utcOffset}`,
  `11:00 AM - ${utcOffset}`,
  `12:00 PM - ${utcOffset}`,
  `1:00 PM - ${utcOffset}`,
  `2:00 PM - ${utcOffset}`,
  `3:00 PM - ${utcOffset}`,
  `4:00 PM - ${utcOffset}`,
  `5:00 PM - ${utcOffset}`,
  `6:00 PM - ${utcOffset}`,
  `7:00 PM - ${utcOffset}`,
  `8:00 PM - ${utcOffset}`,
  `9:00 PM - ${utcOffset}`,
  `10:00 PM - ${utcOffset}`,
  `11:00 PM - ${utcOffset}`,
];

export const BtnStyle = {
  bgcolor: "#6E45E9",
  color: "common.white",
  fontSize: 13,
  fontWeight: 500,
  p: "6px 24px",
  ":hover": {
    bgcolor: "#5632c2",
    color: "common.white",
  },
  ":disabled": {
    borderColor: "transparent",
  },
};

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
