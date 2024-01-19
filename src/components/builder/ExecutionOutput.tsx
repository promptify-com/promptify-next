import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { isImageOutput } from "@/components/Prompt/Utils";
import ImagePopup from "@/components/dialog/ImagePopup";
import { EngineOutput } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";

interface Props {
  output: string;
  engineType: EngineOutput;
}

function ExecutionOutput({ output, engineType }: Props) {
  const [showImage, setShowImage] = useState<boolean>(false);
  const [content, setContent] = useState(output);

  useEffect(() => {
    if (!isImageOutput(output, engineType)) {
      import("@/common/helpers/htmlHelper").then(({ markdownToHTML, sanitizeHTML }) => {
        markdownToHTML(output).then(res => setContent(sanitizeHTML(res)));
      });
    }
  }, [output]);

  return isImageOutput(content, engineType) ? (
    <>
      <Image
        src={content}
        alt={content}
        style={{ borderRadius: "8px", objectFit: "cover", width: "80%", height: "fit-content" }}
        priority={false}
        onClick={() => setShowImage(true)}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          (e.target as HTMLImageElement).src = require("@/assets/images/default-thumbnail.jpg");
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
        __html: content,
      }}
    />
  );
}

export default ExecutionOutput;
