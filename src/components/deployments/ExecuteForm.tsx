import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import BaseButton from "../base/BaseButton";
import { CreateDeployment, Deployment } from "@/common/types/deployments";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useToken from "@/hooks/useToken";
import { Box, FormControl, Input, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { parseMessageData } from "@/common/helpers/parseMessageData";
import { sanitizeHTML } from "@/common/helpers/htmlHelper";
interface ExecuteFormProps {
  onClose: () => void;
  item: Deployment;
}

function ExecuteForm({ onClose, item }: ExecuteFormProps) {
  const token = useToken();

  const [inputValue, setInputValue] = useState("");
  const [executionContent, setExecutionContent] = useState<string[]>([]);
  const [processedMessages, setProcessedMessages] = useState<string[]>([]);

  useEffect(() => {
    // If there's any processing or sorting needed, do it here
    const processed = executionContent.map(message => {
      // Process each message if needed, for now, we'll just pass it through
      return message;
    });

    // Set the processed messages
    setProcessedMessages(processed);
  }, [executionContent]);

  const handleExecute = () => {
    const { instance, model, id } = item;

    const payload = {
      instance: instance.id,
      model: model.id,
      inputs: inputValue,
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
      async onopen(res) {
        if (res.ok && res.status === 200) {
          console.log("worked");
        } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error("Client side error ", res);
        }
      },
      onmessage(msg) {
        try {
          const parseData = parseMessageData(msg.data);
          const message = parseData.message;
          if (message === "[CONNECTED]") {
            return;
          }
          if (message) {
            setExecutionContent(prevState => [...prevState, message]);
          }
          console.log(message);
        } catch (error) {
          console.error("Error parsing message data", error);
        }
      },
      onerror(err) {
        console.log(err, "something went wrong");
      },
    });
  };
  return (
    <Stack
      direction={"column"}
      gap={"12px"}
      pt={1}
    >
      <FormControl>
        <InputLabel>Type something</InputLabel>
        <Input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </FormControl>
      <Stack
        minWidth={{ md: "800px" }}
        direction={"row"}
        flexWrap={"wrap"}
        gap={1}
      >
        {processedMessages.map((message, index) => (
          <Box
            key={index}
            display={"flex"}
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
            }}
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(message),
            }}
          />
        ))}
      </Stack>
      <Stack
        mt={4}
        direction={"row"}
        justifyContent={"end"}
      >
        <Button onClick={onClose}>{true ? "Close" : "Cancel"}</Button>
        <BaseButton
          type="submit"
          variant={"contained"}
          onClick={() => handleExecute()}
          color={"primary"}
          disabled={inputValue === ""}
          sx={{
            p: "6px 16px",
            borderRadius: "8px",
            ":disabled": {
              border: "none",
            },
            ":hover": {
              bgcolor: "primary",
            },
          }}
          autoFocus
        >
          <span>Execute</span>
        </BaseButton>
      </Stack>
    </Stack>
  );
}

export default ExecuteForm;
