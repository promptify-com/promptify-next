import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import { updatePopupTemplate } from "@/core/store/templatesSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { ExecutionCard } from "@/components/Prompt/ExecutionCard";
import Header from "./Header";
import Details from "./Details";
import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";

interface Props {
  document: ExecutionWithTemplate;
}

function DocumentPage({ document }: Props) {
  const [showPreviews, setShowPreviews] = useState(false);

  const template = document.template;

  return (
    <Box
      sx={{
        height: "calc(100svh - 24px)",
        width: "calc(100% - 64px)",
        bgcolor: "surfaceContainerLowest",
        pl: "72px",
        pr: "92px",
        position: "relative",
      }}
    >
      <Header document={document} />
      <Stack
        direction={"row"}
        alignItems={"flex-start"}
        height={{
          md: `calc(100% - 119px)`,
        }}
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        <Tooltip
          title="Preview"
          enterDelay={500}
          enterNextDelay={1000}
        >
          <IconButton
            sx={{
              position: "absolute",
              zIndex: 999,
              top: "150px",
              left: "20px",
              border: "none",
              p: "16px",
              bgcolor: showPreviews ? "surfaceContainer" : "transparent",
              color: "onSurface",
              ":hover": {
                color: "onSurface",
              },
            }}
            onClick={() => setShowPreviews(!showPreviews)}
          >
            <VisibilityOutlined />
          </IconButton>
        </Tooltip>
        <Box
          sx={{
            flex: 3,
            pr: "32px",
            height: "100%",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >
          <ExecutionCard
            execution={document}
            promptsData={template?.prompts || []}
            showPreview={showPreviews}
            noRepeat
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            height: "100%",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >
          <Details document={document} />
        </Box>
      </Stack>
      <Box
        flex={2}
        order={0}
      ></Box>
    </Box>
  );
}

export default DocumentPage;
