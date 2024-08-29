import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect } from "react";

function wrapImages(content: string) {
  const imgRegex = /(https?:\/\/\S+\.(?:jpg|jpeg|png|gif|bmp|svg))/g;

  return content.replace(imgRegex, match => {
    return `<img src="${match}" alt="image" width="100%" />`;
  });
}

export const ExecutionContent = ({ content, sx }: { content: string; sx?: SxProps }) => {
  useEffect(() => {
    const handleClick = async (event: MouseEvent) => {
      const clickTarget = event.target as HTMLElement;
      if (clickTarget.classList.contains("copy-button")) {
        const codeWrapper = clickTarget.closest("pre") as HTMLElement | null;
        if (codeWrapper) {
          const codeElement = codeWrapper.querySelector("code") as HTMLElement | null;
          if (codeElement) {
            try {
              await navigator.clipboard.writeText(codeElement.innerText);
              clickTarget.innerText = "Copied!";
              setTimeout(() => (clickTarget.innerText = "Copy code"), 3000);
            } catch (error) {
              console.error("Failed to copy code:", error);
            }
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        fontSize: { xs: 14, md: 15 },
        lineHeight: "170%",
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
          overflowX: "auto",
          whiteSpace: "nowrap",
          code: {
            display: "block",
            padding: "16px 24px",
            borderRadius: 0,
            margin: 0,
          },
        },
        code: {
          bgcolor: "#282a35",
          color: "common.white",
          borderRadius: "4px",
          padding: "4px 6px",
          marginBottom: "10px",
          overflowX: "auto",
          fontSize: { xs: 12, md: 13 },
          whiteSpace: "pre-wrap",
          display: "block",
          maxWidth: "100%",
          boxSizing: "border-box",
        },
        ".code-wrapper-header": {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "8px 24px",
          bgcolor: "#4d5562",
          color: "#ffffff",
          fontSize: 13,
        },
        ".copy-button": {
          bgcolor: "transparent",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
          p: 0,
          ":hover": {
            color: "#efefef",
          },
        },
        ...(sx || {}),
      }}
      dangerouslySetInnerHTML={{
        __html: wrapImages(content),
      }}
    />
  );
};
