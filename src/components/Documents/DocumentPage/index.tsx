import Stack from "@mui/material/Stack";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import { ExecutionCard } from "@/components/Prompt/ExecutionCard";
import Header from "./Header";
import Details from "./Details";
import { useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import useBrowser from "@/hooks/useBrowser";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setDocumentTitle, toggleShowPreviews } from "@/core/store/documentsSlice";
import { updatePopupTemplate } from "@/core/store/templatesSlice";

interface Props {
  document: ExecutionWithTemplate;
}

function DocumentPage({ document }: Props) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();
  const showPreviews = useAppSelector(state => state.documents?.showPreviews ?? false);
  const template = document.template;

  useEffect(() => {
    dispatch(setDocumentTitle(document.title));
    dispatch(
      updatePopupTemplate({
        data: document,
      }),
    );
  }, [document.title]);

  return (
    <Box
      sx={{
        height: { md: "calc(100svh - 24px)" },
        width: { md: "calc(100% - 164px)" },
        bgcolor: { xs: "surfaceContainerLow", md: "surfaceContainerLowest" },
        p: { md: "0 92px 0 72px" },
        position: "relative",
        overflow: { xs: "auto", md: "unset" },
        overscrollBehavior: "contain",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Header document={document} />
      <Stack
        direction={{ md: "row" }}
        alignItems={{ md: "flex-start" }}
        height={{
          md: `calc(100% - 119px)`,
        }}
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {!isMobile && (
          <Tooltip
            title={`${showPreviews ? "Hide" : "Show"} Preview`}
            enterDelay={500}
            enterNextDelay={500}
          >
            <IconButton
              sx={{
                position: "absolute",
                zIndex: 999,
                top: "170px",
                left: "22px",
                border: "none",
                p: "16px",
                bgcolor: showPreviews ? "surfaceContainer" : "transparent",
                color: "onSurface",
                ":hover": {
                  bgcolor: showPreviews ? "surfaceContainer" : "transparent",
                  color: "onSurface",
                },
              }}
              onClick={() => dispatch(toggleShowPreviews())}
            >
              <VisibilityOutlined />
            </IconButton>
          </Tooltip>
        )}
        <Box
          sx={{
            order: { md: 1 },
            flex: 1,
            px: { xs: "24px", md: 0 },
            height: "100%",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >
          <Details document={document} />
        </Box>
        <Box
          sx={{
            order: { md: 0 },
            flex: 3,
            pr: { md: "32px" },
            height: "100%",
            bgcolor: "surfaceContainerLowest",
            borderRadius: "16px",
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
          />
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
