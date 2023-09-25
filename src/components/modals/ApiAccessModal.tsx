import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import vs2015 from "react-syntax-highlighter/dist/cjs/styles/hljs/vs2015";
import { Settings, KeyboardReturn } from "@mui/icons-material";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import HTTPSnippet from "httpsnippet";
import { Templates } from "@/core/api/dto/templates";
import { RootState } from "@/core/store";
import { useSelector } from "react-redux";
import useToken from "@/hooks/useToken";
import { ResPrompt } from "@/core/api/dto/prompts";

interface Props {
  onClose: () => void;
  templateData: Templates;
}

SyntaxHighlighter.registerLanguage("javascript", js);

const getExecutionSnippet = (token: string) =>
  new HTTPSnippet({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/meta/template-executions/__template_execution_id__/`,
    headers: [
      { name: "Authorization", value: `Token ${token}` },
      { name: "Accept", value: "application/json" },
      { name: "Content-Type", value: "application/json" },
    ],
  });
const snippetProps = {
  language: "javascript",
  style: vs2015,
  customStyle: {
    borderRadius: "10px",
  },
  showLineNumbers: true,
  wrapLongLines: true,
};

const LanguageSelectorAndCopy = ({
  language,
  handleChange,
  status,
  onClick,
}: {
  language: string;
  handleChange: (event: SelectChangeEvent) => void;
  status: string;
  onClick: () => void;
}) => (
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
      variant={status === "success" ? "outlined" : "contained"}
      sx={{
        borderRadius: "5px",
      }}
      onClick={onClick}
      disabled={status === "success"}
    >
      {status === "success" ? "Copied" : "Copy"}
    </Button>
  </Box>
);

export default function ApiAccessModal({ onClose, templateData }: Props) {
  const [snippet, setSnippet] = useState<any | null>(null);
  const [output, setOutput] = useState<any[]>([]);
  const [language, setLanguage] = useState("0");
  const [copy, result] = useCopyToClipboard();
  const token = useToken();
  const executionData = useSelector((state: RootState) => state.template.executionData);

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    let parseExecutionData = executionData;

    try {
      parseExecutionData = JSON.stringify(
        (JSON.parse(executionData) as ResPrompt[]).filter(
          prompt => !!prompt.contextual_overrides.length || !!Object.keys(prompt.prompt_params).length,
        ),
      );
    } catch (_) {}

    setSnippet(
      new HTTPSnippet({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${templateData.id}/execute/?streaming=false`,
        headers: [
          { name: "Authorization", value: `Token ${token}` },
          { name: "Accept", value: "application/json" },
          { name: "Content-Type", value: "application/json" },
        ],
        postData: { text: executionData },
      }),
    );
  }, [templateData, executionData]);

  useEffect(() => {
    const options = { indent: "\t" };

    if (snippet) {
      const snipperGETCode = getExecutionSnippet(token);

      switch (language) {
        case "0":
          setOutput([snippet.convert("shell", "curl", options), snipperGETCode.convert("shell", "curl", options)]);
          break;
        case "1":
          setOutput([snippet.convert("php", "curl", options), snipperGETCode.convert("php", "curl", options)]);
          break;
        case "2":
          setOutput([
            snippet.convert("python", "python3", options),
            snipperGETCode.convert("python", "python3", options),
          ]);
          break;
        case "3":
          setOutput([
            snippet.convert("python", "requests", options),
            snipperGETCode.convert("python", "requests", options),
          ]);
          break;
        case "4":
          setOutput([
            snippet.convert("javascript", "fetch", options),
            snipperGETCode.convert("javascript", "fetch", options),
          ]);
          break;
        default:
      }
    }
  }, [language, snippet]);

  const responseExample = `
{
  "template_execution_id": number,
}
    `;

  return (
    <Modal
      open
      onClose={onClose}
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
            <LanguageSelectorAndCopy
              language={language}
              handleChange={handleChange}
              status={result?.state ?? ""}
              onClick={() => {
                copy(
                  `POST an execution:\n\`\`\`sh\n${output[0]}\n\`\`\`\n\nGET an execution:\n\`\`\`sh\n${output[1]}\n\`\`\`\``,
                );
              }}
            />
          </Box>

          <SyntaxHighlighter {...snippetProps}>{output[0]}</SyntaxHighlighter>
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
        <Box
          p="20px"
          bgcolor="#f2f5f9"
          mt={{ xs: "20px", md: "40px" }}
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
                Get an execution
              </Typography>
            </Box>
            <LanguageSelectorAndCopy
              language={language}
              handleChange={handleChange}
              status={result?.state ?? ""}
              onClick={() => {
                copy(
                  `POST an execution:\n\`\`\`sh\n${output[0]}\n\`\`\`\n\nGET an execution:\n\`\`\`sh\n${output[1]}\n\`\`\`\``,
                );
              }}
            />
          </Box>

          <SyntaxHighlighter {...snippetProps}>{output[1]}</SyntaxHighlighter>
        </Box>
      </Box>
    </Modal>
  );
}
