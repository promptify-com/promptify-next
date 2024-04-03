import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import { updatePopupTemplate } from "@/core/store/templatesSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { ExecutionCard } from "@/components/Prompt/ExecutionCard";
import Header from "./Header";
import Details from "./Details";

interface Props {
  document: ExecutionWithTemplate;
}

function DocumentPage({ document }: Props) {
  const { isMobile } = useBrowser();
  const dispatch = useAppDispatch();

  const template = document.template;

  return (
    <Box
      sx={{
        height: "calc(100svh - 24px)",
        width: "calc(100% - 64px)",
        bgcolor: "surfaceContainerLowest",
        px: "72px",
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
            showPreview={false}
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
