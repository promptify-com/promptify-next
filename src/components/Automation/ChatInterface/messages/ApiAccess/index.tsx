import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";

import { initialState } from "@/core/store/chatSlice";
import { extractWebhookPath } from "@/components/Automation/helpers";
import CopyButton from "@/components/Automation/ChatInterface/messages/ApiAccess/CopyButton";
import LanguageSelect from "@/components/Automation/ChatInterface/messages/ApiAccess/LanguageSelect";
import Snippet from "@/components/Automation/ChatInterface/messages/ApiAccess/Snippet";

export default function ApiAccess() {
  const n8nApiUrl = process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL;
  const { selectedApp, inputs } = useAppSelector(state => state.chat ?? initialState);
  const [data, setData] = useState<Record<string, string>>({});
  const [url, setUrl] = useState(`${n8nApiUrl}/workflow`);
  const [lang, setLang] = useState("shell");
  const [api_snippet, setApiSnippet] = useState<string>("");

  useEffect(() => {
    const prepareData = async () => {
      if (selectedApp?.nodes) {
        const inputsData: Record<string, string> = {};
        const webhookPath = await extractWebhookPath(selectedApp.nodes);
        const url = `${n8nApiUrl}/webhook/${webhookPath ?? ""}`;
        inputs.forEach(input => {
          inputsData[input.name] = "[put_your_input_here]";
        });
        setData(inputsData);
        setUrl(url);
      }
    };
    prepareData();
  }, [selectedApp]);

  return (
    <Stack
      spacing={2}
      maxWidth={"700px"}
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
    </Stack>
  );
}
