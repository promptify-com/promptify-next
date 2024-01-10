import React from "react";
import { sanitizeHTML } from "@/common/helpers/htmlHelper";
import { Box } from "@mui/material";
import { isImageOutput } from "@/components/Prompt/Utils";
import { EngineOutput } from "@/core/api/dto/templates";

interface GeneratedContentProps {
  content: string;
  engineType: EngineOutput;
}

export const GeneratedContent: React.FC<GeneratedContentProps> = ({ content, engineType }) => {
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
      }}
    >
      {isImageOutput(content, engineType) ? (
        <Box
          component={"img"}
          alt={"book cover"}
          src={content}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            (e.target as HTMLImageElement).src = require("@/assets/images/default-thumbnail.jpg");
          }}
          sx={{
            borderRadius: "8px",
            width: "80%",
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            fontSize: 15,
            fontWeight: 400,
            lineHeight: "28px",
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
      )}
    </Box>
  );
};
