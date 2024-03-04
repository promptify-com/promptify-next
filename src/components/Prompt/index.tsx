import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import Header from "@/components/Prompt/Common/Header";
import { Templates } from "@/core/api/dto/templates";
import TemplateDetails from "./Common/Sidebar/TemplateDetails";
import { Box } from "@mui/material";

interface Props {
  template: Templates;
}

function TemplatePage({ template }: Props) {
  const { isMobile } = useBrowser();

  return (
    <Stack
      direction={"row"}
      gap={4}
      height={{ md: "calc(100svh - 90px)" }}
      width={{ md: "90%" }}
      m={"auto"}
      bgcolor={"surface.1"}
    >
      <Stack flex={4}>{!isMobile && <Header template={template} />}</Stack>
      <Box flex={1}>
        <TemplateDetails template={template} />
      </Box>
    </Stack>
  );
}

export default TemplatePage;
