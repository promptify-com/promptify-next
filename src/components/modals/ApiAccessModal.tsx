import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import vs2015 from "react-syntax-highlighter/dist/cjs/styles/hljs/vs2015";
import { Settings, KeyboardReturn } from "@mui/icons-material";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import HTTPSnippet from "httpsnippet";
import { ResPrompt } from "@/core/api/dto/prompts";
import { Templates } from "@/core/api/dto/templates";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  executionData: ResPrompt[];
  templateData: Templates;
  token: string;
}

SyntaxHighlighter.registerLanguage("javascript", js);

export default function ApiAccessModal({ open, setOpen, executionData, templateData, token }: Props) {
  const [snippet, setSnippet] = useState<any | null>(null);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("0");

  const [copy, result] = useCopyToClipboard();

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    setSnippet(
      new HTTPSnippet({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${templateData.id}/execute/`,
        headers: [
          { name: "Authorization", value: `Token ${token}` },
          { name: "Accept", value: "application/json" },
          { name: "Content-Type", value: "application/json" },
        ],
        postData: { text: JSON.stringify(executionData) },
      }),
    );
  }, [templateData, executionData]);

  useEffect(() => {
    const options = { indent: "\t" };

    if (snippet) {
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
    }
  }, [language, snippet]);

  const responseExample = `
{
  response: text // 
  completed: boolean // Is the response completed  
}
    `;

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          maxHeight: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, md: 4 },
          overflow: "auto",
        }}
      >
        <Box
          p="20px"
          bgcolor="#f2f5f9"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box
              display="flex"
              alignItems="center"
            >
              <Settings />
              <Typography
                ml="1rem"
                fontSize={18}
              >
                Integrate this API
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
            >
              <FormControl sx={{ m: 1 }}>
                <Select
                  value={language}
                  onChange={handleChange}
                  sx={{ height: "40px", fontSize: "14px" }}
                >
                  <MenuItem value={"0"}>cUrl</MenuItem>
                  <MenuItem value={"1"}>PHP - cUrl</MenuItem>
                  <MenuItem value={"2"}>Python - http.client</MenuItem>
                  <MenuItem value={"3"}>Python - Requests</MenuItem>
                  <MenuItem value={"4"}>JavaScript - Fetch</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant={result?.state === "success" ? "outlined" : "contained"}
                sx={{
                  borderRadius: "5px",
                }}
                onClick={() => {
                  copy(output);
                }}
                disabled={result?.state === "success"}
              >
                {result?.state === "success" ? "Copied" : "Copy"}
              </Button>
            </Box>
          </Box>

          <SyntaxHighlighter
            language="javascript"
            style={vs2015}
            customStyle={{
              borderRadius: "10px",
            }}
            showLineNumbers
            wrapLongLines
          >
            {output}
          </SyntaxHighlighter>
        </Box>
        <Box
          p="20px"
          bgcolor="#f2f5f9"
          mt={{ xs: "20px", md: "40px" }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <KeyboardReturn />
            <Typography
              ml="1rem"
              fontSize={18}
            >
              Response Format
            </Typography>
          </Box>

          <SyntaxHighlighter
            language="javascript"
            style={vs2015}
            customStyle={{ borderRadius: "10px" }}
          >
            {responseExample}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Modal>
  );
}
