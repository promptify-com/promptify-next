import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import HTTPSnippet from "httpsnippet";
import { Templates } from "@/core/api/dto/templates";

import useToken from "@/hooks/useToken";
import useApiAccess from "./Hooks/useApiAccess";

interface Props {
  template: Templates;
}

SyntaxHighlighter.registerLanguage("javascript", js);

const getExecutionSnippet = (token: string | null) =>
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
    background: "#1B1B1F", //onSurface
    color: "white",
    margin: 0,
    padding: "16px 16px 16px 24px",
    overflow: "auto",
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
  noSelect,
  isActive,
}: {
  language: string;
  handleChange: (event: SelectChangeEvent) => void;
  status: string;
  onClick: () => void;
  noSelect?: boolean;
  isActive: boolean;
}) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    gap={{ xs: 0, md: 1 }}
  >
    {!noSelect && (
      <Select
        value={language}
        onChange={handleChange}
        inputProps={{ MenuProps: { disableScrollLock: true } }}
        sx={{
          fontSize: 14,
          fontWeight: 500,
          borderRadius: "999px",
          p: "8px 16px",
          fieldset: {
            border: "none",
            p: 0,
          },
          ".MuiSelect-select": {
            p: 0,
            pr: "16px !important",
          },
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <MenuItem value={"0"}>cUrl</MenuItem>
        <MenuItem value={"1"}>PHP - cUrl</MenuItem>
        <MenuItem value={"2"}>Python - http.client</MenuItem>
        <MenuItem value={"3"}>Python - Requests</MenuItem>
        <MenuItem value={"4"}>JavaScript - Fetch</MenuItem>
      </Select>
    )}
    <Button
      sx={{
        p: { xs: 0, md: "8px 16px" },
        color: "onSurface",
        fontSize: 14,
        fontWeight: 500,
        ":hover": {
          bgcolor: "action.hover",
        },
      }}
      onClick={onClick}
      disabled={status === "success" && isActive}
    >
      {status === "success" && isActive ? "Copied" : "Copy"}
    </Button>
  </Stack>
);

export default function ApiAccess({ template }: Props) {
  const [snippet, setSnippet] = useState<any | null>(null);
  const [output, setOutput] = useState<any[]>([]);
  const [language, setLanguage] = useState("0");
  const [copy, result] = useCopyToClipboard();
  const token = useToken();
  const { prepareExecutionData } = useApiAccess(template);

  const integrateAPIRef = useRef(false);
  const responseFormatRef = useRef(false);
  const getExecutionRef = useRef(false);

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleCopy = (section: string, text: string) => {
    copy(text);
    integrateAPIRef.current = section === "integrateAPI";
    responseFormatRef.current = section === "responseFormat";
    getExecutionRef.current = section === "getExecution";
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
        postData: { text: prepareExecutionData() },
      }),
    );
  }, [template]);

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
      p={{ xs: "16px 24px", md: "48px" }}
    >
      <Typography
        fontSize={{ xs: 24, md: 32 }}
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
            onClick={() => handleCopy("integrateAPI", `POST an execution:\n\`\`\`sh\n${output[0]}\n\`\`\``)}
            isActive={integrateAPIRef.current}
          />
        </Stack>
        <Stack
          overflow={"auto"}
          sx={{ maxWidth: "90vw" }}
          boxSizing={"border-box"}
        >
          <SyntaxHighlighter {...snippetProps}>{output[0]}</SyntaxHighlighter>
        </Stack>
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
            onClick={() =>
              handleCopy(
                "responseFormat",
                `Execution response:\n\`\`\`sh\n{\n   "template_execution_id": number,   \n}\n\`\`\``,
              )
            }
            isActive={responseFormatRef.current}
            noSelect
          />
        </Stack>
        <Stack
          overflow={"auto"}
          sx={{ maxWidth: "90vw" }}
          boxSizing={"border-box"}
        >
          <SyntaxHighlighter
            {...snippetProps}
            showLineNumbers={false}
          >{`{\n   "template_execution_id": number,   \n}`}</SyntaxHighlighter>
        </Stack>
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
            onClick={() => handleCopy("getExecution", `GET an execution:\n\`\`\`sh\n${output[1]}\n\`\`\``)}
            isActive={getExecutionRef.current}
          />
        </Stack>
        <Stack
          overflow={"auto"}
          sx={{ maxWidth: "90vw" }}
          boxSizing={"border-box"}
        >
          <SyntaxHighlighter {...snippetProps}>{output[1]}</SyntaxHighlighter>
        </Stack>
      </Box>
    </Stack>
  );
}
