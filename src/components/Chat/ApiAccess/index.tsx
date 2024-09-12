import React, { useEffect, useState } from "react";
const n8nApiUrl = process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL;
//
import { useAppSelector } from "@/hooks/useStore";
//
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
//
import LanguageSelect from "./LanguageSelect";
import CopyButton from "./copyButton";
import Snippet from "./snippet";

interface Input {
  name: string;
  fullName: string;
  type: string;
  required: boolean;
  parameters: {
    assignments: {
      assignments: { name: string }[];
    };
    path?: string;
  };
}

const parsed_data = (nodes: Input[]): { inputs: Record<string, string>; url?: string } => {
  const inputs = nodes
    .filter(node => node.type === "n8n-nodes-base.set")
    .reduce((acc: Record<string, string>, node: Input) => {
      node.parameters.assignments.assignments.forEach(assignment => {
        acc[assignment.name] = assignment.name;
      });
      return acc;
    }, {});

  const webhookNode = nodes.find(node => node.type === "n8n-nodes-base.webhook");
  const url = `${n8nApiUrl}/webhooks/${webhookNode?.parameters?.path ?? ""}`;

  return { inputs, url };
};

export default function ApiAccess() {
  // Store
  const chat = useAppSelector(state => state.chat?.clonedWorkflow);
  //
  const [data, setData] = useState<Record<string, string>>({});
  const [url, setUrl] = useState(`${n8nApiUrl}/webhooks/`);
  const [lang, setLang] = useState("shell");
  const [api_snippet, setApiSnippet] = useState<string>("");
  const [exicution_snippet, setExicutionSnippet] = useState<string>("");

  useEffect(() => {
    if (chat?.nodes) {
      const { url, inputs } = parsed_data(chat.nodes as Input[]);
      setData(inputs);
      setUrl(url ?? `${n8nApiUrl}/webhooks/`);
    }
  }, [chat]);

  return (
    <Stack
      spacing={2}
      sx={{ p: { xs: 2, md: 6 } }}
    >
      <Box>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={1}
          py="8px"
        >
          <Typography
            fontSize={16}
            fontWeight={500}
            color={"onSurface"}
          >
            Integrate this API
          </Typography>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={1}
          >
            <LanguageSelect
              lang={lang}
              setLang={setLang}
            />
            <CopyButton data={api_snippet} />
          </Stack>
        </Stack>
        <Snippet
          method="POST"
          lang={lang}
          url={url}
          data={data}
          onSnippetChange={setApiSnippet}
        />
      </Box>

      <Box>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={1}
          py="8px"
        >
          <Typography
            fontSize={16}
            fontWeight={500}
            color={"onSurface"}
          >
            Get an execution
          </Typography>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={{ xs: 0, md: 1 }}
          >
            <LanguageSelect
              lang={lang}
              setLang={setLang}
            />
            <CopyButton data={exicution_snippet} />
          </Stack>
        </Stack>
        <Snippet
          method="GET"
          lang={lang}
          url={`${n8nApiUrl}/api/meta/template-executions/__template_execution_id__/`}
          onSnippetChange={setExicutionSnippet}
        />
      </Box>
    </Stack>
  );
}
