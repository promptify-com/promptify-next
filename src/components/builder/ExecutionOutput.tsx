import React, { useEffect, useState } from "react";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { Box } from "@mui/material";
import { isImageOutput } from "@/components/Prompt/Utils";
import ImagePopup from "@/components/dialog/ImagePopup";
import { EngineOutput } from "@/core/api/dto/templates";

interface Props {
  output: string;
  engineType: EngineOutput;
}

function ExecutionOutput({ output, engineType }: Props) {
  const [showImage, setShowImage] = useState<boolean>(false);
  const [content, setContent] = useState(output);

  useEffect(() => {
    markdownToHTML(output).then(res => setContent(res));
  }, [output]);

  return isImageOutput(content, engineType) ? (
    <>
      <Box
        component={"img"}
        alt={"cover"}
        src={content}
        onClick={() => setShowImage(true)}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          (e.target as HTMLImageElement).src = require("@/assets/images/default-thumbnail.jpg");
        }}
        sx={{
          borderRadius: "8px",
          width: "80%",
          objectFit: "cover",
          cursor: "pointer",
        }}
      />
      <ImagePopup
        open={showImage}
        imageUrl={content}
        onClose={() => setShowImage(false)}
      />
    </>
  ) : (
    <Box
      sx={{
        fontSize: 14,
        fontWeight: 400,
        lineHeight: "28px",
        color: "onSurface",
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
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
          fontSize: 12,
        },
      }}
      dangerouslySetInnerHTML={{
        __html: sanitizeHTML(content),
      }}
    />
  );
}

export default ExecutionOutput;
