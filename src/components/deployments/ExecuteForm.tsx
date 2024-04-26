import { useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import BaseButton from "../base/BaseButton";
import useToken from "@/hooks/useToken";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import MessageSender from "@/components/Prompt/Common/Chat/MessageSender";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";
import { ExecutionContent } from "@/components/common/ExecutionContent";

interface ExecuteFormProps {
  onClose: () => void;
  deploymentId: number;
}

function ExecuteForm({ onClose, deploymentId }: ExecuteFormProps) {
  const token = useToken();
  const [executionContent, setExecutionContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [html, setHtml] = useState("");
  const executionRefElm = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!executionContent) {
      return;
    }

    const generateFinalHtml = async () => {
      const _html = await markdownToHTML(executionContent);
      setHtml(_html);

      if (executionRefElm.current) {
        executionRefElm.current.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    };

    generateFinalHtml();
  }, [executionContent]);

  const handleExecute = (value: string) => {
    setIsGenerating(true);
    setExecutionContent("");
    setHtml("");

    const payload = {
      inputs: value,
    };
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/aithos/deployments/${deploymentId}/execute/`;
    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      openWhenHidden: true,
      async onopen(res) {
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error("Client side error ", res);
        }
      },
      onmessage(msg) {
        try {
          const parseData = parseMessageData(msg.data);
          const message = parseData.message;

          if (message === "[CONNECTED]" || message === "[COMPLETED]") {
            return;
          }

          if (message) {
            setExecutionContent(prevMessage => prevMessage + message);
          }
        } catch (error) {
          console.error("Error parsing message data", error);
        }
      },
      onerror(err) {
        setIsGenerating(false);
        console.log(err, "something went wrong");
      },
      onclose() {
        setIsGenerating(false);
      },
    });
  };

  return (
    <Stack
      direction={"column"}
      gap={"12px"}
      pt={1}
    >
      <Stack
        width={{ md: "600px" }}
        direction={"row"}
        alignItems={"start"}
        justifyContent={"start"}
        sx={{
          overflowY: "auto",
        }}
        flexWrap={"wrap"}
        maxHeight={"50vh"}
        gap={1}
      >
        {isGenerating && !html.length && (
          <Grid width={"100%"}>
            <ParagraphPlaceholder />
          </Grid>
        )}
        {html && <ExecutionContent content={sanitizeHTML(html)} />}
      </Stack>
      <Stack flex={1}>
        <MessageSender
          placeholder="Type something"
          disabled={isGenerating}
          onSubmit={handleExecute}
        />
      </Stack>

      <Stack
        direction={"row"}
        justifyContent={"end"}
        alignItems={"center"}
        gap={1}
      >
        <BaseButton
          variant="contained"
          color="primary"
          onClick={onClose}
        >
          {true ? "Close" : "Cancel"}
        </BaseButton>
      </Stack>
    </Stack>
  );
}

export default ExecuteForm;
