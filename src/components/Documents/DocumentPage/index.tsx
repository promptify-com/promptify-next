import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import { updatePopupTemplate } from "@/core/store/templatesSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { theme } from "@/theme";
import { ExecutionCard } from "@/components/Prompt/ExecutionCard";
import Header from "./Header";

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
    <Stack
      height={{
        xs: `calc(100svh - 24px)`,
        md: `calc(100svh - 24px)`,
      }}
      sx={{
        bgcolor: "surfaceContainerLowest",
        overflow: { xs: "auto", md: "unset" },
        mt: { xs: theme.custom.headerHeight.xs, md: 0 },
        px: { md: "32px" },
      }}
    >
      <Header document={document} />
      <Box
        flex={4}
        order={{ xs: 1, md: 0 }}
        height={{
          md: `calc(100% - 24px)`,
        }}
        sx={{
          pr: { md: "32px" },
          overflow: { md: "auto" },
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        <Stack>
          <ExecutionCard
            execution={document}
            promptsData={document.template.prompts}
            showPreview={false}
            noRepeat
          />
        </Stack>
      </Box>
      <Box
        flex={2}
        order={0}
      ></Box>
    </Stack>
  );
}

export default DocumentPage;
