import { ApiIcon } from "@/assets/icons";
import { ResPrompt } from "@/core/api/dto/prompts";
import { Templates } from "@/core/api/dto/templates";
import { Box, Button, SelectChangeEvent, Typography } from "@mui/material";
import HTTPSnippet from "httpsnippet";
import React, { useEffect, useState } from "react";
import BoltIcon from "@mui/icons-material/Bolt";
import ApiAccessModal from "../modals/ApiAccessModal";

interface Props {
  isConnected?: boolean;
  lastAccess?: string;
  totalRuns?: number;
  executionData: ResPrompt[];
  templateData: Templates;
  token: string;
}

export const ApiAccess: React.FC<Props> = ({
  isConnected = true,
  lastAccess = "2 hours ago",
  totalRuns = 246,
  executionData,
  templateData,
  token,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState("0");
  const [output, setOutput] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const snippet = new HTTPSnippet({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${templateData.id}/execute/`,
    headers: [
      { name: "Authorization", value: `Token ${token}` },
      { name: "Accept", value: "application/json" },
      { name: "Content-Type", value: "application/json" },
    ],
    postData: { text: JSON.stringify(executionData) },
  });

  const options = { indent: "\t" };

  useEffect(() => {
    switch (language) {
      case "0":
        setOutput(snippet.convert("shell", "curl", options));
        break;
      case "1":
        setOutput(snippet.convert("php", "curl", options));
        break;
      case "2":
        setOutput(snippet.convert("python", "python3", options));
        break;
      case "3":
        setOutput(snippet.convert("python", "requests", options));
        break;
      case "4":
        setOutput(snippet.convert("javascript", "fetch", options));
        break;
      default:
    }
  }, [language]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      p={"16px 8px 16px 16px"}
      gap="10px"
    >
      <Typography
        color="primary"
        fontSize={12}
      >
        API ACCESS
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
      >
        <Typography>Key Status:</Typography>
        {isConnected ? (
          <Box display="flex">
            <BoltIcon
              fontSize="small"
              sx={{
                color: "blue",
              }}
            />
            <Typography>Connected</Typography>
          </Box>
        ) : (
          <Box display="flex">
            <BoltIcon
              fontSize="small"
              sx={{
                color: "red",
              }}
            />
            <Typography>Disconnected</Typography>
          </Box>
        )}
      </Box>
      <Button
        variant={"contained"}
        sx={{
          flex: 1,
          p: "10px 25px",
          fontWeight: 500,
          borderColor: "primary.main",
          borderRadius: "999px",
          bgcolor: "primary.main",
          color: "onPrimary",
          whiteSpace: "pre-line",
          ":hover": {
            bgcolor: "surface.1",
            color: "primary.main",
          },
          ":disabled": {
            bgcolor: "surface.4",
            color: "onTertiary",
            borderColor: "transparent",
          },
        }}
        disabled={!isConnected}
        onClick={() => setIsModalOpen(true)}
      >
        <ApiIcon />
        <Typography
          display="flex"
          ml={2}
          color={"inherit"}
        >
          Integrate this API
        </Typography>
      </Button>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{ opacity: 0.5 }}
      >
        <Typography fontSize={12}>Last access:</Typography>
        <Typography fontSize={12}>{lastAccess}</Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{ opacity: 0.5 }}
      >
        <Typography fontSize={12}>Total Runs:</Typography>
        <Typography fontSize={12}>{totalRuns}</Typography>
      </Box>
      <ApiAccessModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        value={output}
        onChange={handleChange}
        language={language}
      />
    </Box>
  );
};
