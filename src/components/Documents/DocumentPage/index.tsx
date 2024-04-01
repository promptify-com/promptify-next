import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import { updatePopupTemplate } from "@/core/store/templatesSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { theme } from "@/theme";
import { ExecutionCard } from "@/components/Prompt/ExecutionCard";
import Header from "./Header";
import Details from "./Details";

interface Props {
  document: ExecutionWithTemplate;
}

function DocumentPage({ document }: Props) {
  const { isMobile } = useBrowser();
  const dispatch = useAppDispatch();

  const closeTemplatePopup = () => {
    dispatch(
      updatePopupTemplate({
        data: null,
      }),
    );
  };

  return (
    <Box
      sx={{
        height: "calc(100svh - 24px)",
        width: "calc(100% - 64px)",
        bgcolor: "surfaceContainerLowest",
        px: "32px",
      }}
    >
      <Header document={document} />
      <Stack
        direction={"row"}
        alignItems={"flex-start"}
        gap={4}
        height={{
          md: `calc(100% - 24px)`,
        }}
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        <ExecutionCard
          execution={document}
          promptsData={document.template.prompts}
          showPreview={false}
          noRepeat
        />
        <Details document={document} />
      </Stack>
      <Box
        flex={2}
        order={0}
      ></Box>
    </Box>
  );
}

export default DocumentPage;
