import React, { useRef, useState } from "react";
import { sanitizeHTML } from "@/common/helpers/htmlHelper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { isImageOutput } from "@/components/Prompt/Utils";
import { EngineOutput } from "@/core/api/dto/templates";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrolltoBottom";
import { South } from "@mui/icons-material";
import ImagePopup from "@/components/dialog/ImagePopup";
import Image from "@/components/design-system/Image";

interface GeneratedContentProps {
  content: string;
  engineType: EngineOutput;
  isGenerating: boolean;
}

function GeneratedContent({ content, engineType, isGenerating }: GeneratedContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { showScrollDown, scrollToBottom } = useScrollToBottom({ ref: containerRef, isGenerating, content });
  const [showImage, setShowImage] = useState<boolean>(false);

  return (
    <Box
      ref={containerRef}
      sx={{
        border: "1px solid rgba(27, 27, 30, 0.23)",
        borderRadius: "8px",
        p: "12px",
        height: "60svh",
        overflow: "auto",
        overscrollBehavior: "contain",
        position: "relative",
      }}
    >
      {isImageOutput(content, engineType) ? (
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
            fontSize: 15,
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
              fontSize: 13,
            },
          }}
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(content),
          }}
        />
      )}
      {showScrollDown && isGenerating && (
        <IconButton
          onClick={scrollToBottom}
          sx={{
            height: "32px",
            width: "32px",
            position: "sticky",
            left: "50%",
            bottom: "30px",
            zIndex: 999,
            bgcolor: "surface.3",
            boxShadow: "0px 4px 8px 3px #e1e2ece6, 0px 0px 4px 0px rgb(0 0 0 / 0%)",
            border: " none",
            ":hover": {
              bgcolor: "surface.5",
            },
          }}
        >
          <South sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  );
}

export default GeneratedContent;
