import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
// react-syntax
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import shell from "react-syntax-highlighter/dist/cjs/languages/hljs/shell";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import php from "react-syntax-highlighter/dist/cjs/languages/hljs/php";
import HTTPSnippet from "httpsnippet";
//
import useToken from "@/hooks/useToken";

interface Props {
  method: string;
  lang: string;
  data?: object;
  url: string;
  onSnippetChange: (snippet: string) => void;
}

// setup SyntaxHighlighter using the langType
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("shell", shell);

export default function Snippet({ onSnippetChange, method, lang, data, url }: Props) {
  const token = useToken();
  const [snippet, setSnippet] = useState("");

  useEffect(() => {
    const convertSnippet = () => {
      const postData =
        data && Object.keys(data).length > 0
          ? {
              mimeType: "application/json",
              text: JSON.stringify({ data }),
            }
          : undefined;

      const snippet = new HTTPSnippet({
        method,
        url,
        headers: [
          { name: "Authorization", value: `Token ${token}` },
          { name: "Accept", value: "application/json" },
          { name: "Content-Type", value: "application/json" },
        ],
        postData,
      });

      let result;
      switch (lang) {
        case "javascript":
          result = snippet.convert("javascript");
          break;
        case "python":
          result = snippet.convert("python");
          break;
        case "php":
          result = snippet.convert("php");
          break;
        case "shell":
          result = snippet.convert("shell");
          break;
        default:
          result = data;
      }

      setSnippet(result);
      onSnippetChange(result);
    };
    convertSnippet();
  }, [lang, data]);

  return (
    <Stack
      overflow={"auto"}
      sx={{ maxWidth: "90vw" }}
      boxSizing={"border-box"}
    >
      <SyntaxHighlighter
        customStyle={{
          borderRadius: "16px",
          background: "#1B1B1F",
          color: "white",
          margin: 0,
          padding: "16px 16px 16px 24px",
          overflow: "auto",
        }}
        language={lang}
        style={docco}
        showLineNumbers={true}
        wrapLongLines={true}
      >
        {snippet}
      </SyntaxHighlighter>
    </Stack>
  );
}
