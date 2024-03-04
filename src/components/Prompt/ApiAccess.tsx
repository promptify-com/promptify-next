import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import { ExpandMore } from "@mui/icons-material";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import HTTPSnippet from "httpsnippet";
import { Templates } from "@/core/api/dto/templates";
import { RootState } from "@/core/store";
import { useSelector } from "react-redux";
import useToken from "@/hooks/useToken";

interface Props {
  template: Templates;
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
  customStyle: {
    borderRadius: "16px",
    background: "black",
    color: "white",
    margin: 0,
    padding: "16px 16px 16px 24px",
    ".linenumber": {
      minWidth: "auto",
    },
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
  <Stack
    direction={"row"}
    alignItems="center"
  >
    <FormControl sx={{ m: 1 }}>
      <Select
        value={language}
        onChange={handleChange}
        IconComponent={() => <ExpandMore />}
        sx={{
          fontSize: 14,
          fontWeight: 500,
          ".MuiSelect-select": {
            pr: "4px !important",
          },
          fieldset: {
            border: "none",
          },
        }}
      >
        <MenuItem value={"0"}>cUrl</MenuItem>
        <MenuItem value={"1"}>PHP - cUrl</MenuItem>
        <MenuItem value={"2"}>Python - http.client</MenuItem>
        <MenuItem value={"3"}>Python - Requests</MenuItem>
        <MenuItem value={"4"}>JavaScript - Fetch</MenuItem>
      </Select>
    </FormControl>
    <Button
      sx={{
        color: "onSurface",
      }}
      onClick={onClick}
      disabled={status === "success"}
    >
      {status === "success" ? "Copied" : "Copy"}
    </Button>
  </Stack>
);

export default function ApiAccess({ template }: Props) {
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
    setSnippet(
      new HTTPSnippet({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${template.id}/execute/?streaming=false`,
        headers: [
          { name: "Authorization", value: `Token ${token}` },
          { name: "Accept", value: "application/json" },
          { name: "Content-Type", value: "application/json" },
        ],
        postData: { text: executionData },
      }),
    );
  }, [template, executionData]);

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

  return (
    <Stack
      gap={2}
      p={"48px"}
    >
      <Typography
        fontSize={32}
        fontWeight={400}
        color={"onSurface"}
        py={"16px"}
      >
        Access with API:
      </Typography>
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
            Integrate this API
          </Typography>
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
        </Stack>
        <SyntaxHighlighter {...snippetProps}>{output[0]}</SyntaxHighlighter>
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
            Response Format
          </Typography>
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
        </Stack>
        <SyntaxHighlighter
          {...snippetProps}
          showLineNumbers={false}
        >{`{\n   "template_execution_id": number,   \n}`}</SyntaxHighlighter>
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
        </Stack>
        <SyntaxHighlighter {...snippetProps}>{output[1]}</SyntaxHighlighter>
      </Box>
    </Stack>
  );
}
