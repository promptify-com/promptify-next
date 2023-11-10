import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import BaseButton from "../base/BaseButton";
import { Deployment } from "@/common/types/deployments";
import useToken from "@/hooks/useToken";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import MessageSender from "@/components/prompt/generate/MessageSender";
import ParagraphPlaceholder from "@/components/placeholders/ParagraphPlaceholder";

interface ExecuteFormProps {
  onClose: () => void;
  item: Deployment;
}

function ExecuteForm({ onClose, item }: ExecuteFormProps) {
  const token = useToken();
  const [executionContent, setExecutionContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!executionContent) {
      return;
    }

    const generateFinalHtml = async () => {
      const _html = await markdownToHTML(executionContent);
      setHtml(_html);
    };

    generateFinalHtml();
  }, [executionContent]);

  const handleExecute = (value: string) => {
    setIsGenerating(true);
    setExecutionContent("");
    setHtml("");

    const { instance, model, id } = item;
    const payload = {
      instance: instance.id,
      model: model.id,
      inputs: value,
    };
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/aithos/deployments/${id}/execute/`;
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
        {html && (
          <Box
            display={"block"}
            sx={{
              fontSize: 15,
              fontWeight: 400,
              color: "onSurface",
              wordWrap: "break-word",
              textAlign: "justify",
              float: "none",
              ".highlight": {
                backgroundColor: "yellow",
                color: "black",
              },
              pre: {
                m: "10px 0",
                borderRadius: "8px",
                overflow: "hidden",
                code: {
                  borderRadius: 0,
                  m: 0,
                },
              },
              code: {
                display: "block",
                bgcolor: "#282a35",
                color: "common.white",
                borderRadius: "8px",
                p: "16px 24px",
                mb: "10px",
                overflow: "auto",
              },
              ".language-label": {
                p: "8px 24px",
                bgcolor: "#4d5562",
                color: "#ffffff",
                fontSize: 13,
              },
              "& h2": {
                margin: 0,
              },
            }}
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(html),
            }}
          />
        )}
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
