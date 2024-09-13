import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";
import LanguageSelect from "./LanguageSelect";
import CopyButton from "./copyButton";
import Snippet from "./snippet";
import { initialState } from "@/core/store/chatSlice";
import { extractWebhookPath } from "@/components/Automation/helpers";

export default function ApiAccess() {
  const n8nApiUrl = process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL;
  const { clonedWorkflow, inputs } = useAppSelector(state => state.chat ?? initialState);
  const [data, setData] = useState<Record<string, string>>({});
  const [url, setUrl] = useState(`${n8nApiUrl}/workflow`);
  const [lang, setLang] = useState("shell");
  const [api_snippet, setApiSnippet] = useState<string>("");
  // const [exicution_snippet, setExicutionSnippet] = useState<string>("");

  useEffect(() => {
    const prepareData = async () => {
      if (clonedWorkflow?.nodes) {
        const inputsData: Record<string, string> = {};
        const webhookPath = await extractWebhookPath(clonedWorkflow.nodes);
        const url = `${n8nApiUrl}/webhooks/${webhookPath ?? ""}`;
        inputs.forEach(input => {
          inputsData[input.name] = "[put_your_input_here]";
        });
        setData(inputsData);
        setUrl(url);
      }
    };
    prepareData();
  }, [clonedWorkflow]);

  return (
    <Stack spacing={2}>
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

      {/* <Box>
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
      </Box> */}
    </Stack>
  );
}
