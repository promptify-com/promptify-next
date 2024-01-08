import React from "react";
import { sanitizeHTML } from "@/common/helpers/htmlHelper";
import { Box } from "@mui/material";

interface GeneratedContentProps {
  content: string;
}

export const GeneratedContent: React.FC<GeneratedContentProps> = ({ content }) => {
  return (
    <Box
      sx={{
        border: "1px solid rgba(27, 27, 30, 0.23)",
        borderRadius: "8px",
        p: "12px",
        minHeight: "200px",
        maxHeight: "500px",
        overflow: "auto",
        overscrollBehavior: "contain",
        fontSize: 15,
        fontWeight: 400,
        color: "onSurface",
        wordWrap: "break-word",
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
        __html: sanitizeHTML(content),
      }}
    />
  );
};
